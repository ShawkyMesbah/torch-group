$host_name = "db.ttzulxpncujgizidgwxk.supabase.co"
$port = 5432

Write-Host "Testing connection to $host_name on port $port..."

try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $connection = $tcpClient.BeginConnect($host_name, $port, $null, $null)
    $wait = $connection.AsyncWaitHandle.WaitOne(1000, $false)
    
    if($wait) {
        $tcpClient.EndConnect($connection)
        Write-Host "Successfully connected to $host_name on port $port" -ForegroundColor Green
    } else {
        Write-Host "Failed to connect to $host_name on port $port (timeout)" -ForegroundColor Red
        Write-Host "This could be due to a firewall blocking the connection or the server not accepting connections" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Failed to connect to $host_name on port $port" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
} finally {
    if($tcpClient) {
        $tcpClient.Close()
    }
}

# Try alternate port for connection pooling
$port = 6543
Write-Host "`nTesting connection to $host_name on port $port (connection pooling)..."

try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $connection = $tcpClient.BeginConnect($host_name, $port, $null, $null)
    $wait = $connection.AsyncWaitHandle.WaitOne(1000, $false)
    
    if($wait) {
        $tcpClient.EndConnect($connection)
        Write-Host "Successfully connected to $host_name on port $port" -ForegroundColor Green
    } else {
        Write-Host "Failed to connect to $host_name on port $port (timeout)" -ForegroundColor Red
        Write-Host "This could be due to a firewall blocking the connection or the server not accepting connections" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Failed to connect to $host_name on port $port" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
} finally {
    if($tcpClient) {
        $tcpClient.Close()
    }
} 