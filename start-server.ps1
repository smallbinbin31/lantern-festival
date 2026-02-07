# Simple HTTP Server for Lantern Festival Website
# PowerShell Built-in Version

$port = 8002
$root = $PWD

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Lantern Festival Website Server" -ForegroundColor Yellow
Write-Host "  Starting HTTP Server..." -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server Root: $root" -ForegroundColor Gray
Write-Host "Server URL: http://localhost:$port" -ForegroundColor Green
Write-Host ""
Write-Host "Open in browser: http://localhost:$port" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop server" -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Auto open browser
Start-Process "http://localhost:$port"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".webp" = "image/webp"
    ".ico"  = "image/x-icon"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get request path
        $path = $request.Url.LocalPath
        if ($path -eq "/" -or $path -eq "") {
            $path = "/index.html"
        }
        
        # Build full file path
        $filePath = Join-Path $root $path.TrimStart('/')
        
        # Log request
        $timestamp = Get-Date -Format "HH:mm:ss"
        Write-Host "[$timestamp] " -NoNewline -ForegroundColor Gray
        
        if (Test-Path $filePath -PathType Leaf) {
            try {
                # Read file
                $content = [System.IO.File]::ReadAllBytes($filePath)
                
                # Set MIME Type
                $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
                if ($mimeTypes.ContainsKey($extension)) {
                    $response.ContentType = $mimeTypes[$extension]
                } else {
                    $response.ContentType = "application/octet-stream"
                }
                
                # Set CORS
                $response.Headers.Add("Access-Control-Allow-Origin", "*")
                
                # Write response
                $response.ContentLength64 = $content.Length
                $response.StatusCode = 200
                $response.OutputStream.Write($content, 0, $content.Length)
                
                Write-Host "200 OK   " -NoNewline -ForegroundColor Green
                Write-Host "$path" -ForegroundColor White
                
            } catch {
                $response.StatusCode = 500
                Write-Host "500 ERROR" -NoNewline -ForegroundColor Red
                Write-Host " $path" -ForegroundColor Red
            }
        } else {
            # File not found
            $response.StatusCode = 404
            $notFoundMsg = "File not found: $path"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($notFoundMsg)
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            
            Write-Host "404 NOT FOUND" -NoNewline -ForegroundColor Yellow
            Write-Host " $path" -ForegroundColor Gray
        }
        
        $response.Close()
    }
} catch {
    Write-Host ""
    Write-Host "Server Error: $_" -ForegroundColor Red
} finally {
    $listener.Stop()
    Write-Host ""
    Write-Host "Server stopped" -ForegroundColor Yellow
}
