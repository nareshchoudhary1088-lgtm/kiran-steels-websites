$zipPath = "C:\Users\KIRAN STEEL\Desktop\Stainless Steel Compound\WhatsApp Unknown 2026-07-10 at 7.53.56 PM.zip"
$tempDir = "temp_gold_glass_extract"

Write-Host "Extracting from $zipPath"

Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $tempDir | Out-Null
Expand-Archive -Path $zipPath -DestinationPath $tempDir -Force

$files = Get-ChildItem -Path $tempDir -File -Recurse | Where-Object { $_.Extension -match "\.(jpg|jpeg|png|webp)$" }
Write-Host "Found $($files.Count) images."

$i = 1
foreach ($file in $files) {
    $ext = $file.Extension
    $newName = "ss-gold-glass-railing-$i$ext"
    Copy-Item -Path $file.FullName -Destination "src\assets\$newName" -Force
    Write-Host "Copied: $newName"
    $i++
}
Remove-Item -Recurse -Force $tempDir
Write-Host "Extraction and renaming complete."
