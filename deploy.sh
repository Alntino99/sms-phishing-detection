#!/bin/bash

echo "Starting deployment process..."

echo ""
echo "Step 1: Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    exit 1
fi

echo ""
echo "Step 2: Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi

echo ""
echo "Step 3: Deploying to Vercel..."
npx vercel --prod
if [ $? -ne 0 ]; then
    echo "Error: Deployment failed"
    exit 1
fi

echo ""
echo "Deployment completed successfully!"
echo ""
echo "Your app is now live at the URL shown above."
echo "" 