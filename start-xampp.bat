@echo off
setlocal EnableExtensions
title Start Web Ulang Tahun - XAMPP
cd /d "%~dp0"

REM ============================================================
REM  Jalankan file ini dari folder proyek (yang ada package.json).
REM  Script akan menyalin xampp\birthday ke htdocs\birthday,
REM  menyalakan Apache, lalu membuka web di browser.
REM ============================================================

REM Ubah baris ini kalau XAMPP tidak terpasang di C:\xampp.
if not defined XAMPP_DIR set "XAMPP_DIR=C:\xampp"
if not exist "%XAMPP_DIR%\apache\bin\httpd.exe" (
    if exist "D:\xampp\apache\bin\httpd.exe" set "XAMPP_DIR=D:\xampp"
)

if not exist "%XAMPP_DIR%\apache\bin\httpd.exe" (
    echo.
    echo [ERROR] XAMPP tidak ditemukan di "%XAMPP_DIR%".
    echo Edit baris "set XAMPP_DIR=..." di file ini sesuai lokasi XAMPP kamu.
    echo.
    pause
    exit /b 1
)

set "SOURCE=%~dp0xampp\birthday"
set "DEST=%XAMPP_DIR%\htdocs\birthday"
set "SITE_URL=http://localhost/birthday/"

if not exist "%SOURCE%\index.html" (
    echo.
    echo [ERROR] Paket build belum ada di:
    echo   %SOURCE%
    echo.
    echo Jalankan dulu dari folder proyek:
    echo   npm install
    echo   npm run build:xampp
    echo.
    pause
    exit /b 1
)

call :install_site
if errorlevel 1 goto fail

if /I "%~1"=="--install-only" (
    echo.
    echo Paket siap di:
    echo   %DEST%
    exit /b 0
)

call :start_apache
if errorlevel 1 goto fail

start "" "%SITE_URL%"
echo.
echo Web lokal : %SITE_URL%
echo Web publik: jalankan Cloudflare Tunnel di bawah.
echo.
echo Jendela "Apache XAMPP" jangan ditutup selama web dipakai.
echo.

choice /C YN /N /M "Buka Cloudflare Tunnel sekarang? [Y/N] "
if errorlevel 2 goto done

if exist "%~dp0start-cloudflare-tunnel.bat" (
    call "%~dp0start-cloudflare-tunnel.bat"
) else (
    echo File start-cloudflare-tunnel.bat tidak ditemukan di folder proyek.
    pause
)
goto done


:install_site
if not exist "%XAMPP_DIR%\htdocs" mkdir "%XAMPP_DIR%\htdocs"

if exist "%DEST%\index.html" (
    if exist "%DEST%\assets" (
        if exist "%DEST%\api" (
            if exist "%DEST%\data" (
                echo Paket sudah terpasang di:
                echo   %DEST%
                if not exist "%DEST%\.htaccess" copy /Y "%SOURCE%\.htaccess" "%DEST%\.htaccess" >nul
                exit /b 0
            )
        )
    )
)

if exist "%DEST%" (
    echo Folder lama belum berisi paket build yang benar.
    echo Memindahkannya ke folder backup di "%XAMPP_DIR%"...
    move "%DEST%" "%XAMPP_DIR%\birthday-backup-%RANDOM%" >nul
    if errorlevel 1 (
        echo.
        echo [ERROR] Gagal memindahkan folder lama.
        echo Tutup jendela Explorer yang sedang membuka folder itu, lalu coba lagi.
        exit /b 1
    )
)

echo Menyalin paket XAMPP ke:
echo   %DEST%
robocopy "%SOURCE%" "%DEST%" /E /NFL /NDL /NJH /NJS /NP >nul
if errorlevel 8 (
    echo.
    echo [ERROR] Gagal menyalin paket. Periksa izin folder htdocs.
    exit /b 1
)

if not exist "%DEST%\.htaccess" copy /Y "%SOURCE%\.htaccess" "%DEST%\.htaccess" >nul
echo Paket siap.
exit /b 0


:start_apache
tasklist /FI "IMAGENAME eq httpd.exe" 2>nul | find /I "httpd.exe" >nul
if errorlevel 1 (
    echo Menyalakan Apache...
    if exist "%XAMPP_DIR%\apache_start.bat" (
        start "Apache XAMPP" /D "%XAMPP_DIR%" "%XAMPP_DIR%\apache_start.bat"
    ) else (
        start "Apache XAMPP" /D "%XAMPP_DIR%\apache" "%XAMPP_DIR%\apache\bin\httpd.exe"
    )
) else (
    echo Apache sudah berjalan.
)

where curl >nul 2>nul
if errorlevel 1 (
    timeout /t 5 /nobreak >nul
    exit /b 0
)

set /a tries=0
:wait_apache
curl -s -o nul --fail --max-time 2 "%SITE_URL%" >nul 2>nul
if not errorlevel 1 (
    echo Apache siap.
    exit /b 0
)

set /a tries+=1
if %tries% GEQ 15 (
    echo.
    echo [PERINGATAN] Apache belum merespons di %SITE_URL%
    echo Buka XAMPP Control Panel lalu Start Apache.
    echo Kalau tetap gagal, cek apakah port 80 dipakai aplikasi lain:
    echo   netstat -ano ^| findstr :80
    exit /b 1
)

timeout /t 1 /nobreak >nul
goto wait_apache


:fail
echo.
echo Gagal memulai web. Baca pesan di atas.
pause
exit /b 1


:done
echo.
echo Selesai.
exit /b 0
