#!/usr/bin/env python3
"""Face-X: install dependencies when needed and launch backend + frontend.

Requires Python 3.12 and Node.js/npm installed on the host.
"""
import hashlib
import os
from pathlib import Path
import platform
import shutil
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
import webbrowser

ROOT = Path(__file__).resolve().parent
BACKEND = ROOT / "backend"
FRONTEND = ROOT / "frontend"
VENV = ROOT / ".venv"
WINDOWS = platform.system() == "Windows"
VENV_PYTHON = VENV / ("Scripts/python.exe" if WINDOWS else "bin/python")
REQUIREMENTS = BACKEND / "requirements.txt"
STAMP = VENV / ".face-x-requirements.sha256"


def command_output(args):
    try:
        result = subprocess.run(args, capture_output=True, text=True, timeout=20)
        return result.stdout.strip() if result.returncode == 0 else None
    except (OSError, subprocess.TimeoutExpired):
        return None


def python_version(command):
    return command_output(command + ["-c", "import sys; print('%d.%d' % sys.version_info[:2])"])


def find_python312():
    candidates = [[sys.executable], ["py", "-3.12"]] if WINDOWS else [[sys.executable], ["python3.12"]]
    for candidate in candidates:
        if python_version(candidate) == "3.12":
            return candidate
    raise RuntimeError("Python 3.12 is required. Install it, then rerun. Python 3.14 can remain your default.")


def ensure_backend():
    if not REQUIREMENTS.is_file():
        raise RuntimeError("Missing backend/requirements.txt")
    if VENV_PYTHON.is_file() and python_version([str(VENV_PYTHON)]) != "3.12":
        raise RuntimeError("Existing .venv is not Python 3.12. Rename .venv and rerun.")
    if not VENV_PYTHON.is_file():
        print("[Setup] Creating Python 3.12 environment...", flush=True)
        subprocess.run(find_python312() + ["-m", "venv", str(VENV)], check=True)
    python = str(VENV_PYTHON)
    digest = hashlib.sha256(REQUIREMENTS.read_bytes()).hexdigest()
    probe = command_output([python, "-c", "import fastapi, uvicorn, numpy, PIL, cv2, tensorflow; print('ok')"])
    if STAMP.exists() and STAMP.read_text().strip() == digest and probe == "ok":
        return python
    print("[Setup] Checking/installing backend dependencies (first run can take several minutes)...", flush=True)
    subprocess.run([python, "-m", "pip", "install", "-r", str(REQUIREMENTS)], check=True)
    probe = command_output([python, "-c", "import fastapi, uvicorn, numpy, PIL, cv2, tensorflow; print('ok')"])
    if probe != "ok":
        raise RuntimeError("Backend dependency import check failed. Review installation output.")
    STAMP.write_text(digest)
    return python


def ensure_frontend():
    npm = "npm.cmd" if WINDOWS else "npm"
    if not shutil.which(npm):
        raise RuntimeError("Node.js/npm not found. Install Node.js 18+ and reopen your terminal.")
    if not (FRONTEND / "node_modules").is_dir():
        print("[Setup] Installing frontend packages...", flush=True)
        command = "ci" if (FRONTEND / "package-lock.json").is_file() else "install"
        subprocess.run([npm, command], cwd=FRONTEND, check=True)
    return npm


def stream_logs(pipe, label):
    for line in pipe:
        print("[%s] %s" % (label, line.rstrip()), flush=True)


def stop_process(proc):
    if proc is None or proc.poll() is not None:
        return
    if WINDOWS:
        subprocess.run(["taskkill", "/F", "/T", "/PID", str(proc.pid)],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
    else:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()


def wait_for_backend(proc, seconds=180):
    print("[Startup] Waiting for backend model initialization...", flush=True)
    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        if proc.poll() is not None:
            raise RuntimeError("Backend exited during startup. Read [Backend] logs above.")
        try:
            with urllib.request.urlopen("http://127.0.0.1:8000/health", timeout=2) as response:
                if response.status == 200:
                    return
        except (urllib.error.URLError, TimeoutError, OSError):
            pass
        time.sleep(1)
    raise RuntimeError("Backend not ready after 180 seconds. Read [Backend] logs above.")


def main():
    backend = frontend = None
    try:
        python = ensure_backend()
        npm = ensure_frontend()
        print("[Startup] Backend Python:", python, flush=True)
        backend = subprocess.Popen([python, "-m", "uvicorn", "app.main:app",
                                    "--host", "127.0.0.1", "--port", "8000"],
                                   cwd=BACKEND, stdout=subprocess.PIPE,
                                   stderr=subprocess.STDOUT, text=True, bufsize=1, errors="replace")
        threading.Thread(target=stream_logs, args=(backend.stdout, "Backend"), daemon=True).start()
        wait_for_backend(backend)
        print("[Startup] Backend ready. Starting frontend...", flush=True)
        frontend = subprocess.Popen([npm, "run", "dev", "--", "--host", "127.0.0.1", "--strictPort"],
                                    cwd=FRONTEND, stdout=subprocess.PIPE,
                                    stderr=subprocess.STDOUT, text=True, bufsize=1, errors="replace")
        threading.Thread(target=stream_logs, args=(frontend.stdout, "Frontend"), daemon=True).start()
        time.sleep(2)
        if frontend.poll() is not None:
            raise RuntimeError("Frontend exited. Check [Frontend] logs (port 5173 may be in use).")
        if "--no-browser" not in sys.argv:
            webbrowser.open("http://localhost:5173")
        print("Face-X: http://localhost:5173 | API: http://localhost:8000/docs", flush=True)
        print("Press Ctrl+C to stop.", flush=True)
        while True:
            if backend.poll() is not None:
                raise RuntimeError("Backend exited. Check [Backend] logs.")
            if frontend.poll() is not None:
                raise RuntimeError("Frontend exited. Check [Frontend] logs.")
            time.sleep(0.5)
    except KeyboardInterrupt:
        print("\nStopping Face-X...", flush=True)
    except (RuntimeError, subprocess.CalledProcessError) as exc:
        print("ERROR:", exc, file=sys.stderr, flush=True)
        return 1
    finally:
        stop_process(frontend)
        stop_process(backend)
    return 0


if __name__ == "__main__":
    sys.exit(main())
