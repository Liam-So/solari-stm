"use client"

import React, { useState, useEffect, useRef } from 'react';
import FlipRow from './components/FlipRow';
import { fetchMTAData } from './services/mtaServices';
import { Howl } from 'howler';
import { Play, Pause } from 'lucide-react';

type Train = {
  line: string;
  destination: string;
  time: string;
}

const SolariBoard = () => {
  const [boardData, setBoardData] = useState<Train[]>([]);
  const flipSound = useRef<Howl | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    flipSound.current = new Howl({
      src: ['/flip.mp3'],
      volume: 0.3,
      pool: 5
    });
  }, []);

  const playStaggeredFlips = () => {
    if (audioEnabled) {
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          flipSound.current?.play();
        }, i * 50);
      }
    }
  };


  useEffect(() => {
    const updateBoard = async () => {
      const trains = await fetchMTAData();
      
      setBoardData(prevData => {
        const newData = trains;
        if (JSON.stringify(prevData) === JSON.stringify(newData)) {
          return prevData;
        }
        return newData;
      });
    };

    updateBoard();

    const interval = setInterval(updateBoard, 5000);
    return () => clearInterval(interval);
  }, [audioEnabled]);

  return (
    <div className="mx-auto bg-black">
      <div className="p-6 rounded-lg shadow-xl w-full max-w-5xl h-screen mx-auto">
        <div className='flex flex-col items-center justify-center'>
          <div className="mb-4 text-white text-2xl font-bold text-center">
            GRAND CENTRAL STATION
          </div>
          {!audioEnabled ? (
            <button
              onClick={() => setAudioEnabled(true)}
              className="flex items-center gap-1 mb-4 px-4 py-2 text-white rounded hover:text-gray-200"
            >
              <Play size={14} />Enable Sound
            </button>
          ) : (
            <button
              onClick={() => setAudioEnabled(false)}
              className="flex items-center gap-1 mb-4 px-4 py-2 text-white rounded hover:text-gray-200"
            >
              <Pause size={14} />Pause Sound
            </button>
          )}
          <div className="text-white text-lg mb-4 text-center">
            {new Date().toLocaleTimeString('en-US', { hour12: false })}
          </div>
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
            <div>STATUS</div>
          </div>
        </div>

        {boardData.map((row) => (
          <FlipRow
            key={`${row.line}-${row.destination}-${row.time}`}
            trainLine={row.line}
            destination={row.destination}
            time={row.time}
            onRowComplete={() => {}}
            playAudio={playStaggeredFlips}
          />
        ))}
      </div>
    </div>
  );
};

export default SolariBoard;
