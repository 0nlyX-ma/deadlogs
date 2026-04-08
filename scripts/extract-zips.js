import AdmZip from 'adm-zip';

// Use absolute paths with the files we know exist
const zipFiles = [
  './stitch.zip',
  './Kimi_Agent_Deadlog API Log Analyzer.zip'
];

for (const file of zipFiles) {
  console.log(`\n=== Processing: ${file} ===`);
  
  try {
    const zip = new AdmZip(file);
    const entries = zip.getEntries();
    
    entries.forEach(entry => {
      console.log('File:', entry.entryName);
      if (!entry.isDirectory) {
        const content = entry.getData().toString('utf8');
        console.log('--- Content of', entry.entryName, '---');
        console.log(content);
        console.log('--- End of', entry.entryName, '---\n');
      }
    });
  } catch (err) {
    console.log('Error processing', file, ':', err.message);
  }
}
