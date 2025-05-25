/**
 * Safe Environment File Creator
 * 
 * This script creates or updates environment files safely without overwriting existing ones.
 * It can be used to:
 * 1. Check if an .env or .env.local file exists
 * 2. Create a new .env or .env.local file if it doesn't exist
 * 3. Update specific variables in an existing .env file without overwriting everything
 * 
 * Usage: 
 * - node scripts/safe-create-env.js
 * - node scripts/safe-create-env.js --force (to overwrite)
 * - node scripts/safe-create-env.js --local (to create/update .env.local)
 * - node scripts/safe-create-env.js --local --force (to overwrite .env.local)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const useLocalEnv = process.argv.includes('--local');
const ENV_FILE_PATH = path.join(process.cwd(), useLocalEnv ? '.env.local' : '.env');
const ENV_EXAMPLE_PATH = path.join(process.cwd(), '.env.example');

// Template for a new .env file
const ENV_TEMPLATE = `###############################################################
# Torch Group Website - Environment Configuration
###############################################################

#---------------------------------------------------------------
# DATABASE CONFIGURATION
#---------------------------------------------------------------
# Standard connection string for Prisma with connection pooling
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/torch_group

# Direct connection URL for Prisma (bypasses connection pooling)
DIRECT_URL=postgresql://postgres:your_password@localhost:5432/torch_group

#---------------------------------------------------------------
# NEXTAUTH CONFIGURATION
#---------------------------------------------------------------
# Secret used to encrypt cookies and tokens
NEXTAUTH_SECRET=generate_a_random_string_here
NEXTAUTH_URL=http://localhost:3000

#---------------------------------------------------------------
# SUPABASE CONFIGURATION
#---------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

#---------------------------------------------------------------
# APPLICATION CONFIGURATION
#---------------------------------------------------------------
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
`;

// Template for a minimalist .env.local file
const ENV_LOCAL_TEMPLATE = `###############################################################
# Torch Group Website - Local Environment Configuration
###############################################################

# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/torch_group
DIRECT_URL=postgresql://postgres:your_password@localhost:5432/torch_group

# NextAuth Configuration
NEXTAUTH_SECRET=generate_a_random_string_here
NEXTAUTH_URL=http://localhost:3000

# Site Configuration
SITE_URL=http://localhost:3000
SITE_NAME=Torch Group
`;

/**
 * Check if a file exists
 * @param {string} filePath 
 * @returns {boolean}
 */
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Create a new file with content
 * @param {string} filePath 
 * @param {string} content 
 */
function createFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Created new file: ${path.basename(filePath)}`);
}

/**
 * Copy a file
 * @param {string} source 
 * @param {string} destination 
 */
function copyFile(source, destination) {
  fs.copyFileSync(source, destination);
  console.log(`✅ Copied ${path.basename(source)} to ${path.basename(destination)}`);
}

/**
 * Update specific variables in an environment file
 * @param {string} filePath 
 * @param {Object} variables 
 */
function updateEnvVariables(filePath, variables) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const variableKeys = Object.keys(variables);
  
  const updatedLines = lines.map(line => {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || line.trim() === '') {
      return line;
    }
    
    // Check if line contains any of our variables
    for (const key of variableKeys) {
      if (line.startsWith(`${key}=`)) {
        return `${key}=${variables[key]}`;
      }
    }
    
    return line;
  });
  
  // Add any variables that weren't found
  for (const key of variableKeys) {
    if (!lines.some(line => line.startsWith(`${key}=`))) {
      updatedLines.push(`${key}=${variables[key]}`);
    }
  }
  
  fs.writeFileSync(filePath, updatedLines.join('\n'), 'utf8');
  console.log(`✅ Updated variables in ${path.basename(filePath)}`);
}

/**
 * Main function
 */
async function main() {
  const forceOverwrite = process.argv.includes('--force');
  const fileType = useLocalEnv ? '.env.local' : '.env';
  const template = useLocalEnv ? ENV_LOCAL_TEMPLATE : ENV_TEMPLATE;
  
  if (fileExists(ENV_FILE_PATH)) {
    if (forceOverwrite) {
      console.log(`⚠️ Overwriting existing ${fileType} file because --force flag was used.`);
      createFile(ENV_FILE_PATH, template);
      return;
    }
    
    console.log(`⚠️ ${fileType} file already exists.`);
    
    rl.question(`Do you want to update specific variables in ${fileType}? (y/n): `, (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log("Please enter the variables to update in KEY=VALUE format, one per line.");
        console.log("Enter an empty line when done.");
        
        const variables = {};
        
        const promptNextVariable = () => {
          rl.question('> ', (input) => {
            if (input.trim() === '') {
              if (Object.keys(variables).length === 0) {
                console.log('No variables provided. Operation cancelled.');
                rl.close();
                return;
              }
              
              rl.question(`Going to update: ${Object.keys(variables).join(', ')}\nContinue? (y/n): `, (confirm) => {
                if (confirm.toLowerCase() === 'y') {
                  updateEnvVariables(ENV_FILE_PATH, variables);
                } else {
                  console.log('Operation cancelled.');
                }
                rl.close();
              });
            } else {
              // Parse KEY=VALUE format
              const match = input.match(/^([^=]+)=(.*)$/);
              if (match) {
                const [, key, value] = match;
                variables[key.trim()] = value.trim();
                promptNextVariable();
              } else {
                console.log('Invalid format. Use KEY=VALUE format.');
                promptNextVariable();
              }
            }
          });
        };
        
        promptNextVariable();
      } else {
        console.log(`Operation cancelled. Your ${fileType} file remains unchanged.`);
        rl.close();
      }
    });
  } else {
    console.log(`No ${fileType} file found.`);
    
    // Check if example file exists to copy from
    if (fileExists(ENV_EXAMPLE_PATH)) {
      rl.question(`Do you want to copy from .env.example to create ${fileType}? (y/n): `, (answer) => {
        if (answer.toLowerCase() === 'y') {
          copyFile(ENV_EXAMPLE_PATH, ENV_FILE_PATH);
        } else {
          rl.question(`Create a new ${fileType} file with default template? (y/n): `, (create) => {
            if (create.toLowerCase() === 'y') {
              createFile(ENV_FILE_PATH, template);
            } else {
              console.log(`No ${fileType} file created.`);
            }
            rl.close();
          });
        }
        rl.close();
      });
    } else {
      rl.question(`Create a new ${fileType} file with default template? (y/n): `, (answer) => {
        if (answer.toLowerCase() === 'y') {
          createFile(ENV_FILE_PATH, template);
        } else {
          console.log(`No ${fileType} file created.`);
        }
        rl.close();
      });
    }
  }
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 