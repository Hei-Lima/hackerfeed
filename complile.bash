#!/bin/bash

# Remove existing package if it exists
rm -f hackerfeed.zip

# Create new zip file
zip -r hackerfeed.zip \
    manifest.json \
    icons/* \
    index.html \
    page/**/* \
    LICENSE \
    README.md \
    -x ".*" \
    -x "__MACOSX" \
    -x "*.git*" \
    -x "node_modules/*" \
    -x "*.bash" \
    -x "package*.json" \
    -x "*.zip" \
    -x "*.xpi"

# Set executable permissions
chmod +x compile-chrome.bash

echo "Extension packaged as hackerfeed.zip"