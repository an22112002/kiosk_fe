$image_name = "kiosk_fe"
$container_name = "kiosk_fe"

Write-Host "Checking image '$image_name' exists..."
$image = docker images -q $image_name

if ($image) {
    Write-Host "Image'$image_name' exists. Stop install process."
    exit 1
}

Write-Host "Image '$image_name' does not exist. Continue install process."
docker build -t $image_name .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to build image '$image_name'. Stop install process."
    exit 1
}

Write-Host "Running container '$container_name' from image '$image_name'..."

docker run -d -v d:/kiosk_config/ban.txt:/usr/share/nginx/html/file/ban.txt --restart=always --name $container_name -p 80:80 $image_name


if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to run container '$container_name' from image '$image_name'. Stop install process."
    exit 1
}

Write-Host "Container '$container_name' is running successfully."