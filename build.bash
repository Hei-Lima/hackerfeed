#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to compile Tailwind CSS
build_css() {
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Installing npm dependencies...${NC}"
        npm install
    fi
    echo -e "${BLUE}🎨 Compiling Tailwind CSS...${NC}"
    npm run build
}

# Function to archive files
archive_files() {
    local archive_name=$1
    if command -v zip >/dev/null 2>&1; then
        echo -e "${BLUE}📦 Archiving using zip...${NC}"
        rm -f "$archive_name"
        zip -r "$archive_name" \
            manifest.json \
            icons \
            index.html \
            page \
            LICENSE \
            README.md \
            -x "*/.*" \
            -x "node_modules/*"
    elif command -v tar >/dev/null 2>&1; then
        echo -e "${BLUE}📦 Archiving using tar (fallback)...${NC}"
        rm -f "$archive_name"
        tar -a -c -f "$archive_name" \
            manifest.json \
            icons \
            index.html \
            page \
            LICENSE \
            README.md
    else
        echo -e "${RED}❌ No archive tool found (zip or tar). Please install zip (e.g., sudo apt install zip).${NC}"
        exit 1
    fi
}

# Function to build Chrome extension
build_chrome() {
    echo -e "${BLUE}🔨 Building Chrome extension...${NC}"
    cp manifest.chrome.json manifest.json
    rm -f hackerfeed.zip
    archive_files hackerfeed.zip
    echo -e "${GREEN}✅ Chrome extension packaged as hackerfeed.zip${NC}"
}

# Function to build Firefox extension
build_firefox() {
    echo -e "${BLUE}🦊 Building Firefox extension...${NC}"
    cp manifest.firefox.json manifest.json
    rm -f hackerfeed.xpi
    archive_files hackerfeed.xpi
    echo -e "${GREEN}✅ Firefox extension packaged as hackerfeed.xpi${NC}"
}

# Check for arguments
build_css

if [ "$1" == "--chrome" ]; then
    echo -e "${YELLOW}🚀 Building Chrome version!${NC}"
    build_chrome
elif [ "$1" == "--firefox" ]; then
    echo -e "${YELLOW}🚀 Building Firefox version!${NC}"
    build_firefox
elif [ -z "$1" ]; then
    echo -e "${YELLOW}🚀 Building all versions!${NC}"
    build_chrome
    build_firefox
else
    echo -e "${YELLOW}❌ Usage: $0 [--chrome|--firefox]${NC}"
    exit 1
fi

# Restore original manifest
if [ -f manifest.json ]; then
    rm manifest.json
fi

echo -e "${GREEN}✨ Build completed successfully!${NC}"