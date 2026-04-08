import zipfile
import os

# Use absolute paths to the ZIP files
project_dir = "/vercel/share/v0-project"
zip_files = [
    os.path.join(project_dir, "stitch.zip"),
    os.path.join(project_dir, "Kimi_Agent_Deadlog API Log Analyzer.zip")
]

print("Looking for ZIP files at:")
for zf in zip_files:
    print(f"  {zf} - exists: {os.path.exists(zf)}")

for zf in zip_files:
    print(f"\n=== {os.path.basename(zf)} ===")
    try:
        with zipfile.ZipFile(zf, 'r') as z:
            for name in z.namelist():
                print(f"File: {name}")
                if not name.endswith('/'):
                    content = z.read(name).decode('utf-8', errors='replace')
                    print(f"--- Content of {name} ---")
                    print(content[:50000])  # Limit output
                    print(f"--- End of {name} ---\n")
    except Exception as e:
        print(f"Error reading {zf}: {e}")
