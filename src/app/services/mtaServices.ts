import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import { STOPS } from '../constants/stops';
import GTFS_MTA_JSON from "@/app/constants/gtfs_mappings.json";
import GTFS_MTR_JSON from "@/app/constants/gtfsmnr_mappings.json";
import { Train, TransitData } from '../types/train';


const MTA_SUBWAYS_URL = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs';
const MTR_RAILROADS_URL = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/mnr%2Fgtfs-mnr'

const DataFeeds: Record<string, string> = {
  MTA_SUBWAYS: MTA_SUBWAYS_URL,
  MTR_RAILROADS: MTR_RAILROADS_URL
}

const GTFS_MTA = GTFS_MTA_JSON as TransitData;
const GTFS_MTR = GTFS_MTR_JSON as TransitData;

const extractMTATrainData = (feed: any) => {
  console.log('extracting mta data');
  console.log(feed);
  
  
  const trains: Train[] = [];
  const GRAND_CENTRAL_STOPS = GTFS_MTA.grand_central_stop_ids;

  feed.entity.forEach((entity: any) => {
    if (entity.tripUpdate && entity.tripUpdate.trip) {
      const line = entity.tripUpdate.trip.routeId || "";
      const route = entity.tripUpdate.trip.routeId;
      
      // Grand central only supports these lines- pull into a constant?
      if (!['4', '5', '6', '7', '7X', 'S', 'GS'].includes(line)) return;

      const stopTimeUpdates = entity.tripUpdate.stopTimeUpdate;
      if (!stopTimeUpdates || stopTimeUpdates.length === 0) return;

      // Find the stop update for Grand Central
      const gcStop = stopTimeUpdates.find((update: any) =>
        update.stopId && GRAND_CENTRAL_STOPS.includes(update.stopId)
      );
      
      // WHY ARE DOING ARRIVAL HERE?????
      if (gcStop && gcStop.arrival && gcStop.arrival.time) {
        const arrivalTime = Number(gcStop.arrival?.time) || 0; // Ensure it's a number
        const now = Date.now() / 1000; // Assuming arrivalTime is in Unix timestamp (seconds)
        const minutesAway = Math.round((arrivalTime - now) / 60);
        
        // the final destination is the last element in the stop time update object
        const finalDestination = stopTimeUpdates.at(-1)?.stopId || "";
        const color = GTFS_MTA["routes"][route]["color"];

        if (minutesAway > 0) {
          trains.push({
            line,
            destination: STOPS[finalDestination].toUpperCase(),
            time: `${minutesAway} MIN`,
            color: `#${color}`
          });
        }
      }
    }
  });

  return trains;
}


const extractMTRTrainData = (feed: any) => {
  const trains: Train[] = [];
  console.log(feed);

  feed.entity.forEach((entity: any) => {
    if (entity.tripUpdate && entity.tripUpdate.stopTimeUpdate && entity.tripUpdate.trip) {
      // if first stop is grand central, then it is a departure
      if (entity.tripUpdate.stopTimeUpdate[0].stopId === "1") {
        const delay = entity.tripUpdate.stopTimeUpdate[0].departure.delay;
        let remarks = ""
        
        if (delay === 0) {
          remarks = "ON TIME";
        } else {
          const delayedMinutes = Math.floor(delay / 60);
          remarks = `DELAYED ${delayedMinutes} MIN`;
        }

        const destinationStopId: string = entity.tripUpdate.stopTimeUpdate.at(-1).stopId;
        const stops = GTFS_MTR["stops"];
        const destination = stops[destinationStopId].toUpperCase()
        
        const departure = entity.tripUpdate.trip.startTime;
        const departureTime = entity.tripUpdate.stopTimeUpdate[0].departure.time;
        const now = Date.now() / 1000; // Assuming arrivalTime is in Unix timestamp (seconds)
        const minutesAway = Math.round((departureTime - now) / 60);

        const route = entity.tripUpdate.trip.routeId;
        const color = GTFS_MTR["routes"][route]["color"]

        if (minutesAway > 0 && minutesAway < 60) {
          trains.push({
            destination: destination,
            time: departure,
            remarks: remarks,
            color: `#${color}`
          })
        }
      }
    }
    return trains;
  })


  return trains;
}


export async function fetchMTAData(trackType: string): Promise<Train[]> {
  try {
    if (!(trackType in DataFeeds)) {
      throw new Error('Cannot find track type')
    }

    const response = await fetch(trackType === "MTA_SUBWAYS" ? DataFeeds.MTA_SUBWAYS : DataFeeds.MTR_RAILROADS);
    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );


    const trains: Train[] = trackType === "MTA_SUBWAYS" ? extractMTATrainData(feed) : extractMTRTrainData(feed);
    console.log("trains", trains);
    
    
    // Sort by arrival time and take the first 9 trains
    return trains.sort((a, b) => parseInt(a.time) - parseInt(b.time)).slice(0, 9);
  } catch (error) {
    console.error('Error fetching MTA data:', error);
    return [];
  }
}