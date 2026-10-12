$ErrorActionPreference='SilentlyContinue'
Write-Output '== FIREWALL SERVICES =='
Get-Service mpssvc,bfe | Select-Object Name,Status,StartType | ConvertTo-Json -Compress | Write-Output
Write-Output '== NETSECURITY RULE COUNTS =='
foreach($store in @('PersistentStore','ActiveStore','SystemDefaults')){
 try {
  $x=@(Get-NetFirewallRule -PolicyStore $store -ErrorAction Stop)
  $allow=@($x|Where-Object {$_.Action -eq 'Allow'})
  $enabled=@($x|Where-Object {$_.Enabled -eq 'True'})
  $both=@($x|Where-Object {$_.Action -eq 'Allow' -and $_.Enabled -eq 'True'})
  Write-Output ('RULES '+$store+' total='+$x.Count+' allow='+$allow.Count+' enabled='+$enabled.Count+' enabledAllow='+$both.Count)
  Write-Output ('SAMPLE '+$store+': '+(($x|Select-Object -First 3 Name,DisplayName,Enabled,Action,Direction|ConvertTo-Json -Compress)))
 } catch {Write-Output ('RULE_QUERY_ERROR '+$store+' '+$_.Exception.Message)}
}
Write-Output '== NETSH CURRENT PROFILE READOUT =='
& netsh advfirewall show allprofiles 2>&1 | Select-Object -First 90 | Write-Output
Write-Output '== NETSH FIREWALL RULES QUICK PATTERNS =='
$rules=@(& netsh advfirewall firewall show rule name=all 2>&1)
Write-Output ('NETSH_RULE_LINES '+$rules.Count)
$rules | Select-String -Pattern 'Foundry|RDP|Remote Desktop|Steam|File and Printer|Dicebox|30000|30010|3389' -Context 1,3 | Select-Object -First 28 | ForEach-Object {$_.ToString() } | Write-Output