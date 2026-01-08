#!/bin/bash

# Production build script for Render deployment

echo "🚀 Starting production build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "🌐 Ready for deployment on Render"
else
    echo "❌ Build failed!"
    exit 1
fi