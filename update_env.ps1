$envFilePath = ".env"

# Trying different format with postgresql prefix
$databaseUrl = 'DATABASE_URL=postgresql://postgres:SHmeeb82@db.ttzulxpncujgizidgwxk.supabase.co:5432/postgres?schema=public'
$directUrl = 'DIRECT_URL=postgresql://postgres:SHmeeb82@db.ttzulxpncujgizidgwxk.supabase.co:5432/postgres?schema=public'

if (-not (Test-Path $envFilePath)) {
    New-Item -ItemType File -Path $envFilePath -Force | Out-Null
}

$content = Get-Content $envFilePath
$hasDatabaseUrl = $false
$hasDirectUrl = $false
$newContent = @()

foreach ($line in $content) {
    if ($line -match '^DATABASE_URL=') {
        $newContent += $databaseUrl
        $hasDatabaseUrl = $true
    }
    elseif ($line -match '^DIRECT_URL=') {
        $newContent += $directUrl
        $hasDirectUrl = $true
    }
    else {
        $newContent += $line
    }
}

if (-not $hasDatabaseUrl) {
    $newContent += $databaseUrl
}

if (-not $hasDirectUrl) {
    $newContent += $directUrl
}

$newContent | Set-Content $envFilePath -Encoding UTF8

Write-Host "Updated connection strings to try standard PostgreSQL format" 