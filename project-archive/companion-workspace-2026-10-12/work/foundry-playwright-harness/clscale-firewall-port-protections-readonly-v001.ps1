$ErrorActionPreference='Stop'
$all=@(& netsh advfirewall firewall show rule name=all verbose 2>&1)
$rows=New-Object 'System.Collections.Generic.List[object]'
$lines=New-Object 'System.Collections.Generic.List[string]'
function flushBlock {
 if($lines.Count -lt 1){return}
 $r=@{}
 foreach($ln in $lines){
  if($ln -match '^\s*([^:]+):\s*(.*?)\s*$'){$r[$matches[1].Trim()]=$matches[2].Trim()}
 }
 if($r['Enabled'] -eq 'Yes' -and $r['Direction'] -eq 'In' -and $r['Action'] -eq 'Allow'){$rows.Add([pscustomobject]$r)}
 $lines.Clear()
}
foreach($ln in $all){
 if($ln -match '^Rule Name:\s*'){flushBlock}
 if($ln -match '^\s*(Rule Name|Enabled|Direction|Action|Profiles|Protocol|LocalPort|Program|Service|RemoteIP|LocalIP):\s*'){$lines.Add($ln)}
}
flushBlock
$active=@(Get-NetTCPConnection -State Listen|Where-Object{ $_.LocalAddress -in @('0.0.0.0','::') -or $_.LocalAddress -match '^(10\.|192\.168\.|172\.)' }|Select-Object -Unique LocalPort,OwningProcess,LocalAddress)
$ports=@(30000,3389,27036,54950,54955,445,139,135,7680,5357,5040)
foreach($port in $ports){
 $c=@($active|Where-Object LocalPort -eq $port)
 $rules=@($rows|Where-Object{ $_.Protocol -eq 'TCP' -and ($_.LocalPort -eq "$port" -or $_.LocalPort -eq 'Any') -and $_.Profiles -match '(?i)(Domain|Private|Public)' })
 $direct=@($rules|Where-Object {$_.LocalPort -eq "$port"})
 $sys=@($direct|Select-Object -First 5|ForEach-Object{$_.('Rule Name')})
 Write-Output ('PORT '+$port+' listeners='+$c.Count+' directly_enabled_tcp_allow_rules='+$direct.Count+' examples='+($sys -join '|'))
}
Write-Output 'HOSTED_UDP'
$udp=@(Get-NetUDPEndpoint|Where-Object {$_.LocalPort -in @(27036,54955,30000)})
$udp|Select-Object LocalAddress,LocalPort,OwningProcess|ConvertTo-Json -Compress |Write-Output
Write-Output ('TOTAL_ENABLED_INBOUND_ALLOW_RULES '+$rows.Count)