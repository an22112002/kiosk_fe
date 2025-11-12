REM ===============================
REM   Mở Chrome ở chế độ kiosk
REM ===============================

echo Mở Chrome ở chế độ kiosk...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app=http://localhost:3000/access

echo Hoàn tất.
exit
