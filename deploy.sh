#!/bin/bash

# Hangout Chat App Deployment Script
# This script helps automate the deployment process

echo "🚀 Starting Hangout Chat App Deployment..."

# Check if required files exist
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please copy .env.example to .env.local and configure your environment variables."
    exit 1
fi

# Type check
echo "🔍 Running type check..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ Type check failed! Please fix TypeScript errors before deployment."
    exit 1
fi

# Lint check
echo "🧹 Running lint check..."
npm run lint
if [ $? -ne 0 ]; then
    echo "⚠️  Lint warnings detected. Consider fixing them before deployment."
fi

# Build the application
echo "🏗️  Building the application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix build errors before deployment."
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "🌐 Ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Deploy Convex: npx convex deploy --prod"
echo "2. Update environment variables on your hosting platform"
echo "3. Deploy to Vercel or your preferred hosting platform"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"