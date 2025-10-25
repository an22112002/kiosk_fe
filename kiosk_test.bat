@echo off
set CONTAINER_NAME=my_kiosk
set IMAGE_NAME=kfe

echo Kiểm tra container đang chạy...
docker ps -q -f name=%CONTAINER_NAME% >nul
if %errorlevel% neq 0 (
    echo Container chưa chạy. Đang khởi động...
    docker start %CONTAINER_NAME% 2>nul || docker run -d -p 80:80 --name %CONTAINER_NAME% %IMAGE_NAME%
) else (
    echo Container đã chạy sẵn
)

REM ===============================
REM   Mở Chrome ở chế độ kiosk
REM ===============================

echo Mở Chrome ở chế độ kiosk...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app=http://localhost:80

echo Hoàn tất.
exit
