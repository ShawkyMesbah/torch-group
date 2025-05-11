$envContent = Get-Content .env -Raw

# Replace the direct connection with a connection pooling URL
$updatedContent = $envContent -replace "DATABASE_URL=postgresql://postgres:SHmeeb82@db.ttzulxpncujgizidgwxk.supabase.co:5432/postgres\??.*", "DATABASE_URL=postgresql://postgres:SHmeeb82@ttzulxpncujgizidgwxk.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1"

# Write the updated content back to the .env file
$updatedContent | Set-Content .env

Write-Host "Updated DATABASE_URL with connection pooling configuration"
Write-Host "New connection string:"
Get-Content .env | Select-String "DATABASE_URL" 