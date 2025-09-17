# Sıverk Depo Deployment Script
# This script helps deploy the application to GitHub and Vercel

Write-Host "🚀 Sıverk Depo Deployment Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root directory." -ForegroundColor Red
    pause
    exit 1
}

Write-Host "✅ Found project root directory" -ForegroundColor Green

# Check if Git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "🔧 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit with MongoDB integration"
    git branch -M main
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git repository already exists" -ForegroundColor Green
}

# Check if MongoDB is configured
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Warning: .env file not found. Please create one with your MongoDB connection string:" -ForegroundColor Yellow
    Write-Host "   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/siverekdepo" -ForegroundColor Yellow
}

# Install dependencies
Write-Host "🔧 Installing dependencies..." -ForegroundColor Yellow
npm install
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# Build the application
Write-Host "🔧 Building the application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed. Please check the errors above." -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "📦 GitHub Deployment Instructions:" -ForegroundColor Cyan
Write-Host "1. Create a new repository on GitHub (https://github.com/new)" -ForegroundColor White
Write-Host "2. Name it 'siverek-depo'" -ForegroundColor White
Write-Host "3. Run the following commands:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/<your-username>/siverek-depo.git" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""

Write-Host "🌐 Vercel Deployment Instructions:" -ForegroundColor Cyan
Write-Host "1. Go to https://vercel.com" -ForegroundColor White
Write-Host "2. Sign up/in with your GitHub account" -ForegroundColor White
Write-Host "3. Click 'New Project'" -ForegroundColor White
Write-Host "4. Import your GitHub repository" -ForegroundColor White
Write-Host "5. Configure the project with these settings:" -ForegroundColor White
Write-Host "   - Build Command: npm run build" -ForegroundColor White
Write-Host "   - Output Directory: .next" -ForegroundColor White
Write-Host "   - Install Command: npm install" -ForegroundColor White
Write-Host "6. Add Environment Variables:" -ForegroundColor White
Write-Host "   - Key: MONGODB_URI" -ForegroundColor White
Write-Host "   - Value: Your MongoDB connection string" -ForegroundColor White
Write-Host "7. Click 'Deploy'" -ForegroundColor White
Write-Host ""

Write-Host "💾 MongoDB Setup Instructions:" -ForegroundColor Cyan
Write-Host "1. Go to https://www.mongodb.com/cloud/atlas" -ForegroundColor White
Write-Host "2. Create a free account" -ForegroundColor White
Write-Host "3. Create a new cluster" -ForegroundColor White
Write-Host "4. Get your connection string" -ForegroundColor White
Write-Host "5. Update your .env file with the connection string" -ForegroundColor White
Write-Host "6. Run the setup script:" -ForegroundColor White
Write-Host "   npm run setup-mongodb" -ForegroundColor White
Write-Host ""

Write-Host "🎉 Deployment preparation completed!" -ForegroundColor Green
Write-Host "Please follow the instructions above to complete the deployment." -ForegroundColor Green
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")