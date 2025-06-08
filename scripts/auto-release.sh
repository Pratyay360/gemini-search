#!/bin/bash

# Auto Release Script for Gemini Search Extension
# This script builds, packages, and creates a GitHub release

set -e

echo "🚀 Starting auto release process..."

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "❌ Error: There are uncommitted changes. Please commit or stash them first."
    exit 1
fi

# Get current branch
BRANCH=$(git branch --show-current)
echo "📍 Current branch: $BRANCH"

# Ensure we're on main/master
if [[ "$BRANCH" != "main" && "$BRANCH" != "master" ]]; then
    echo "❌ Error: Must be on main or master branch to release"
    exit 1
fi

# Pull latest changes
echo "🔄 Pulling latest changes..."
git pull origin $BRANCH

# Update version (patch by default, can pass major/minor as argument)
VERSION_TYPE=${1:-patch}
echo "📈 Updating version ($VERSION_TYPE)..."
npm run version:update -- $VERSION_TYPE

# Get new version
NEW_VERSION=$(node -p "require('./manifest.json').version")
echo "🔖 New version: v$NEW_VERSION"

# Build and package
echo "🔨 Building extension..."
npm run build

echo "📦 Packaging extension..."
npm run package

# Commit version changes
echo "💾 Committing version changes..."
git add manifest.json package.json
git commit -m "chore: bump version to v$NEW_VERSION"

# Create and push tag
echo "🏷️  Creating and pushing tag..."
git tag "v$NEW_VERSION"
git push origin $BRANCH
git push origin "v$NEW_VERSION"

echo "✅ Auto release completed!"
echo "🎉 Version v$NEW_VERSION has been released"
echo "📦 Extension package: gemini-search.zip"
echo "🔗 Check GitHub Actions for automatic release creation"
