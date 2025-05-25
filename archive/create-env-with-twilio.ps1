# Create a comprehensive .env file with all required variables including Twilio

$envFilePath = ".env"

# Check if .env file already exists
if (Test-Path $envFilePath) {
    $confirmation = Read-Host "⚠️ .env file already exists. Do you want to update it with Twilio settings? (y/N)"
    if ($confirmation -ne "y" -and $confirmation -ne "Y") {
        Write-Host "Operation cancelled. Your existing .env file was preserved."
        exit
    }
    
    # Append Twilio settings to existing file
    @"

#---------------------------------------------------------------
# TWILIO SMS VERIFICATION
#---------------------------------------------------------------
# Twilio Account SID (from your Twilio dashboard)
TWILIO_ACCOUNT_SID=your_account_sid_here

# Twilio Auth Token (from your Twilio dashboard)
TWILIO_AUTH_TOKEN=your_auth_token_here

# Twilio Phone Number (must be purchased through Twilio)
TWILIO_FROM_NUMBER=+1234567890
"@ | Out-File -FilePath $envFilePath -Encoding utf8 -Append
    
    Write-Host "✅ Twilio environment variables have been added to your .env file"
    exit
}

# Create a new .env file with all required variables
@"
###############################################################
# Torch Group Website - Environment Configuration
###############################################################

#---------------------------------------------------------------
# DATABASE CONFIGURATION
#---------------------------------------------------------------
# Standard connection string for Prisma with connection pooling
DATABASE_URL=postgresql://postgres:password@localhost:5432/torch-db?schema=public&connection_limit=1

# Direct connection URL for Prisma (bypasses connection pooling)
DIRECT_URL=postgresql://postgres:password@localhost:5432/torch-db?schema=public&sslmode=require

#---------------------------------------------------------------
# NEXTAUTH CONFIGURATION
#---------------------------------------------------------------
# Secret used to encrypt cookies and tokens
NEXTAUTH_SECRET=your-secret-key-min-32-chars-long

# Base URL of your website - used by NextAuth for callbacks and email links
NEXTAUTH_URL=http://localhost:3000

#---------------------------------------------------------------
# EMAIL CONFIGURATION
#---------------------------------------------------------------
# Resend.com API key for modern email delivery
RESEND_API_KEY=your_resend_api_key

#---------------------------------------------------------------
# UPLOADTHING CONFIGURATION
#---------------------------------------------------------------
# UploadThing secret key for file uploads
UPLOADTHING_SECRET=your_uploadthing_secret

# UploadThing application ID
UPLOADTHING_APP_ID=your_uploadthing_app_id

#---------------------------------------------------------------
# TWILIO SMS VERIFICATION
#---------------------------------------------------------------
# Twilio Account SID (from your Twilio dashboard)
TWILIO_ACCOUNT_SID=your_account_sid_here

# Twilio Auth Token (from your Twilio dashboard)
TWILIO_AUTH_TOKEN=your_auth_token_here

# Twilio Phone Number (must be purchased through Twilio)
TWILIO_FROM_NUMBER=+1234567890

#---------------------------------------------------------------
# APPLICATION CONFIGURATION
#---------------------------------------------------------------
# Node environment (development, production, test)
NODE_ENV=development

# Base URL for the website
NEXT_PUBLIC_BASE_URL=http://localhost:3000
"@ | Out-File -FilePath $envFilePath -Encoding utf8

Write-Host "✅ Comprehensive .env file has been created with all required variables including Twilio" 