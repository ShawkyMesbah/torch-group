// Simple test to verify TaskMaster is properly accessible
const path = require('path');
const fs = require('fs');

// Check if TaskMaster config exists
const configPath = path.join(__dirname, '.taskmasterconfig');
console.log('Checking for TaskMaster config at:', configPath);
console.log('Config exists:', fs.existsSync(configPath));

if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  console.log('TaskMaster config:', config);
}

// Check for tasks directory
const tasksDir = path.join(__dirname, 'tasks');
console.log('Checking for tasks directory at:', tasksDir);
console.log('Tasks directory exists:', fs.existsSync(tasksDir));

if (fs.existsSync(tasksDir)) {
  const taskFiles = fs.readdirSync(tasksDir);
  console.log('Task files found:', taskFiles);
}

// Check if package is installed
try {
  const packagePath = require.resolve('task-master-ai');
  console.log('task-master-ai package found at:', packagePath);
} catch (err) {
  console.error('task-master-ai package not found in node_modules');
}

console.log('Completed TaskMaster installation check'); 