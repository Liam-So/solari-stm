"use client"

import React, { useState, useEffect } from 'react';
import FlipRow from './components/FlipRow';
import { fetchMTAData } from './services/mtaServices';

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
      
      // Only update state if data has actually changed
      setBoardData(prevData => {
        const newData = trains;
        if (JSON.stringify(prevData) === JSON.stringify(newData)) {
          return prevData;
        }
        return newData;
      });
    };

    // Initial fetch
    updateBoard();

    // Update every 30 seconds
    const interval = setInterval(updateBoard, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto bg-black">
      <div className="p-6 rounded-lg shadow-xl w-full max-w-5xl h-screen mx-auto">
        <div className="mb-4 text-white text-2xl font-bold text-center">
          GRAND CENTRAL STATION
        </div>
        <div className="text-white text-lg mb-4 text-center">
          {new Date().toLocaleTimeString('en-US', { hour12: false })}
        </div>

        <div className="relative w-full h-16 overflow-hidden">
          <div className="absolute w-full">
            <div className="animate-train text-4xl">
              🚂🚃🚃🚃🚃🚃
            </div>
          </div>
        </div>

        <div className="text-gray-400 text-sm mb-2 flex">
          <div className='flex w-full justify-between items-center px-2'>
            <div>DESTINATION</div>
            <div>TIME</div>
          </div>
        </div>

        {boardData.map((row) => (
          <FlipRow
            key={`${row.line}-${row.destination}-${row.time}`}
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
