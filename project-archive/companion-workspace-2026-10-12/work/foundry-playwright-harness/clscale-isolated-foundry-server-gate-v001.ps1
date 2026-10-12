$ErrorActionPreference = 'Stop'
$report = [ordered]@{ schema=1; testOnly=$true; safeToCommit=$false; blockers=@(); port=30010; world='dicebox-f1-teleport-acceptance-v001'; dataRoot='C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-teleport-sandbox-v001\userdata' }
try {
 $root='C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work\foundry-teleport-sandbox-v001\userdata'
 $prod='C:\Users\rujie\AppData\Local\FoundryVTT'
 $world='dicebox-f1-teleport-acceptance-v001'
 if($root -eq $prod -or $root.StartsWith($prod+'\',[StringComparison]::OrdinalIgnoreCase)){$report.blockers+= 'DATA_PATH_OVERLAPS_LIVE'}
 if(!(Test-Path -LiteralPath $root)){$report.blockers+='SANDBOX_DATA_DIRECTORY_ABSENT'}
 else {
  $real=(Get-Item -LiteralPath $root).FullName
  if($real -ne $root){$report.blockers+='SANDBOX_REALPATH_DRIFT'}
  $probe=$root
  while($probe -and $probe.Length -ge 'C:\Users\rujie\Documents\Codex\DiceBox Campaign Helper\work'.Length) {
   $item=Get-Item -LiteralPath $probe -Force
   if($item.Attributes.ToString().Contains('ReparsePoint')){$report.blockers+='SANDBOX_REPARSE_POINT';break}
   $probe=Split-Path -Path $probe -Parent
  }
  $worlds=Join-Path $root 'Data\worlds'
  $packages=Get-ChildItem -LiteralPath $worlds -Directory -ErrorAction SilentlyContinue
  $report.worldCount=@($packages).Count
  if(@($packages).Count -ne 1 -or $packages[0].Name -ne $world){$report.blockers+='NOT_EXACTLY_ONE_DISPOSABLE_WORLD'}
  $manifest=Join-Path $worlds ($world+'\world.json')
  if(!(Test-Path -LiteralPath $manifest)){$report.blockers+='DISPOSABLE_WORLD_MANIFEST_MISSING'}
  else { $m=Get-Content -LiteralPath $manifest -Raw|ConvertFrom-Json
   if($m.id -ne $world -or $m.system -ne 'dnd5e'){$report.blockers+='WORLD_ID_OR_SYSTEM_DRIFT'}
  }
  $systemPath=Join-Path $root 'Data\systems\dnd5e\system.json'
  if(!(Test-Path -LiteralPath $systemPath)){$report.blockers+='PRIVATE_DND5E_COPY_MISSING'}
  else {
    $system=Get-Content -LiteralPath $systemPath -Raw|ConvertFrom-Json
    if($system.id -ne 'dnd5e' -or $system.version -ne '5.3.3'){$report.blockers+='PRIVATE_SYSTEM_VERSION_DRIFT'}
    $allSystemFiles=Get-ChildItem -LiteralPath (Split-Path -Parent $systemPath) -Recurse -File
    $systemBytes=($allSystemFiles|Measure-Object Length -Sum).Sum
    $report.privateSystemFileCount=@($allSystemFiles).Count
    $report.privateSystemSizeMiB=[math]::Round($systemBytes/1MB,2)
    if($report.privateSystemFileCount -lt 1400 -or $systemBytes -lt 120MB){$report.blockers+='PRIVATE_SYSTEM_INCOMPLETE'}
    $d=Get-Item (Split-Path -Parent $systemPath)
    if($d.Attributes.ToString().Contains('ReparsePoint')){$report.blockers+='SHARED_SYMLINK_SYSTEM_FORBIDDEN'}
  }
  $mods=Get-ChildItem -LiteralPath (Join-Path $root 'Data\modules') -Directory -ErrorAction SilentlyContinue
  $report.moduleDirectoryCount=@($mods).Count
  if(@($mods).Count -gt 0){$report.blockers+='SANDBOX_MODULES_PRESENT'}
  $opts=Join-Path $root 'Config\options.json'
  if(!(Test-Path -LiteralPath $opts)){$report.blockers+='SANDBOX_OPTIONS_MISSING'}
  else { $o=Get-Content -LiteralPath $opts -Raw|ConvertFrom-Json
    if($o.port -ne 30010 -or $o.upnp -ne $false -or $o.dataPath -ne $root){$report.blockers+='SANDBOX_OPTIONS_NOT_ISOLATED'}
  }
  if(!(Test-Path -LiteralPath (Join-Path $root 'Config\admin.txt'))){$report.blockers+='SANDBOX_ADMIN_ACCESS_KEY_NOT_CONFIGURED'}
 }
 $listeners=@(Get-NetTCPConnection -State Listen -LocalPort 30010 -ErrorAction SilentlyContinue)
 $pids=@($listeners | Select-Object -ExpandProperty OwningProcess -Unique)
 $report.listenerCount=$listeners.Count
 if($pids.Count -ne 1){$report.blockers+='NO_UNIQUE_SANDBOX_LISTENER'}
 else {
  $proc=Get-CimInstance Win32_Process -Filter ('ProcessId='+$pids[0])
  $cmd=[string]$proc.CommandLine
  $report.listenerPid=[int]$pids[0]
  if($cmd -notmatch '--port=30010' -or $cmd -notmatch [regex]::Escape('dicebox-f1-teleport-acceptance-v001') -or $cmd -notmatch [regex]::Escape($root) -or $cmd -notmatch '--noupnp'){$report.blockers+='LISTENER_PROCESS_ARGUMENTS_NOT_ISOLATED'}
 }
 $rule=Get-NetFirewallRule -DisplayName 'DiceBox F1 Sandbox 30010 Block External' -ErrorAction SilentlyContinue |
 Where-Object {$_.Enabled -eq 'True' -and $_.Direction -eq 'Inbound' -and $_.Action -eq 'Block'}
 $validRule=$false
 foreach($r in $rule){$p=$r|Get-NetFirewallPortFilter
  $address=$r|Get-NetFirewallAddressFilter
  if($p.Protocol -eq 'TCP' -and $p.LocalPort -eq '30010' -and $r.Profile -eq 'Any' -and (@($address.RemoteAddress) -contains 'Any')){$validRule=$true}
 }
 if(!$validRule){$report.blockers+='EXTERNAL_INBOUND_FIREWALL_BLOCK_NOT_PROVEN'}
 $profiles=@(Get-NetFirewallProfile -ErrorAction Stop)
 $report.firewallProfiles=@($profiles|Select-Object Name,Enabled)
 if($profiles.Count -ne 3 -or @($profiles|Where-Object {$_.Enabled -ne 'True'}).Count -gt 0){$report.blockers+='HOST_FIREWALL_NOT_ENABLED_FOR_ALL_PROFILES'}
 $report.safeToCommit=($report.blockers.Count -eq 0)
} catch { $report.blockers+=('ISOLATION_INSPECTION_FAILED_'+$_.Exception.GetType().Name) }
$report | ConvertTo-Json -Depth 5 -Compress | Write-Output
if(!$report.safeToCommit){exit 4}