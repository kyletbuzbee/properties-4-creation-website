# PowerShell script to fix all paths in HTML files for local file testing

Get-ChildItem -Path about,properties,apply,contact,faq,impact,resources,transparency,privacy,terms -Filter index.html -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw

    # Fix navigation links - change absolute to relative
    $content = $content -replace 'href="/', 'href="../'
    $content = $content -replace 'href="/properties/"', 'href="../properties/index.html"'
    $content = $content -replace 'href="/about/"', 'href="../about/index.html"'
    $content = $content -replace 'href="/impact/"', 'href="../impact/index.html"'
    $content = $content -replace 'href="/resources/"', 'href="../resources/index.html"'
    $content = $content -replace 'href="/contact/"', 'href="../contact/index.html"'
    $content = $content -replace 'href="/apply/"', 'href="../apply/index.html"'
    $content = $content -replace 'href="/faq/"', 'href="../faq/index.html"'
    $content = $content -replace 'href="/transparency/"', 'href="../transparency/index.html"'
    $content = $content -replace 'href="/privacy/"', 'href="../privacy/index.html"'
    $content = $content -replace 'href="/terms/"', 'href="../terms/index.html"'
    $content = $content -replace 'href="/properties/index.html"', 'href="../properties/index.html"'
    $content = $content -replace 'href="/about/index.html"', 'href="../about/index.html"'
    $content = $content -replace 'href="/impact/index.html"', 'href="../impact/index.html"'
    $content = $content -replace 'href="/resources/index.html"', 'href="../resources/index.html"'
    $content = $content -replace 'href="/contact/index.html"', 'href="../contact/index.html"'
    $content = $content -replace 'href="/apply/index.html"', 'href="../apply/index.html"'
    $content = $content -replace 'href="/faq/index.html"', 'href="../faq/index.html"'
    $content = $content -replace 'href="/transparency/index.html"', 'href="../transparency/index.html"'
    $content = $content -replace 'href="/privacy/index.html"', 'href="../privacy/index.html"'
    $content = $content -replace 'href="/terms/index.html"', 'href="../terms/index.html"'

    # Fix home link
    $content = $content -replace 'href="../index.html"', 'href="../index.html"'

    # Fix image sources
    $content = $content -replace 'src="/images/', 'src="../images/'

    # Fix JavaScript sources
    $content = $content -replace 'src="/js/', 'src="../js/'

    # Fix CSS (already done in head)
    # $content = $content -replace 'href="/css/', 'href="../css/'

    # Fix manifest and favicon (already done in head)
    # $content = $content -replace 'href="/manifest.json"', 'href="../manifest.json"'
    # $content = $content -replace 'href="/favicon.ico"', 'href="../favicon.ico"'

    Set-Content $_.FullName $content
    Write-Host "Fixed paths in $($_.FullName)"
}
