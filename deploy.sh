#!/bin/bash

# SMS Phishing Detection App - Vercel Deployment Script

echo "🚀 Preparing SMS Phishing Detection App for Vercel Deployment..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check current status
echo "📋 Current git status:"
git status --porcelain

# Ask user if they want to commit changes
read -p "🤔 Do you want to commit any uncommitted changes? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📝 Committing changes..."
    git add .
    read -p "💬 Enter commit message: " commit_message
    git commit -m "${commit_message:-Update for deployment}"
fi

# Check if user is logged into Vercel
echo "🔐 Checking Vercel login status..."
if ! vercel whoami &> /dev/null; then
    echo "🔑 Please log in to Vercel..."
    vercel login
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app should now be live at the URL provided above."
echo ""
echo "📋 Next steps:"
echo "1. Test your deployed app"
echo "2. Configure custom domain (optional)"
echo "3. Set up environment variables if needed"
echo "4. Monitor your app's performance"
echo ""
echo "📚 For more information, see VERCEL_DEPLOYMENT.md" 