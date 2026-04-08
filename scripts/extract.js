import { execSync } from 'child_process';
import { readdirSync, readFileSync, statSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Create extraction directories
if (!existsSync('/vercel/share/v0-project/extracted_stitch')) {
  mkdirSync('/vercel/share/v0-project/extracted_stitch', { recursive: true });
}
if (!existsSync('/vercel/share/v0-project/extracted_kimi')) {
  mkdirSync('/vercel/share/v0-project/extracted_kimi', { recursive: true });
}

// Extract stitch.zip
console.log('Extracting stitch.zip...');
execSync('unzip -o "/vercel/share/v0-project/stitch.zip" -d "/vercel/share/v0-project/extracted_stitch"');

// Extract Kimi_Agent_Deadlog API Log Analyzer.zip
console.log('Extracting Kimi_Agent_Deadlog API Log Analyzer.zip...');
execSync('unzip -o "/vercel/share/v0-project/Kimi_Agent_Deadlog API Log Analyzer.zip" -d "/vercel/share/v0-project/extracted_kimi"');

// List contents
function listDir(dir, prefix = '') {
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    console.log(prefix + item + (stat.isDirectory() ? '/' : ''));
    if (stat.isDirectory()) {
      listDir(fullPath, prefix + '  ');
    }
  }
}

console.log('\n=== stitch.zip contents ===');
listDir('/vercel/share/v0-project/extracted_stitch');

console.log('\n=== Kimi_Agent contents ===');
listDir('/vercel/share/v0-project/extracted_kimi');
