# run-backend.ps1
# Set your Gemini API key below (replace the placeholder)
$env:GEMINI_API_KEY = "YOUR_ACTUAL_GEMINI_KEY"

# 1. Check if Java is installed
try {
    $javaCheck = java -version 2>&1
    Write-Host "Java detected successfully."
} catch {
    Write-Host ""
    Write-Warning "------------------------------------------------------------------------"
    Write-Warning "Java JDK is NOT installed on your computer."
    Write-Warning "Spring Boot requires Java 17 or higher to run."
    Write-Warning "Please download and install it from Adoptium: https://adoptium.net/temurin/releases/?version=17"
    Write-Warning "------------------------------------------------------------------------"
    Read-Host "Press Enter to exit"
    Exit
}

# 2. Setup portable Maven
$localMvnDir = Join-Path $PSScriptRoot ".maven_portable"
$mvnZip = Join-Path $PSScriptRoot "maven.zip"
$mvnExecutable = Join-Path $localMvnDir "apache-maven-3.9.6\bin\mvn.cmd"

if (-not (Test-Path $mvnExecutable)) {
    Write-Host "Maven is not installed. Downloading a portable Maven package..."
    
    if (Test-Path $localMvnDir) {
        Remove-Item -Recurse -Force $localMvnDir
    }
    
    # Download Apache Maven 3.9.6 zip binary
    $url = "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
    Write-Host "Downloading from $url ..."
    Invoke-WebRequest -Uri $url -OutFile $mvnZip
    
    # Extract Maven zip
    Write-Host "Extracting Maven..."
    Expand-Archive -Path $mvnZip -DestinationPath $localMvnDir
    Remove-Item $mvnZip
}

# 3. Run the backend
Write-Host "Starting Spring Boot backend using portable Maven..."
& $mvnExecutable spring-boot:run
