"use client"

import React, { useState, useEffect } from 'react';
import FlipRow from './components/FlipRow';
import { fetchMTAData } from './services/mtaServices';
import ModelViewer from './components/Model';

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
      
      setBoardData(trains);
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
        <div className="text-white text-2xl font-bold text-center">
          GRAND CENTRAL TERMINAL
        </div>

        <ModelViewer />
        <div className="text-white text-lg mb-4 text-center">
          {new Date().toLocaleTimeString('en-US', { hour12: false })}
        </div>
        
        <div className="text-gray-400 text-sm mb-2 flex">
          <div className='flex w-full justify-between items-center px-2'>
            <div>DESTINATION</div>
            <div>TIME</div>
          </div>
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
