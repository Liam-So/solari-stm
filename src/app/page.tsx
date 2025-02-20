"use client"

import React, { useState, useEffect } from 'react';
import FlipRow from './components/FlipRow';

// type Train = {
//   line: string;
//   destination: string;
//   time: string;
// }

const SolariBoard = () => {
  const [destination, setDestination] = useState<string>("");
  const [time, setTime] = useState<number>(1);


  useEffect(() => {
    // const updateBoard = async () => {
    //   const trains = await fetchMTAData();
    //   console.log(trains);
      
    //   setBoardData(trains);
    // };

    // // Initial fetch
    // updateBoard();
    const updateBoard = () => {
      console.log('running');
      setDestination("hello welcome")
      setTime(prev => prev + 1)
    }

    // Update every 30 seconds
    const interval = setInterval(updateBoard, 3000);
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
        <div className="text-gray-400 text-sm mb-2 flex">
          <div className='flex w-full justify-between items-center px-2'>
            <div>DESTINATION</div>
            <div>TIME</div>
          </div>
        </div>

        <FlipRow
            trainLine={''}
            destination={destination}
            time={time.toString()}
            onRowComplete={() => {}}
          />

        {/* {boardData.map((row, index) => (
          <FlipRow
            key={index}
            trainLine={row.line}
            destination={row.destination}
            time={row.time}
            onRowComplete={() => {}}
          />
        ))} */}
      </div>
    </div>
  );
};

export default SolariBoard;
