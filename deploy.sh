#!/bin/bash

echo "🚀 EcoTravel HTTPS Deployment Script"
echo "===================================="

# Build the project
echo "📦 Building project..."
npm run build:client

# Check if dist/spa exists
if [ ! -d "dist/spa" ]; then
    echo "❌ Build failed - dist/spa directory not found"
    exit 1
fi

echo "✅ Build completed successfully!"
echo ""
echo "🌐 Deployment Options:"
echo ""
echo "1. NETLIFY (Recommended):"
echo "   • Go to https://netlify.com"
echo "   • Drag & drop the 'dist/spa' folder"
echo "   • Your HTTPS URL will be: https://your-site.netlify.app"
echo ""
echo "2. VERCEL:"
echo "   • Run: npx vercel --prod"
echo "   • Follow the prompts"
echo ""
echo "3. GITHUB PAGES:"
echo "   • Push to GitHub and enable Pages in repository settings"
echo ""
echo "📁 Built files are in: $(pwd)/dist/spa"
echo "🔒 HTTPS is REQUIRED for AR camera features!"
echo ""
echo "🎯 After deployment, test AR features:"
echo "   1. Open https://your-domain.com on mobile"
echo "   2. Click 'AR Experience' button"
echo "   3. Grant camera permission"
echo "   4. Enjoy AR hero stories!"
echo ""
echo "✨ Happy sustainable traveling! 🇹🇭🌿"
