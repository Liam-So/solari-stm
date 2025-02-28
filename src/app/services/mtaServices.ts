import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import { STOPS } from '../constants/stops';
import GTFS_MTA_JSON from "@/app/constants/gtfs_mappings.json";
import GTFS_MTR_JSON from "@/app/constants/gtfsmnr_mappings.json";
import { Train, TransitData } from '../types/train';

// API endpoints
const MTA_SUBWAYS_URL = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs';
const MTR_RAILROADS_URL = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/mnr%2Fgtfs-mnr';

// Map of valid track types to their API endpoints
const DATA_FEEDS: Record<string, string> = {
  MTA_SUBWAYS: MTA_SUBWAYS_URL,
  MTR_RAILROADS: MTR_RAILROADS_URL
};

// Transit data mappings
const GTFS_MTA = GTFS_MTA_JSON as TransitData;
const GTFS_MTR = GTFS_MTR_JSON as TransitData;

// Grand Central stop IDs
const GRAND_CENTRAL_LINES = ['4', '5', '6', '7', '7X', 'S', 'GS'];

// Types for GTFS data structures
interface StopTimeUpdate {
  stopId: string;
  arrival?: {
    time?: number;
    delay?: number;
  };
  departure?: {
    time?: number;
    delay?: number;
  };
  scheduledTrack?: string;
  actualTrack?: string;
}

interface TripUpdate {
  trip: {
    tripId: string;
    routeId: string;
    startTime: string;
    startDate: string;
  };
  stopTimeUpdate: StopTimeUpdate[];
}

interface FeedEntity {
  id: string;
  tripUpdate?: TripUpdate;
}

/**
 * Extracts MTA subway data from GTFS feed entities
 * @param entities - Array of GTFS feed entities
 * @returns Array of formatted train objects
 */
const extractMTATrainData = (entities: FeedEntity[]): Train[] => {
  const trains: Train[] = [];
  const GRAND_CENTRAL_STOPS = GTFS_MTA.grand_central_stop_ids;

  entities.forEach((entity) => {
    if (!entity.tripUpdate?.trip) return;
    
    const trip = entity.tripUpdate.trip;
    const line = trip.routeId || "";
    const route = trip.routeId;
    
    // Filter for Grand Central supported lines only
    if (!GRAND_CENTRAL_LINES.includes(line)) return;

    const stopTimeUpdates = entity.tripUpdate.stopTimeUpdate;
    if (!stopTimeUpdates || stopTimeUpdates.length === 0) return;

    // Find the update for Grand Central
    const gcStop = stopTimeUpdates.find(update => 
      update.stopId && GRAND_CENTRAL_STOPS.includes(update.stopId)
    );
    
    if (!gcStop?.arrival?.time) return;
    
    const arrivalTime = Number(gcStop.arrival.time) || 0;
    const now = Math.floor(Date.now() / 1000);
    const minutesAway = Math.round((arrivalTime - now) / 60);
    
    // Only process trains that haven't arrived yet
    if (minutesAway <= 0) return;
    
    // Get the final destination stop ID
    const finalDestination = stopTimeUpdates[stopTimeUpdates.length - 1]?.stopId || "";
    if (!finalDestination || !STOPS[finalDestination]) return;
    
    const color = GTFS_MTA.routes[route]?.color || "000000";

    trains.push({
      line,
      destination: STOPS[finalDestination].toUpperCase(),
      time: `${minutesAway} MIN`,
      color: `#${color}`
    });
  });

  return trains;
};

/**
 * Extracts Metro-North Railroad data from GTFS feed entities
 * @param entities - Array of GTFS feed entities
 * @returns Array of formatted train objects
 */
const extractMTRTrainData = (entities: FeedEntity[]): Train[] => {
  const trains: Train[] = [];
  const GRAND_CENTRAL_STOP_ID = "1"; // Grand Central station ID for Metro-North

  entities.forEach((entity) => {
    if (!entity.tripUpdate?.stopTimeUpdate?.length || !entity.tripUpdate.trip) return;
    
    const firstStop = entity.tripUpdate.stopTimeUpdate[0];
    
    // Only process departures from Grand Central
    if (firstStop.stopId !== GRAND_CENTRAL_STOP_ID || !firstStop.departure?.time) return;


    const departureTime = Number(firstStop.departure.time) || 0;
    const delay = firstStop.departure.delay || 0;
    const now = Math.floor(Date.now() / 1000);
    const minutesAway = Math.round((departureTime - now) / 60);
 
    // Skip trains too far in the future or already departed
    if (minutesAway <= 0 || minutesAway >= 60) return;
    
    // Determine status based on delay
    const remarks = delay === 0 
      ? "ON TIME" 
      : `DELAYED ${Math.floor(delay / 60)} MIN`;

    
    // Get destination information
    const lastStopIndex = entity.tripUpdate.stopTimeUpdate.length - 1;
    const destinationStopId = entity.tripUpdate.stopTimeUpdate[lastStopIndex]?.stopId || "";
    
    if (!destinationStopId || !GTFS_MTR.stops[destinationStopId]) return; // BUG HERE
    
    const destination = GTFS_MTR.stops[destinationStopId].toUpperCase();
    const route = entity.tripUpdate.trip.routeId;
    const color = GTFS_MTR.routes[route]?.color || "000000";
    
    trains.push({
      destination,
      time: entity.tripUpdate.trip.startTime,
      remarks,
      color: `#${color}`
    });
  });

  return trains;
};

/**
 * Fetches and processes transit data from MTA GTFS feeds
 * @param trackType - Type of track/transit system to fetch (MTA_SUBWAYS or MTR_RAILROADS)
 * @returns Promise resolving to an array of formatted train objects
 */
export async function fetchMTAData(trackType: string): Promise<Train[]> {
  try {
    if (!(trackType in DATA_FEEDS)) {
      throw new Error(`Invalid track type: ${trackType}`);
    }

    const apiUrl = DATA_FEEDS[trackType as keyof typeof DATA_FEEDS];
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );

    const feedEntities = feed.entity as unknown as FeedEntity[];
    
    // Process data based on track type
    const trains = trackType === "MTA_SUBWAYS" 
      ? extractMTATrainData(feedEntities) 
      : extractMTRTrainData(feedEntities);
    
    // Sort and limit results
    return trains
      .sort((a, b) => {
        const timeA = parseInt(a.time) || 0;
        const timeB = parseInt(b.time) || 0;
        return timeA - timeB;
      })
      .slice(0, 9);
      
  } catch (error) {
    console.error('Error fetching MTA data:', error);
    return [];
  }
}