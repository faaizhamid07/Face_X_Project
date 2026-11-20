#!/usr/bin/env python3
"""
Face-X Project Runner
=====================
Launches both the FastAPI backend and React frontend simultaneously with a single command.

Usage:
    python run.py [--no-browser] [--port-backend 8000] [--port-frontend 5173]
"""

import os
import sys
import shutil
import subprocess
import threading
import time
import signal
import webbrowser
import platform

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")
FRONTEND_DIR = os.path.join(PROJECT_ROOT, "frontend")
IS_WINDOWS = platform.system() == "Windows"

# ANSI Colors
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
MAGENTA = "\033[95m"
BOLD = "\033[1m"
RESET = "\033[0m"

# Enable ANSI colors on Windows terminals
if IS_WINDOWS:
    os.system("")


def print_banner():
    print(f"""{CYAN}{BOLD}
╔══════════════════════════════════════════════════════════════╗
║               Face-X Facial Verification App                 ║
║               Real-time Siamese Neural Network               ║
╚══════════════════════════════════════════════════════════════╝{RESET}
""")


def get_backend_python():
    """Locate the virtual environment's Python executable or fallback to current python."""
    candidates = [
        os.path.join(BACKEND_DIR, ".venv", "Scripts", "python.exe"),
        os.path.join(BACKEND_DIR, ".venv", "bin", "python"),
        os.path.join(PROJECT_ROOT, ".venv", "Scripts", "python.exe"),
        os.path.join(PROJECT_ROOT, ".venv", "bin", "python"),
    ]
    for path in candidates:
        if os.path.isfile(path):
            return path
    return sys.executable


def get_npm_cmd():
    """Locate npm executable."""
    if IS_WINDOWS:
        return "npm.cmd" if shutil.which("npm.cmd") else "npm"
    return "npm"


def stream_logs(pipe, prefix, color):
    """Read lines from process stdout/stderr and print with prefix."""
    try:
        for line in iter(pipe.readline, ""):
            if not line:
                break
            stripped = line.rstrip("\r\n")
            if stripped:
                print(f"{color}[{prefix}]{RESET} {stripped}", flush=True)
    except Exception:
        pass
    finally:
        try:
            pipe.close()
        except Exception:
            pass


def kill_process_tree(proc):
    """Reliably terminate a process and all its child/grandchild processes."""
    if proc is None:
        return
    try:
        if IS_WINDOWS:
            subprocess.run(
                ["taskkill", "/F", "/T", "/PID", str(proc.pid)],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                check=False,
            )
        else:
            proc.terminate()
            try:
                proc.wait(timeout=2)
            except subprocess.TimeoutExpired:
                proc.kill()
    except Exception:
        try:
            proc.kill()
        except Exception:
            pass


def main():
    print_banner()

    auto_open_browser = "--no-browser" not in sys.argv

    # 1. Resolve Python executable
    py_exec = get_backend_python()
    print(f"{GREEN}✓{RESET} Backend Python: {py_exec}")

    # 2. Check Node & Frontend
    npm_cmd = get_npm_cmd()
    if not shutil.which(npm_cmd):
        print(f"{RED}Error: 'npm' was not found in PATH. Please install Node.js (v18+) to run the frontend.{RESET}")
        sys.exit(1)

    node_modules = os.path.join(FRONTEND_DIR, "node_modules")
    if not os.path.isdir(node_modules):
        print(f"{YELLOW}node_modules not found in frontend/. Installing dependencies...{RESET}")
        subprocess.run([npm_cmd, "install"], cwd=FRONTEND_DIR, check=True)

    print(f"{GREEN}✓{RESET} Frontend Node/NPM: Ready\n")

    backend_proc = None
    frontend_proc = None
    stop_event = threading.Event()

    def shutdown(signum=None, frame=None):
        if stop_event.is_set():
            return
        stop_event.set()
        print(f"\n{YELLOW}Shutting down Face-X servers...{RESET}")
        kill_process_tree(backend_proc)
        kill_process_tree(frontend_proc)
        print(f"{GREEN}All servers stopped cleanly. Goodbye!{RESET}")
        sys.exit(0)

    # Register signal handlers
    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    print(f"{BOLD}Starting services:{RESET}")
    print(f"  • {MAGENTA}Backend API:{RESET}  http://localhost:8000 (Swagger docs: http://localhost:8000/docs)")
    print(f"  • {CYAN}Frontend UI:{RESET}  http://localhost:5173")
    print(f"  (Press {BOLD}Ctrl+C{RESET} to stop both servers at any time)\n")
    print(f"{'─' * 64}\n")

    # Start Backend
    backend_cmd = [py_exec, "-m", "uvicorn", "app.main:app", "--port", "8000"]
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=BACKEND_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
    )
    b_thread = threading.Thread(
        target=stream_logs,
        args=(backend_proc.stdout, "Backend", MAGENTA),
        daemon=True,
    )
    b_thread.start()

    # Start Frontend
    frontend_cmd = [npm_cmd, "run", "dev"]
    frontend_proc = subprocess.Popen(
        frontend_cmd,
        cwd=FRONTEND_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
    )
    f_thread = threading.Thread(
        target=stream_logs,
        args=(frontend_proc.stdout, "Frontend", CYAN),
        daemon=True,
    )
    f_thread.start()

    # Optional auto-open browser after 2 seconds
    if auto_open_browser:
        def open_browser():
            time.sleep(2.5)
            if not stop_event.is_set():
                try:
                    webbrowser.open("http://localhost:5173")
                except Exception:
                    pass

        threading.Thread(target=open_browser, daemon=True).start()

    # Wait for either process to terminate
    try:
        while not stop_event.is_set():
            if backend_proc.poll() is not None:
                print(f"\n{RED}Backend process exited unexpectedly (code {backend_proc.returncode}).{RESET}")
                shutdown()
            if frontend_proc.poll() is not None:
                print(f"\n{RED}Frontend process exited unexpectedly (code {frontend_proc.returncode}).{RESET}")
                shutdown()
            time.sleep(0.5)
    except KeyboardInterrupt:
        shutdown()


if __name__ == "__main__":
    main()
