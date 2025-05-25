# سكريبت لتعديل قيمة DATABASE_URL داخل ملف .env

$envFilePath = ".env"

# تحقق مما إذا كان الملف موجودا
if (-not (Test-Path $envFilePath)) {
    Write-Host "⚠️ ملف .env غير موجود."
    exit
}

# اسأل المستخدم للتأكيد
$confirmation = Read-Host "⚠️ سيتم تعديل قيمة DATABASE_URL في ملف .env الحالي. هل تريد المتابعة؟ (y/n)"
if ($confirmation -ne 'y') {
    Write-Host "تم إلغاء العملية."
    exit
}

# استبدل الكلام ده بـ الـ connection string اللي من Supabase
$newDatabaseUrl = 'DATABASE_URL="postgresql://postgres:SHmeeb82@db.ttzulxpncujgizidgwxk.supabase.co:6543/postgres?sslmode=require&pgbouncer=true&connection_limit=1&pool_timeout=20"'

# اقرأ كل السطور
$content = Get-Content $envFilePath

# استبدل أو أضف DATABASE_URL
$newContent = $content -replace '^DATABASE_URL=.*$', $newDatabaseUrl

# لو ما فيش DATABASE_URL، ضيفه
if (-not ($newContent -match 'DATABASE_URL=')) {
    $newContent += "`n$newDatabaseUrl"
}

# احفظ الملف
$newContent | Set-Content $envFilePath -Encoding UTF8

Write-Host "✅ تم تحديث DATABASE_URL بنجاح داخل .env" 