"use client"

import type React from "react"
import { useEffect, useState } from "react"
import SolariBoard from "../../components/SolariBoard"

interface Departure {
  time: string;
  destination: string;
  platform: string;
  status: string;
}

export default function Home() {
  const [departures, setDepartures] = useState<Departure[]>([
    { time: "09:00", destination: "LONDON KINGS CROSS", platform: "1", status: "ON TIME" },
    { time: "09:15", destination: "MANCHESTER PICCADILLY", platform: "2", status: "DELAYED" },
    { time: "09:30", destination: "EDINBURGH WAVERLEY", platform: "3", status: "ON TIME" },
    { time: "09:45", destination: "LIVERPOOL LIME ST", platform: "4", status: "ON TIME" },
    { time: "10:00", destination: "GLASGOW CENTRAL", platform: "5", status: "CANCELLED" },
    { time: "10:15", destination: "BRISTOL TEMPLE MEADS", platform: "6", status: "ON TIME" },
    { time: "10:30", destination: "LEEDS", platform: "7", status: "DELAYED" },
    { time: "10:45", destination: "NEWCASTLE", platform: "8", status: "ON TIME" },
    { time: "11:00", destination: "BIRMINGHAM NEW ST", platform: "9", status: "ON TIME" },
    { time: "11:15", destination: "CARDIFF CENTRAL", platform: "10", status: "ON TIME" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDepartures(prev => {
        const newDepartures = [...prev];
        const randomIndex = Math.floor(Math.random() * newDepartures.length);
        const statuses = ["ON TIME", "DELAYED", "CANCELLED"];
        newDepartures[randomIndex] = {
          ...newDepartures[randomIndex],
          status: statuses[Math.floor(Math.random() * statuses.length)]
        };
        return newDepartures;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      {/* <div className="mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">TRAIN DEPARTURES</h1>
        <SolariBoard departures={departures} />
      </div> */}

      {/* <div className="max-w-screen-xl mx-auto bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div>TIME</div>
          <div>DESTINATION</div>
          <div>PLATFORM</div>
          <div>STATUS</div>
        </div>
      </div> */}

      {/* <div className="mb-6 grid grid-cols-4 gap-8 text-white font-mono">
        <div className="flex pl-2">TIME</div>
        <div className="flex pl-2">DESTINATION</div>
        <div className="flex pl-2">PLATFORM</div>
        <div className="flex pl-2">STATUS</div>
      </div> */}

      <SolariBoard departures={departures} />


    </div>
  );
}

