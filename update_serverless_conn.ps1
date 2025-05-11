$envContent = Get-Content .env -Raw

# Configure DATABASE_URL for serverless environments (with connection pool)
$updatedContent = $envContent -replace "DATABASE_URL=.*", "DATABASE_URL=postgres://postgres.ttzulxpncujgizidgwxk:SHmeeb82@aws-0-us-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"

# Write the updated content back to the .env file
$updatedContent | Set-Content .env

Write-Host "Updated DATABASE_URL with serverless connection format"
Write-Host "New connection string:"
Get-Content .env | Select-String "DATABASE_URL" 