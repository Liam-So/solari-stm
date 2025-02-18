"use client"

import React, { useState, useEffect } from 'react';
import FlipRow from './components/FlipRow';
import { fetchMTAData } from './services/mtaServices';

/*
TODO:
1. Import the static GTFS data into a folder
2. Create a script that will get the stop ids for grand central station in stops.txt
3. Create a lookup table for the stops.txt. Make the key the ID and the value the destination name.
    - Should we store it in a file somewhere?
4. Get the last stop in tripUpdate.stopTimeUpdate. This will be our destination.

*/
type Train = {
  line: string;
  destination: string;
  time: string;
}

const SolariBoard = () => {
  const [boardData, setBoardData] = useState<Train[]>([]);

  useEffect(() => {
    const updateBoard = async () => {
      const trains = await fetchMTAData();
      console.log(trains);
      
      setBoardData(trains);
    };

    // Initial fetch
    updateBoard();

    // Update every 30 seconds
    const interval = setInterval(updateBoard, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto bg-black">
      <div className="p-6 rounded-lg shadow-xl w-full max-w-5xl h-screen mx-auto">
        <div className="mb-4 text-white text-2xl font-bold text-center">
          GRAND CENTRAL STATION
        </div>
        <div className="text-white text-lg mb-4 text-center font-mono">
          {new Date().toLocaleTimeString('en-US', { hour12: false })}
        </div>
        <div className="text-gray-400 text-sm mb-2 flex px-2">
          <div className="w-8" />
          <div className="flex-1 pl-4">DESTINATION</div>
          <div className="w-[280px] text-center">TIME</div>
        </div>
        {boardData.map((row, index) => (
          <FlipRow
            key={index}
            trainLine={row.line}
            destination={row.destination}
            time={row.time}
            onRowComplete={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default SolariBoard;

// Add this to your global CSS or style tag
// const styles = `
// @keyframes flip {
//   0% {
//     transform: rotateX(0deg);
//     background-color: #000;
//   }
//   50% {
//     transform: rotateX(90deg);
//     background-color: #111;
//   }
//   100% {
//     transform: rotateX(180deg);
//     background-color: #000;
//   }
// }

// .animate-flip {
//   animation: flip 0.05s linear;
//   transform-style: preserve-3d;
//   backface-visibility: hidden;
// }
// `;