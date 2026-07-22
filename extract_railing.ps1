$zipFile = Get-ChildItem "C:\Users\KIRAN STEEL\Desktop\Stainless Steel Compound" -Filter "*.zip" | Select-Object -First 1
$zipPath = $zipFile.FullName
Write-Host "Found zip: $zipPath"

$tempDir = "temp_railing_extract"
Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $tempDir
Expand-Archive -Path $zipPath -DestinationPath $tempDir -Force

$files = Get-ChildItem -Path $tempDir -File -Recurse | Where-Object { $_.Extension -match "\.(jpg|jpeg|png|webp)$" }
Write-Host "Found $($files.Count) images"
$i = 1
foreach ($file in $files) {
    $ext = $file.Extension
    $newName = "modern-railing-design-$i$ext"
    Copy-Item -Path $file.FullName -Destination "src\assets\$newName" -Force
    Write-Host "Copied: $newName"
    $i++
}
Remove-Item -Recurse -Force $tempDir
Write-Host "Done! Copied $($i-1) images."
