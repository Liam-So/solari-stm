import click
import os
import pandas as pd
import json
import numpy as np

DATA_FEEDS = {
    "MTR": "https://rrgtfsfeeds.s3.amazonaws.com/gtfsmnr.zip",  # Metro-North Railroad
    "MTA": "https://rrgtfsfeeds.s3.amazonaws.com/gtfs_subway.zip"  # MTA Subway
}

@click.command()
@click.option('--feed', default="MTR", help='GTFS Feed to extract mappings from')
def extract_mappings(feed):
    """
    Extract mapping information from GTFS static files to enrich real-time data
    for a Grand Central Terminal Solari board.
    """
    zip_filename = "gtfsmnr.zip" if feed == "MTR" else "gtfs_subway.zip"
    extract_folder = "gtfsmnr" if feed == "MTR" else "gtfs_subway"
    
    ## Uncomment this code to download zip files online
    ## Download and extract the GTFS feed
    # response = requests.get(DATA_FEEDS[feed], verify=False)
    # response.raise_for_status()
    
    # with open(zip_filename, "wb") as f:
    #     f.write(response.content)
    
    # with zipfile.ZipFile(zip_filename, "r") as zip_ref:
    #     zip_ref.extractall(extract_folder)
    
    # Create mappings
    mappings = {}
    
    # Stop ID to stop name mapping
    stops_df = pd.read_csv(f"{extract_folder}/stops.txt")
    mappings['stops'] = stops_df[['stop_id', 'stop_name']].set_index('stop_id').to_dict()['stop_name']
    
    # Add platform/track information if available
    if 'platform_code' in stops_df.columns:
        mappings['platforms'] = stops_df[['stop_id', 'platform_code']].dropna().set_index('stop_id').to_dict()['platform_code']
    
    # Route ID to route info mapping
    routes_df = pd.read_csv(f"{extract_folder}/routes.txt", keep_default_na=False)

    mappings['routes'] = {}
    for _, route in routes_df.iterrows():
        mappings['routes'][route['route_id']] = {
            'short_name': route.get('route_short_name', ''),
            'long_name': route.get('route_long_name', ''),
            'color': route.get('route_color', '')
        }
    
    # Find Grand Central Terminal stop IDs
    gc_name_patterns = ['Grand Central', 'GCT', 'Grd Central']
    if feed == "MTA":
        gc_name_patterns.append('42 St-Grand Central')
    
    gc_stops = stops_df[stops_df['stop_name'].str.contains('|'.join(gc_name_patterns), case=False)]

    mappings['grand_central_stop_ids'] = gc_stops['stop_id'].tolist()

    output = "gtfs_mappings.json" if feed == "MTA" else "gtfsmnr_mappings.json"

    constants_directory = f"src/app/constants/{output}"

    os.makedirs(os.path.dirname(constants_directory), exist_ok=True)

    # Save mappings as JSON
    with open(constants_directory, 'w') as f:
        json.dump(mappings, f, indent=2)
    
    print(f"Successfully extracted GTFS mappings for {feed}")
    print(f"Mappings saved to {constants_directory}")
    
    # Clean up
    if os.path.exists(zip_filename):
        os.remove(zip_filename)

if __name__ == '__main__':
    extract_mappings()