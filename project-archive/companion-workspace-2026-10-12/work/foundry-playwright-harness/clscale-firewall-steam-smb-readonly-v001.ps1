$ErrorActionPreference='Stop'
$data=@(& netsh advfirewall firewall show rule name=all verbose 2>&1)
$blocks=@();$cur=@()
foreach($ln in $data){
 if($ln -match '^Rule Name:\s*' -and $cur.Count){$blocks+=,($cur -join "`n");$cur=@()}
 if($ln -match '^\s*(Rule Name|Enabled|Direction|Action|Profiles|Protocol|LocalPort|Program|Service|RemoteIP|LocalIP):\s*'){$cur+=$ln.Trim()}
}
if($cur.Count){$blocks+=,($cur -join "`n")}
foreach($name in @('Steam','File and Printer Sharing','Remote Desktop','Foundry Port','WorkflowAppControl')){
 $found=@($blocks|Where-Object{$_ -match ('(?im)^Rule Name:\s*'+[regex]::Escape($name)) -or ($_ -match '(?im)^Program:\s*.*steam.exe')})
 $enabled=@($found|Where-Object{$_ -match '(?m)^Enabled:\s+Yes' -and $_ -match '(?m)^Direction:\s+In' -and $_ -match '(?m)^Action:\s+Allow'})
 Write-Output ('CATEGORY '+$name+' total='+$found.Count+' enabled_in_allow='+$enabled.Count)
 foreach($b in $enabled|Select-Object -First 6){Write-Output (($b -split "`n" | Where-Object{$_ -match 'Rule Name:|Enabled:|Profiles:|Protocol:|LocalPort:|Program:|RemoteIP:'}) -join ' | ')}
}
