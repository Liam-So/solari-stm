"use client"

import React, { useState, useEffect, useRef } from 'react';
import { fetchMTAData } from './services/mtaServices';
import ModelViewer from './components/Model';
import { Play, Pause, Train } from 'lucide-react';
import { Howl } from 'howler';
import { AUDIO_STAGGER_DELAY, FETCH_MTA_INTERVAL, FETCH_MTR_INTERVAL } from './constants/constants';
import SubwayBoard from './components/SubwayBoard';
import MTRBoard from './components/MTRBoard';

type Train = {
  line?: string;
  destination: string;
  time: string;
  remarks?: string;
}

enum TrainType {
  MTR = 'MTR',
  MTA = 'MTA'
}


const SolariBoard = () => {
  const [boardData, setBoardData] = useState<Train[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      timeZone: 'America/New_York' 
    })
  );
  const [selectedBoard, setSelectedBoard] = useState(TrainType.MTA);

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
      }, i * AUDIO_STAGGER_DELAY);
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
      let trains;

      if (selectedBoard === TrainType.MTA) {
        trains = await fetchMTAData('MTA_SUBWAYS');
      } else {
        trains = await fetchMTAData('MTR_RAILROADS');
      }
      
      setBoardData(prevData => {
        const isSame = JSON.stringify(prevData) === JSON.stringify(trains);
        
        if (!isSame && audioEnabled) {
          playStaggeredFlips();
        } 
        return isSame ? prevData : trains;
      });
      setLoadingData(false);
    };
  
    updateBoard();

    const fetchInterval = selectedBoard === TrainType.MTA ? FETCH_MTA_INTERVAL : FETCH_MTR_INTERVAL;
    const interval = setInterval(updateBoard, fetchInterval);

    return () => clearInterval(interval);
  }, [audioEnabled, selectedBoard]);

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

        <button className="flex items-center text-sm justify-center gap-1 text-white mx-auto text-center cursor-pointer pb-8" onClick={() => setAudioEnabled(!audioEnabled)}>
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
        </button>

        <div className='flex justify-around text-white mb-8'>
          <button onClick={() => setSelectedBoard(TrainType.MTA)} className={`${selectedBoard === TrainType.MTR ? 'text-gray-600' : ''}`}>Subway</button>
          <button onClick={() => setSelectedBoard(TrainType.MTR)} className={`${selectedBoard === TrainType.MTA ? 'text-gray-600' : ''}`}>Metro-North Railroad</button>
        </div>

        {loadingData ? (
          <p className='mx-auto text-white text-center'>loading...</p>
        ) : selectedBoard === TrainType.MTA ? (
          <SubwayBoard boardData={boardData} />
        ) : (
          <MTRBoard boardData={boardData} />
        )}

        </div>
    </div>
  );
};

export default SolariBoard;
