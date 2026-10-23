@echo off
setlocal EnableExtensions
title Cloudflare Tunnel - Web Ucapan Ulang Tahun

REM ============================================================
REM  Cloudflare Quick Tunnel untuk XAMPP
REM  Jalankan Apache di XAMPP Control Panel terlebih dahulu.
REM ============================================================

cd /d "%~dp0"

set "ORIGIN=http://localhost:80"
set "SITE_PATH=/birthday/"

REM Opsional: ganti path situs lewat argumen pertama.
REM Contoh: start-cloudflare-tunnel.bat /ultah/
if not "%~1"=="" set "SITE_PATH=%~1"

set "CLOUDFLARED=cloudflared"
where cloudflared >nul 2>nul
if errorlevel 1 (
    if exist "%ProgramFiles(x86)%\cloudflared\cloudflared.exe" (
        set "CLOUDFLARED=%ProgramFiles(x86)%\cloudflared\cloudflared.exe"
    ) else if exist "%ProgramFiles%\cloudflared\cloudflared.exe" (
        set "CLOUDFLARED=%ProgramFiles%\cloudflared\cloudflared.exe"
    ) else (
        echo.
        echo [ERROR] cloudflared belum terpasang.
        echo.
        echo Install dulu dengan salah satu cara berikut:
        echo   1. winget install --id Cloudflare.cloudflared
        echo   2. Download dari https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
        echo.
        echo Setelah terpasang, tutup lalu buka kembali Command Prompt / file ini.
        echo.
        pause
        exit /b 1
    )
)

echo.
echo Memeriksa Apache XAMPP di %ORIGIN% ...
where curl >nul 2>nul
if not errorlevel 1 (
    curl -s -o nul --max-time 4 "%ORIGIN%"
    if errorlevel 1 (
        echo.
        echo [PERINGATAN] Apache belum merespons di %ORIGIN%.
        echo Buka XAMPP Control Panel lalu klik Start pada Apache, kemudian jalankan file ini lagi.
        echo.
        pause
        exit /b 1
    )
)

echo Apache merespons. Membuka Cloudflare Quick Tunnel...
echo.
echo ============================================================
echo  Setelah beberapa detik akan muncul URL seperti:
echo    https://nama-acak.trycloudflare.com
echo.
echo  Link yang dibagikan ke teman:
echo    https://nama-acak.trycloudflare.com%SITE_PATH%
echo.
echo  Jangan tutup jendela ini selama web masih dipakai.
echo  Tekan Ctrl+C untuk menghentikan tunnel.
echo ============================================================
echo.

"%CLOUDFLARED%" tunnel --url "%ORIGIN%"

echo.
echo Tunnel berhenti.
pause
