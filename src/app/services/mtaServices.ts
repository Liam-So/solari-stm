import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import { STOPS } from '../constants/stops';
import { GRAND_CENTRAL_STOPS } from '../constants/grandCentral';

type Train = {
  line: string;
  destination: string;
  time: string;
}

export async function fetchMTAData(): Promise<Train[]> {
  try {
    const response = await fetch(
      'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs'
    );
    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );

    console.log(feed);

    const trains: Train[] = [];

    feed.entity.forEach((entity) => {
      if (entity.tripUpdate && entity.tripUpdate.trip) {
        const line = entity.tripUpdate.trip.routeId || "";
        
        // Only process 4, 5, 6, 7, S trains
        if (!['4', '5', '6', '7', '7X', 'S', 'GS'].includes(line)) return;

        const stopTimeUpdates = entity.tripUpdate.stopTimeUpdate;
        if (!stopTimeUpdates || stopTimeUpdates.length === 0) return;

        // Find the stop update for Grand Central
        const gcStop = stopTimeUpdates.find(update =>
          update.stopId && GRAND_CENTRAL_STOPS.has(update.stopId)
        );


        if (gcStop && gcStop.arrival && gcStop.arrival.time) {
          const arrivalTime = Number(gcStop.arrival?.time) || 0; // Ensure it's a number
          const now = Date.now() / 1000; // Assuming arrivalTime is in Unix timestamp (seconds)
          const minutesAway = Math.round((arrivalTime - now) / 60);
          
          // the final destination is the last element in the stop time update object
          const finalDestination = stopTimeUpdates.at(-1)?.stopId || "";

          if (minutesAway > 0) {
            trains.push({
              line,
              destination: STOPS[finalDestination].toUpperCase(),
              time: `${minutesAway} MIN`
            });
          }
        }
      }
    });


    // Sort by arrival time and take the first 9 trains
    return trains.sort((a, b) => parseInt(a.time) - parseInt(b.time)).slice(0, 9);
  } catch (error) {
    console.error('Error fetching MTA data:', error);
    return [];
  }
}