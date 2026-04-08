#!/bin/bash
echo "=== Contents of stitch.zip ==="
unzip -l "/vercel/share/v0-project/stitch.zip"

echo ""
echo "=== Contents of Kimi_Agent_Deadlog API Log Analyzer.zip ==="
unzip -l "/vercel/share/v0-project/Kimi_Agent_Deadlog API Log Analyzer.zip"

echo ""
echo "=== Extracting stitch.zip ==="
unzip -o "/vercel/share/v0-project/stitch.zip" -d /tmp/stitch

echo ""
echo "=== Extracting Kimi_Agent.zip ==="
unzip -o "/vercel/share/v0-project/Kimi_Agent_Deadlog API Log Analyzer.zip" -d /tmp/kimi

echo ""
echo "=== Listing extracted files ==="
find /tmp/stitch /tmp/kimi -type f 2>/dev/null
