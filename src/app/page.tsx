"use client"

import React, { useState, useEffect, useRef } from 'react';
import FlipRow from './components/FlipRow';
import { fetchMTAData } from './services/mtaServices';
import ModelViewer from './components/Model';
import { Play, Pause } from 'lucide-react';
import { Howl } from 'howler';

type Train = {
  line: string;
  destination: string;
  time: string;
}

const SolariBoard = () => {
  const [boardData, setBoardData] = useState<Train[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      timeZone: 'America/New_York' 
    })
  );
  const flipSound = useRef<Howl | null>(null);

  useEffect(() => {
    flipSound.current = new Howl({
      src: ['/flip.mp3'],
      volume: 0.3,
      pool: 5
    });
  }, []);


  const playStaggeredFlips = () => {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        flipSound.current?.play();
      }, i * 50);
    }
  };


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-US', { 
          hour12: false, 
          timeZone: 'America/New_York' 
        })
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    }
  }, []);


  useEffect(() => {
    const updateBoard = async () => {
      const trains = await fetchMTAData();
      
      setBoardData(prevData => {
        const isSame = JSON.stringify(prevData) === JSON.stringify(trains);
        
        if (!isSame && audioEnabled) {
          playStaggeredFlips();
        } 
        return isSame ? prevData : trains;
      });
    };
  
    updateBoard();
    const interval = setInterval(updateBoard, 10000);
    return () => clearInterval(interval);
  }, [audioEnabled]);

  return (
    <div className="mx-auto bg-black">
      <div className="p-6 rounded-lg shadow-xl w-full max-w-5xl h-screen mx-auto">
        <div className="text-white text-2xl font-bold text-center">
          GRAND CENTRAL TERMINAL
        </div>

        <ModelViewer />

        <div className="text-white text-lg mb-4 text-center">
          {currentTime}
        </div>

        <div className="flex items-center text-sm justify-center gap-1 text-white mx-auto text-center cursor-pointer pb-8" onClick={() => setAudioEnabled(!audioEnabled)}>
          {audioEnabled ? (
            <>
              <Pause size={12} />
              <p>Disable Sound</p>
            </>
            ) : (
              <>
                <Play size={12}/>
                <p>Enable Sound</p>
              </>
            )}
        </div>
        
        <div className="text-gray-400 text-sm mb-2 flex">
          <div className='flex w-full justify-between items-center px-2'>
            <div>DESTINATION</div>
            <div>TIME</div>
          </div>
        </div>

        <div className="pb-20">
          {boardData.map((row, index) => (
            <FlipRow
              key={index}
              trainLine={row.line}
              destination={row.destination}
              time={row.time}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolariBoard;
