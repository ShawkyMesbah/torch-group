# Create .env.example file for documentation

$envExamplePath = ".env.example"

# Remove existing file if it exists
if (Test-Path $envExamplePath) {
    Remove-Item $envExamplePath -Force
}

# Create a new documentation file
@"
###############################################################
# Torch Group Website - Environment Configuration Example
###############################################################

#---------------------------------------------------------------
# DATABASE CONFIGURATION
#---------------------------------------------------------------
# Standard connection string for Prisma with connection pooling
DATABASE_URL=postgresql://postgres:[password]@[host]:[port]/[database]?schema=public&connection_limit=5

# Direct connection URL for Prisma (bypasses connection pooling)
DIRECT_URL=postgresql://postgres:[password]@[host]:[port]/[database]?schema=public&sslmode=require

# Alternative connection string with PgBouncer for high-traffic scenarios
DATABASE_URL_POOLED=postgresql://postgres:[password]@[host]:[port]/[database]?schema=public&pgbouncer=true&connection_limit=10&pool_timeout=20

#---------------------------------------------------------------
# NEXTAUTH CONFIGURATION
#---------------------------------------------------------------
# Secret used to encrypt cookies and tokens (use a strong random value)
NEXTAUTH_SECRET=[generate-random-secret]

# Base URL of your website - used by NextAuth for callbacks and email links
NEXTAUTH_URL=https://yourdomain.com

#---------------------------------------------------------------
# SUPABASE CONFIGURATION
#---------------------------------------------------------------
# Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co

# Anonymous API key for client-side Supabase queries
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-supabase-anon-key]

# Service role key for admin-level operations (keep this secret)
SUPABASE_SERVICE_ROLE_KEY=[your-supabase-service-role-key]

#---------------------------------------------------------------
# EMAIL CONFIGURATION
#---------------------------------------------------------------
# SMTP Configuration for traditional email sending
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=[your-smtp-password]
SMTP_FROM=Your Company <notifications@yourcompany.com>

# Resend.com API key for modern email delivery
RESEND_API_KEY=[your-resend-api-key]

# MailerSend API key for alternative email delivery
MAILERSEND_API_KEY=[your-mailersend-api-key]

#---------------------------------------------------------------
# UPLOADTHING CONFIGURATION
#---------------------------------------------------------------
# UploadThing secret key for file uploads
UPLOADTHING_SECRET=[your-uploadthing-secret-key]

# UploadThing application ID
UPLOADTHING_APP_ID=[your-uploadthing-app-id]

#---------------------------------------------------------------
# ANALYTICS & EXTERNAL SERVICES
#---------------------------------------------------------------
# API key for analytics service
ANALYTICS_API_KEY=[your-analytics-api-key]

#---------------------------------------------------------------
# PAYMENT PROCESSING (STRIPE)
#---------------------------------------------------------------
# Stripe secret key for server-side operations
STRIPE_SECRET_KEY=[your-stripe-secret-key]

# Stripe webhook secret for signature verification
STRIPE_WEBHOOK_SECRET=[your-stripe-webhook-secret]

# Stripe publishable key for client-side operations
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[your-stripe-publishable-key]

#---------------------------------------------------------------
# APPLICATION CONFIGURATION
#---------------------------------------------------------------
# Node environment (development, production, test)
NODE_ENV=production

# Base URL for the website
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
"@ | Out-File -FilePath $envExamplePath -Encoding utf8

Write-Host "✅ .env.example file has been created for documentation purposes" 