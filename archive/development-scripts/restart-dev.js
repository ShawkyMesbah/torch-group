const { exec } = require('child_process');

console.log('Finding and killing processes on port 3000...');

// Windows command to find process using port 3000
const findCommand = 'netstat -ano | findstr :3000 | findstr LISTENING';

exec(findCommand, (error, stdout, stderr) => {
  if (error) {
    console.log('No process found using port 3000 or error running command');
    startDevServer();
    return;
  }

  if (stdout) {
    // Extract PID from the output
    const match = stdout.match(/LISTENING\s+(\d+)/);
    if (match && match[1]) {
      const pid = match[1];
      console.log(`Found process with PID ${pid} using port 3000. Killing it...`);
      
      // Kill the process
      exec(`taskkill /F /PID ${pid}`, (killError) => {
        if (killError) {
          console.error(`Error killing process: ${killError.message}`);
        } else {
          console.log('Process killed successfully');
        }
        
        // Start the dev server after a short delay to ensure the port is free
        setTimeout(startDevServer, 1000);
      });
    } else {
      console.log('Process using port 3000 found but PID not identified.');
      startDevServer();
    }
  } else {
    console.log('No process found using port 3000');
    startDevServer();
  }
});

function startDevServer() {
  console.log('Starting Next.js development server...');
  
  // Start Next.js dev server
  const devProcess = exec('npm run dev', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    console.log(stdout);
    console.error(stderr);
  });
  
  // Forward output to console
  devProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  devProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  
  // Handle clean exit
  process.on('SIGINT', () => {
    console.log('Stopping dev server...');
    devProcess.kill();
    process.exit(0);
  });
} 