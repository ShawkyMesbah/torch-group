// Simple debugging script

console.log('Starting debug script');

try {
  const fs = require('fs');
  console.log('Required fs module');
  
  const path = require('path');
  console.log('Required path module');
  
  const exists = fs.existsSync(path.join(__dirname, '..', 'src'));
  console.log('Checked if src directory exists:', exists);
  
  console.log('Debug script completed successfully!');
} catch (error) {
  console.error('Error in debug script:', error);
} 