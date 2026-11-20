@echo off
title Face-X Application
python run.py %*
if errorlevel 1 (
    echo.
    echo Failed to start with 'python'. Trying 'py'...
    py run.py %*
)
