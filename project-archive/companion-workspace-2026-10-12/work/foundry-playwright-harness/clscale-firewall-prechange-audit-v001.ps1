$ErrorActionPreference='Stop'
$base='C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\outputs\foreman-checkpoints'
$out=Join-Path $base 'clscale-scratch-firewall-prechange-audit-v001.json'
if(Test-Path -LiteralPath $out){throw 'AUDIT_ALREADY_EXISTS_DO_NOT_OVERWRITE'}
$admin=([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
$profiles=@(Get-NetFirewallProfile|Select-Object Name,Enabled,DefaultInboundAction,DefaultOutboundAction,AllowInboundRules,AllowLocalFirewallRules,AllowLocalIPsecRules,DisabledInterfaceAliases)
$tcp=@(Get-NetTCPConnection -State Listen|ForEach-Object{
  $p=Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
  [pscustomobject]@{address=$_.LocalAddress;port=$_.LocalPort;pid=$_.OwningProcess;process=$p.ProcessName;exe=$p.Path}
})
$udp=@(Get-NetUDPEndpoint|ForEach-Object{
  $p=Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
  [pscustomobject]@{address=$_.LocalAddress;port=$_.LocalPort;pid=$_.OwningProcess;process=$p.ProcessName;exe=$p.Path}
})
$rules=@(Get-NetFirewallRule -PolicyStore ActiveStore -ErrorAction SilentlyContinue | Where-Object {$_.Enabled -eq 'True'} | ForEach-Object {
 $r=$_
 $filters=@($r|Get-NetFirewallPortFilter -ErrorAction SilentlyContinue)
 $apps=@($r|Get-NetFirewallApplicationFilter -ErrorAction SilentlyContinue)
 $addresses=@($r|Get-NetFirewallAddressFilter -ErrorAction SilentlyContinue)
 [pscustomobject]@{id=$r.Name;name=$r.DisplayName;direction=[string]$r.Direction;action=[string]$r.Action;profile=[string]$r.Profile;
  protocol=@($filters|ForEach-Object {[string]$_.Protocol});localPorts=@($filters|ForEach-Object {[string]$_.LocalPort});
  remotePorts=@($filters|ForEach-Object {[string]$_.RemotePort});programs=@($apps|ForEach-Object {[string]$_.Program});remoteAddresses=@($addresses|ForEach-Object {@($_.RemoteAddress)});}
})
$policy=(Get-NetFirewallSetting -PolicyStore ActiveStore -ErrorAction SilentlyContinue| Select-Object *)
$report=[pscustomobject]@{kind='DICEBOX_WINDOWS_FIREWALL_PRECHANGE_ONLY';captured=[DateTime]::UtcNow.ToString('o');admin=$admin;
 hostname=$env:COMPUTERNAME;profiles=$profiles;tcpListeners=$tcp;udpListeners=$udp;enabledRules=$rules;policy=$policy}
$json=$report|ConvertTo-Json -Depth 12
[System.IO.File]::WriteAllText($out,$json,(New-Object System.Text.UTF8Encoding($false)))
Write-Output ('AUDIT_SAVED '+$out)
Write-Output ('ADMIN '+$admin)
Write-Output ('PROFILES '+($profiles|ConvertTo-Json -Compress -Depth 3))
Write-Output ('COUNTS TCP '+$tcp.Count+' UDP '+$udp.Count+' ENABLED_RULES '+$rules.Count)
Write-Output 'LISTENERS_NON_LOOPBACK_RELEVANT'
$tcp|Where-Object {$_.address -in @('0.0.0.0','::') -or ($_.address -ne '127.0.0.1' -and $_.address -ne '::1')}|Sort-Object port|Select-Object address,port,pid,process|ConvertTo-Json -Compress -Depth 3|Write-Output
Write-Output 'UDP_NON_LOOPBACK_RELEVANT'
$udp|Where-Object {$_.address -in @('0.0.0.0','::') -or ($_.address -ne '127.0.0.1' -and $_.address -ne '::1')}|Sort-Object port|Select-Object address,port,pid,process|ConvertTo-Json -Compress -Depth 3|Write-Output