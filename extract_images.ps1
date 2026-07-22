$zipPath = "C:\Users\KIRAN STEEL\Desktop\Stainless Steel Compound\WhatsApp Unknown 2026-07-05 at 3.11.40 PM.zip"
$tempDir = "temp_extract"
Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $tempDir
Expand-Archive -Path $zipPath -DestinationPath $tempDir -Force

$files = Get-ChildItem -Path $tempDir -File
$i = 1
foreach ($file in $files) {
    $ext = $file.Extension
    $newName = "plain-compound-ss-gate-$i$ext"
    Move-Item -Path $file.FullName -Destination "src\assets\$newName" -Force
    $i++
}
Remove-Item -Recurse -Force $tempDir
