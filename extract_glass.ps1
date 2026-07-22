$zipFiles = Get-ChildItem "C:\Users\KIRAN STEEL\Desktop\Stainless Steel Compound" -Filter "*.zip"
Write-Host "Found $($zipFiles.Count) zip files"

$tempDir = "temp_glass_extract"
Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $tempDir

foreach ($zip in $zipFiles) {
    Write-Host "Extracting: $($zip.Name)"
    Expand-Archive -Path $zip.FullName -DestinationPath $tempDir -Force
}

$files = Get-ChildItem -Path $tempDir -File -Recurse | Where-Object { $_.Extension -match "\.(jpg|jpeg|png|webp)$" }
Write-Host "Found $($files.Count) images total"
$i = 1
foreach ($file in $files) {
    $ext = $file.Extension
    $newName = "ss-glass-railing-new-$i$ext"
    Copy-Item -Path $file.FullName -Destination "src\assets\$newName" -Force
    Write-Host "Copied: $newName"
    $i++
}
Remove-Item -Recurse -Force $tempDir
Write-Host "Done! Copied $($i-1) images."
