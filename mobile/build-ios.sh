#!/bin/bash

# HERMES Mobile App - iOS IPA Build Script
# This script builds the iOS app and generates the IPA file

set -e

echo "🚀 Building HERMES iOS App..."

cd mobile

# Install dependencies
npm install

# Build for iOS
npm run build:ios

echo "✅ iOS build completed!"
echo "📱 IPA file location: build/HERMES.ipa"
