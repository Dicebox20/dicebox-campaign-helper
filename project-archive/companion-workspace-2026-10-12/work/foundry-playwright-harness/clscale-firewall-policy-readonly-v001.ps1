$ErrorActionPreference='SilentlyContinue'
Write-Output '== CURRENT ADMIN ROLE =='
[pscustomobject]@{isElevated=([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)}|ConvertTo-Json -Compress|Write-Output
Write-Output '== FIREWALL PROFILES =='
Get-NetFirewallProfile | Select-Object Name,Enabled,DefaultInboundAction,DefaultOutboundAction,AllowInboundRules | ConvertTo-Json -Compress -Depth 3 | Write-Output
Write-Output '== EXACT PORT 30010 FIREWALL FILTERS =='
$rules=Get-NetFirewallRule
$count=0
foreach($r in $rules){
 if($r.Enabled -ne 'True'){continue}
 $port=$r|Get-NetFirewallPortFilter
 if($port.Protocol -eq 'TCP' -and $port.LocalPort -eq '30010'){
  $count++
  [pscustomobject]@{Name=$r.DisplayName;Action=$r.Action;Direction=$r.Direction;Enabled=$r.Enabled;Profile=$r.Profile;Port=$port.LocalPort;Protocol=$port.Protocol}|ConvertTo-Json -Compress|Write-Output
 }
}
Write-Output ('EXACT_MATCHING_RULES '+$count)
Write-Output '== PORT 30010 LISTENERS =='
$ls=Get-NetTCPConnection -State Listen -LocalPort 30010
Write-Output ('LISTENERS '+@($ls).Count)