#!/bin/bash

# Sıverk Depo Deployment Script
# This script helps deploy the application to GitHub and Vercel

echo "🚀 Sıverk Depo Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

echo "✅ Found project root directory"

# Check if Git is initialized
if [ ! -d ".git" ]; then
    echo "🔧 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit with MongoDB integration"
    git branch -M main
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if MongoDB is configured
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Please create one with your MongoDB connection string:"
    echo "   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/siverekdepo"
fi

# Install dependencies
echo "🔧 Installing dependencies..."
npm install
echo "✅ Dependencies installed"

# Build the application
echo "🔧 Building the application..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# GitHub deployment instructions
echo ""
echo "📦 GitHub Deployment Instructions:"
echo "1. Create a new repository on GitHub (https://github.com/new)"
echo "2. Name it 'siverek-depo'"
echo "3. Run the following commands:"
echo "   git remote add origin https://github.com/<your-username>/siverek-depo.git"
echo "   git push -u origin main"
echo ""

# Vercel deployment instructions
echo "🌐 Vercel Deployment Instructions:"
echo "1. Go to https://vercel.com"
echo "2. Sign up/in with your GitHub account"
echo "3. Click 'New Project'"
echo "4. Import your GitHub repository"
echo "5. Configure the project with these settings:"
echo "   - Build Command: npm run build"
echo "   - Output Directory: .next"
echo "   - Install Command: npm install"
echo "6. Add Environment Variables:"
echo "   - Key: MONGODB_URI"
echo "   - Value: Your MongoDB connection string"
echo "7. Click 'Deploy'"
echo ""

# MongoDB setup instructions
echo "💾 MongoDB Setup Instructions:"
echo "1. Go to https://www.mongodb.com/cloud/atlas"
echo "2. Create a free account"
echo "3. Create a new cluster"
echo "4. Get your connection string"
echo "5. Update your .env file with the connection string"
echo "6. Run the setup script:"
echo "   npm run setup-mongodb"
echo ""

echo "🎉 Deployment preparation completed!"
echo "Please follow the instructions above to complete the deployment."