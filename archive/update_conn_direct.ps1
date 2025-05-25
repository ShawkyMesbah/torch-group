$envContent = Get-Content .env -Raw

# Use the standard format without connection pooling but with SSL
$updatedContent = $envContent -replace "DATABASE_URL=.*", "DATABASE_URL=postgres://postgres:SHmeeb82@db.ttzulxpncujgizidgwxk.supabase.co:5432/postgres?sslmode=require"

# Write the updated content back to the .env file
$updatedContent | Set-Content .env

Write-Host "Updated DATABASE_URL with standard SSL connection"
Write-Host "New connection string:"
Get-Content .env | Select-String "DATABASE_URL" 