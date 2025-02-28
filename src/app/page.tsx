"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchMTAData } from './services/mtaServices';
import ModelViewer from './components/Model';
import { Play, Pause } from 'lucide-react';
import { Howl } from 'howler';
import { AUDIO_STAGGER_DELAY, FETCH_MTA_INTERVAL, FETCH_MTR_INTERVAL } from './constants/constants';
import SubwayBoard from './components/SubwayBoard';
import MTRBoard from './components/MTRBoard';
import { Train } from './types/train';

enum TrainType {
  MTR = 'MTR',
  MTA = 'MTA'
}

const SolariBoard: React.FC = () => {
  const [boardData, setBoardData] = useState<Train[]>([]);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>(
    getCurrentTimeNYC()
  );
  const [selectedBoard, setSelectedBoard] = useState<TrainType>(TrainType.MTA);

  const flipSound = useRef<Howl | null>(null);
  // Store the audio state in a ref to access current value without triggering effect rerun
  const audioEnabledRef = useRef<boolean>(audioEnabled);

  // Update ref when state changes
  useEffect(() => {
    audioEnabledRef.current = audioEnabled;
  }, [audioEnabled]);

  // Helper function to get formatted NYC time
  function getCurrentTimeNYC(): string {
    return new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      timeZone: 'America/New_York' 
    });
  }

  // Initialize sound effect - this doesn't need to be recreated on toggles
  useEffect(() => {
    flipSound.current = new Howl({
      src: ['/flip.mp3'],
      volume: 0.3,
      pool: 5
    });

    return () => {
      // Cleanup sound resources
      flipSound.current?.unload();
    };
  }, []);

  const playStaggeredFlips = useCallback(() => {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        flipSound.current?.play();
      }, i * AUDIO_STAGGER_DELAY);
    }
  }, []);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTimeNYC());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const updateBoard = async () => {
      try {
        setLoadingData(true);
        const endpoint = selectedBoard === TrainType.MTA ? 'MTA_SUBWAYS' : 'MTR_RAILROADS';
        const trains = await fetchMTAData(endpoint);
        
        setBoardData(prevData => {
          const isSame = JSON.stringify(prevData) === JSON.stringify(trains);
          
          // Use the ref here instead of the state to avoid dependency
          if (!isSame && audioEnabledRef.current) {
            playStaggeredFlips();
          } 
          return isSame ? prevData : trains;
        });
      } catch (error) {
        console.error("Failed to fetch train data:", error);
      } finally {
        setLoadingData(false);
      }
    };
  
    // Initial fetch
    updateBoard();

    // Set up interval for periodic updates
    const fetchInterval = selectedBoard === TrainType.MTA ? FETCH_MTA_INTERVAL : FETCH_MTR_INTERVAL;
    const interval = setInterval(updateBoard, fetchInterval);

    return () => clearInterval(interval);
  }, [selectedBoard, playStaggeredFlips]);

  const handleBoardChange = useCallback((boardType: TrainType) => {
    setSelectedBoard(boardType);
  }, []);

  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => !prev);
  }, []);

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

        <button 
          className="flex items-center text-sm justify-center gap-1 text-white mx-auto text-center cursor-pointer pb-8" 
          onClick={toggleAudio}
          aria-label={audioEnabled ? "Disable Sound" : "Enable Sound"}
        >
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
          <button 
            onClick={() => handleBoardChange(TrainType.MTA)} 
            className={`px-4 py-2 rounded transition-colors ${selectedBoard === TrainType.MTA ? 'text-white' : 'text-gray-600'}`}
            aria-pressed={selectedBoard === TrainType.MTA}
          >
            Subway
          </button>
          <button 
            onClick={() => handleBoardChange(TrainType.MTR)} 
            className={`px-4 py-2 rounded transition-colors ${selectedBoard === TrainType.MTR ? 'text-white' : 'text-gray-600'}`}
            aria-pressed={selectedBoard === TrainType.MTR}
          >
            Metro-North Railroad
          </button>
        </div>

        {loadingData ? (
          <p className='mx-auto text-white text-center'>Loading...</p>
        ) : (
          <>
            {selectedBoard === TrainType.MTA ? (
              <SubwayBoard boardData={boardData} />
            ) : (
              <MTRBoard boardData={boardData} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SolariBoard;