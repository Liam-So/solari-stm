"use client"

import React, { useState, useEffect } from 'react';
import FlipRow from './components/FlipRow';
import FlapDisplay from './components/FlapDisplay';
import {Presets} from './components/Presets';
import { fetchMTAData } from './services/mtaServices';

type Train = {
  line: string;
  destination: string;
  time: string;
}

const Words = [
  'Washington',
  'Baltimore',
  'Philadelphia',
  'Newark',
  'New York',
  'New Haven',
  'Providence',
  'Boston'
]

const Modes = {
  Numeric: 0,
  Alphanumeric: 1,
  Words: 2
}

const SolariBoard = () => {
  const [boardData, setBoardData] = useState<Train[]>([]);
  const [mode, setMode] = useState(Modes.Alphanumeric)
  const [chars, setChars] = useState(Presets.ALPHANUM)
  const [words, setWords] = useState(Words)
  const [length, setLength] = useState(40)
  const [timing, setTiming] = useState(30)
  const [padChar, setPadChar] = useState(' ')
  const [padMode, setPadMode] = useState('auto')
  const [value, setValue] = useState('hello')
  const [hinge, setHinge] = useState(true)

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
          <div className="text-center pr-4 md:pr-20">TIME</div>
        </div>

        <button className='p-1 rounded-lg text-xs bg-red-50' onClick={() => setValue("TORONTO")}>Click me</button>

        <FlapDisplay 
          value={value}
          chars={chars}
          words={mode === Modes.Words ? words : undefined}
          length={length}
          timing={timing}
          hinge={hinge}
          padChar={padChar}
          padMode={padMode}
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