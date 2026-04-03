#!/bin/bash

# Load .env.local manually (if not using dotenv CLI)
set -a
source .env.local
set +a

# Check the current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Specify the branch to check
TARGET_BRANCH="manual-publish"

# configuration
BUILD_DIR="../digital-hub/dist"
PUBLIC_REPO_DIR="../../exprcreative-hub--"
SITEMAP_PATH="$BUILD_DIR/sitemap.xml"

# Build the project
echo "Building the project..."
npm run build

# Wait for the build process to complete
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Exiting..."
  exit 1
fi

# If the build was successful, proceed to the next step
echo "✅ Build completed successfully."

# Update sitemap dates
echo "Updating sitemap lastmod dates..."
CURRENT_DATE=$(date +%Y-%m-%d)
if [ -f "$SITEMAP_PATH" ]; then
  sed -i.bak "s|<lastmod>.*</lastmod>|<lastmod>$CURRENT_DATE</lastmod>|g" "$SITEMAP_PATH" &&
    rm "${SITEMAP_PATH}.bak"
  echo "✅ Sitemap dates updated to $CURRENT_DATE"
else
  echo "⚠️  Warning: sitemap.xml not found in build directory"
fi

# Navigate to the public repository
echo "Navigating to the public repository..."

cd ../../creative-hub-- || exit 1 # Change this to the actual path

echo "Check branch"
# Check if the current branch is the target branch
if [ "$CURRENT_BRANCH" != "$TARGET_BRANCH" ]; then
  echo "You are on the branch '$CURRENT_BRANCH'. Switching to '$TARGET_BRANCH' branch."
  git checkout $TARGET_BRANCH # Switch to the manual-publish branch
else
  echo "You are already on the '$TARGET_BRANCH' branch. Continuing with deployment."
fi

# Clear out old files (preserve README.md and CNAME if they exist)
shopt -s extglob
echo "Clearing old files (except README.md and CNAME)..."
rm -rf !("README.md"|"CNAME")

# Copy the new build files
echo "Copying new build files..."
cp -r ../creative-hub/client/dist/* .

# Copy README.md if it exists
if [ -f ../creative-hub/client/README.md ]; then
  echo "Copying README.md..."
  cp ../creative-hub/client/README.md .
fi

# Copy CNAME if it exists
if [ -f ../creative-hub/client/CNAME ]; then
  echo "Copying CNAME..."
  cp ../creative-hub/client/CNAME .
fi

# Set the remote using the token from the env
git remote set-url origin https://Lindo-code:$GITHUB_PAT@github.com/Lindocode-Digital/creative-hub--.git

# Commit and push the changes
echo "Committing and pushing changes..."
git add .
git commit -m "Deployed latest build"
git push -u origin manual-publish

echo "✅ Deployed successfully!!"
