$envContent = Get-Content .env -Raw

# Configure DATABASE_URL using Supabase direct connection format
$updatedContent = $envContent -replace "DATABASE_URL=.*", "DATABASE_URL=postgresql://postgres:SHmeeb82@db.ttzulxpncujgizidgwxk.supabase.co:5432/postgres?schema=public"

# Write the updated content back to the .env file
$updatedContent | Set-Content .env

Write-Host "Updated DATABASE_URL with Supabase direct connection format"
Write-Host "New connection string:"
Get-Content .env | Select-String "DATABASE_URL" 