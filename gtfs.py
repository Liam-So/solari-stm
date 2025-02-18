import csv
import requests
import zipfile
import os

# URL of the GTFS subway data
url = "https://rrgtfsfeeds.s3.amazonaws.com/gtfs_subway.zip"
zip_filename = "gtfs_subway.zip"
extract_folder = "gtfs_subway"
ts_filename = "src/app/constants/stops.ts"  # Path to save the TypeScript file
grand_central_filename = "src/app/constants/grandCentral.ts"

# Download the GTFS zip file
response = requests.get(url)
response.raise_for_status()

# Save the ZIP file
with open(zip_filename, "wb") as f:
    f.write(response.content)

# Extract the ZIP file
with zipfile.ZipFile(zip_filename, "r") as zip_ref:
    zip_ref.extractall(extract_folder)

# Path to stops.txt
stops_file = os.path.join(extract_folder, "stops.txt")

# Read stops.txt and create lookup dictionary
stops_lookup = {}

# optional- but we're tracking grand central station
grand_central = []

with open(stops_file, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        stop_id = row["stop_id"]
        stop_name = row["stop_name"]
        if stop_name == "Grand Central-42 St":
          grand_central.append(stop_id)
        stops_lookup[stop_id] = stop_name

# Generate TypeScript file content
ts_content = "export const STOPS: Record<string, string> = {\n"
for stop_id, stop_name in stops_lookup.items():
    ts_content += f'    "{stop_id}": "{stop_name}",\n'
ts_content += "};\n"

# Ensure the constants directory exists
os.makedirs(os.path.dirname(ts_filename), exist_ok=True)

# Save the TypeScript file in src/app/constants
with open(ts_filename, "w", encoding="utf-8") as f:
    f.write(ts_content)


# Generate Typescript file for grand central ids
gc_content = "export const GRAND_CENTRAL_STOPS: Set<string> = new Set([\n"
for stop_id in grand_central:
    gc_content += f'    "{stop_id}",\n'
gc_content += "]);\n"

# Save the Grand Central TypeScript file
with open(grand_central_filename, "w", encoding="utf-8") as f:
    f.write(gc_content)

print(f"TypeScript files '{ts_filename}' and '{grand_central_filename}' created successfully.")
