$ErrorActionPreference='Stop'
$all=@(& netsh advfirewall firewall show rule name=all verbose 2>&1)
$blocks=@()
$block=New-Object 'System.Collections.Generic.List[string]'
foreach($line in $all){
 if($line -match '^Rule Name:\s*' -and $block.Count -gt 0){$blocks+=,@($block.ToArray());$block.Clear()}
 if($line -match '^\s*(Rule Name|Enabled|Direction|Profiles|LocalIP|RemoteIP|Protocol|LocalPort|RemotePort|Action|Program|Service|Edge traversal):'){$block.Add($line.Trim())}
}
if($block.Count -gt 0){$blocks+=,@($block.ToArray())}
$interesting=@($blocks | Where-Object { ($_ -join '\n') -match '(?i)Foundry|Remote Desktop|RemoteDesktop|RDP|Steam|WorkflowAppControl|File and Printer|Port: +30000|Port: +3389|Port: +27036|Port: +445|Port: +30010' })
Write-Output ('FULL_RULES '+$blocks.Count+' TARGETED_RULES '+$interesting.Count)
foreach($entry in $interesting|Select-Object -First 120){
 Write-Output ('ENTRY '+($entry -join '; '))
}
Write-Output '== ACTIVE WINDOWS SESSION =='
& qwinsta 2>&1 | Select-Object -First 15|Write-Output
Write-Output '== REMOTE ACCESS INFO =='
Get-Service -Name TermService -ErrorAction SilentlyContinue|Select-Object Name,Status|ConvertTo-Json -Compress|Write-Output
Write-Output '== NETWORK PROFILE CATEGORY =='
Get-NetConnectionProfile|Select-Object Name,InterfaceAlias,NetworkCategory,IPv4Connectivity,IPv6Connectivity|ConvertTo-Json -Compress -Depth 3|Write-Output