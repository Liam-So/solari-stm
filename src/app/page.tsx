"use client"

import React, { useState, useEffect } from 'react';
import FlipRow from './components/FlipRow';
import { fetchMTAData } from './services/mtaServices';



const SolariBoard = () => {
  const [boardData, setBoardData] = useState([
    { line: '4', destination: 'CROWN HTS UTICA', time: '2 MIN' },
    { line: '6', destination: 'PELHAM BAY PARK', time: '4 MIN' },
    { line: 'N', destination: 'ASTORIA DITMARS', time: '6 MIN' },
    { line: 'F', destination: 'CONEY ISLAND', time: '10 MIN' },
    { line: '2', destination: 'WAKEFIELD 241 ST', time: '12 MIN' },
    { line: 'A', destination: 'FAR ROCKAWAY', time: '15 MIN' }
  ]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log('running interval');
      
  //     setBoardData(prev => {
  //       const newData = [...prev];
  //       newData[0] = { line: '4', destination: 'CROWN HTS UTICA', time: '1 MIN' };
  //       newData[1] = { line: '6', destination: 'PELHAM BAY PARK', time: '3 MIN' };
  //       newData[2] = { line: 'N', destination: 'DELAY - SIGNAL', time: '---' };
  //       newData[3] = { line: 'A', destination: '168 ST', time: '8 MIN' }
  //       return newData;
  //     });
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const updateBoard = async () => {
      const trains = await fetchMTAData();
      console.log(trains);
      
      // setBoardData(trains);
    };

    // Initial fetch
    updateBoard();

    // Update every 30 seconds
    // const interval = setInterval(updateBoard, 30000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto bg-black">
      <div className="p-6 rounded-lg shadow-xl w-full max-w-5xl h-screen mx-auto">
        <div className="mb-4 text-white text-2xl font-bold text-center">
          UNION SQUARE STATION
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
const styles = `
@keyframes flip {
  0% {
    transform: rotateX(0deg);
    background-color: #000;
  }
  50% {
    transform: rotateX(90deg);
    background-color: #111;
  }
  100% {
    transform: rotateX(180deg);
    background-color: #000;
  }
}

.animate-flip {
  animation: flip 0.05s linear;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}
`;