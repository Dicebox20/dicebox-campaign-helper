$ErrorActionPreference = 'SilentlyContinue'
Write-Output '== FOUNDRY_PROCESSES =='
Get-CimInstance Win32_Process | Where-Object { $_.Name -match 'node|Foundry' -and $_.CommandLine -match '(?i)foundry|30000|main.mjs' } | Select-Object ProcessId,Name,ExecutablePath,CommandLine | Format-List | Out-String -Width 200 | Write-Output
Write-Output '== DATA_ROOTS =='
$paths = @('C:\Users\rujie\AppData\Local\FoundryVTT','C:\Users\rujie\AppData\Roaming\FoundryVTT','C:\Users\rujie\Documents\FoundryVTT','C:\Users\rujie\AppData\Local\Programs\Foundry Virtual Tabletop')
foreach($v in $paths) {
 if(Test-Path -LiteralPath $v) {
  Write-Output ('ROOT '+$v)
  Get-ChildItem -LiteralPath (Join-Path $v 'Data\worlds') -Directory | Select-Object -ExpandProperty Name
  Get-ChildItem -LiteralPath $v -Directory | Select-Object -First 9 -ExpandProperty Name
 }
}
Write-Output '== KNOWN_PORTS =='
Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -in @(30000,30001,30002,30010,30100) } | Select-Object LocalAddress,LocalPort,OwningProcess | Format-Table -AutoSize | Out-String | Write-Output
Write-Output '== CURRENT_WORKSPACE_ISOLATION_CANDIDATES =='
Get-ChildItem -LiteralPath 'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work' -Directory | Select-Object -ExpandProperty Name