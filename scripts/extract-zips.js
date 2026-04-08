import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';

const projectDir = '/vercel/share/v0-project';

// Extract stitch.zip
const stitchZip = new AdmZip(path.join(projectDir, 'stitch.zip'));
const stitchEntries = stitchZip.getEntries();
console.log('=== stitch.zip contents ===');
stitchEntries.forEach(entry => {
  console.log(entry.entryName);
  if (!entry.isDirectory) {
    const content = entry.getData().toString('utf8');
    console.log('--- Content of', entry.entryName, '---');
    console.log(content.substring(0, 5000));
    console.log('--- End of', entry.entryName, '---\n');
  }
});

// Extract Kimi_Agent zip
const kimiZip = new AdmZip(path.join(projectDir, 'Kimi_Agent_Deadlog API Log Analyzer.zip'));
const kimiEntries = kimiZip.getEntries();
console.log('\n=== Kimi_Agent_Deadlog API Log Analyzer.zip contents ===');
kimiEntries.forEach(entry => {
  console.log(entry.entryName);
  if (!entry.isDirectory) {
    const content = entry.getData().toString('utf8');
    console.log('--- Content of', entry.entryName, '---');
    console.log(content.substring(0, 5000));
    console.log('--- End of', entry.entryName, '---\n');
  }
});
