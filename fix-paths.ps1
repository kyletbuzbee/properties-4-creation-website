#!/usr/bin/env pwsh
# PowerShell script to fix absolute paths in HTML files

$directories = @("privacy", "terms", "transparency")

foreach ($dir in $directories) {
    $filePath = Join-Path $dir "index.html"
    
    if (Test-Path $filePath) {
        Write-Host "Fixing paths in $filePath"
        
        # Read the file content
        $content = Get-Content $filePath -Raw
        
        # Replace absolute paths with relative paths
        $content = $content -replace 'href="/css/', 'href="../css/'
        $content = $content -replace 'href="/js/', 'href="../js/'
        $content = $content -replace 'href="/images/', 'href="../images/'
        $content = $content -replace 'src="/css/', 'src="../css/'
        $content = $content -replace 'src="/js/', 'src="../js/'
        $content = $content -replace 'src="/images/', 'src="../images/'
        $content = $content -replace 'href="/favicon.ico"', 'href="../favicon.ico"'
        $content = $content -replace 'href="/manifest.json"', 'href="../manifest.json"'
        
        # Fix navigation links
        $content = $content -replace 'href="/"', 'href="../index.html"'
        $content = $content -replace 'href="/properties/"', 'href="../properties/index.html"'
        $content = $content -replace 'href="/about/"', 'href="../about/index.html"'
        $content = $content -replace 'href="/impact/"', 'href="../impact/index.html"'
        $content = $content -replace 'href="/resources/"', 'href="../resources/index.html"'
        $content = $content -replace 'href="/contact/"', 'href="../contact/index.html"'
        $content = $content -replace 'href="/apply/"', 'href="../apply/index.html"'
        
        # Write the updated content back
        Set-Content -Path $filePath -Value $content -Encoding utf8
        
        Write-Host "✓ Fixed paths in $filePath"
    } else {
        Write-Host "File not found: $filePath"
    }
}

Write-Host "Path fixing complete!"
