import zipfile
import os

# List files in current directory
print("Current directory:", os.getcwd())
print("Files:", os.listdir('.'))

zip_files = [f for f in os.listdir('.') if f.endswith('.zip')]
print("ZIP files found:", zip_files)

for zf in zip_files:
    print(f"\n=== {zf} ===")
    try:
        with zipfile.ZipFile(zf, 'r') as z:
            for name in z.namelist():
                print(f"File: {name}")
                if not name.endswith('/'):
                    content = z.read(name).decode('utf-8', errors='replace')
                    print(f"--- Content of {name} ---")
                    print(content)
                    print(f"--- End of {name} ---\n")
    except Exception as e:
        print(f"Error: {e}")
