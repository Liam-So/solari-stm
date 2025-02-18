import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

const GRAND_CENTRAL_STOPS = new Set([
  '631', '631N', '631S', // 4, 5, 6 lines
  '723', '723N', '723S', // 7 line
  '901', '901N', '901S'  // Shuttle (S)
]);

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
    const now = Math.floor(Date.now() / 1000); // Convert to seconds

    feed.entity.forEach((entity) => {
      if (entity.tripUpdate && entity.tripUpdate.trip) {
        const line = entity.tripUpdate.trip.routeId || "";
        // Only process 4, 5, 6, 7, S trains
        if (!['4', '5', '6', '7', 'S'].includes(line)) return;

        const stopTimeUpdates = entity.tripUpdate.stopTimeUpdate;
        if (!stopTimeUpdates || stopTimeUpdates.length === 0) return;

        // Find the stop update for Grand Central
        const gcStop = stopTimeUpdates.find(update =>
          update.stopId && GRAND_CENTRAL_STOPS.has(update.stopId)
        );

        if (gcStop && gcStop.arrival && gcStop.arrival.time) {
          const arrivalTime = gcStop.arrival.time; // Directly use timestamp
          const minutesAway = Math.round((arrivalTime - now) / 60);

          if (minutesAway > 0) {
            trains.push({
              line,
              destination: 'GRAND CENTRAL',
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