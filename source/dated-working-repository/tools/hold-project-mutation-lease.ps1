param(
  [ValidateRange(1, 60)]
  [int]$Seconds = 25
)

$ErrorActionPreference = "Stop"
$root = Join-Path $env:LOCALAPPDATA "com.dicebox.campaign-helper"
$leasePath = Join-Path $root "dicebox-project-store.mutation.lock"
[System.IO.Directory]::CreateDirectory($root) | Out-Null
$stream = [System.IO.File]::Open(
  $leasePath,
  [System.IO.FileMode]::OpenOrCreate,
  [System.IO.FileAccess]::ReadWrite,
  [System.IO.FileShare]::ReadWrite
)

try {
  $stream.Lock(0, 1)
  Write-Output "DBX_PROJECT_MUTATION_LEASE status=HELD root=$root seconds=$Seconds"
  Start-Sleep -Seconds $Seconds
}
finally {
  try { $stream.Unlock(0, 1) } catch { }
  $stream.Dispose()
}
