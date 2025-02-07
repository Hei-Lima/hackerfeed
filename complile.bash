# Remove existing package if it exists
rm -f hackerfeed.xpi

# Create new zip file with .xpi extension
zip -r hackerfeed.xpi \
    manifest.json \
    icons/* \
    index.html \
    page/**/* \
    package.json \
    LICENSE \
    README.md \
    -x "package.json" \
    -x ".*" \
    -x "__MACOSX" \
    -x "*.git*" \
    -x "node_modules/*" \
    -x "complile.bash" \
    -x "package-lock.json" \
    -x "*.xpi"

echo "Extension packaged as hackerfeed.xpi"