"use client"

import React, { useState, useEffect } from 'react';

const CHARACTERS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-'.split('');

const getTrainColor = (line) => {
  const colors = {
    'A': 'bg-blue-600',
    'C': 'bg-blue-600',
    'E': 'bg-blue-600',
    'B': 'bg-orange-600',
    'D': 'bg-orange-600',
    'F': 'bg-orange-600',
    'M': 'bg-orange-600',
    'N': 'bg-yellow-500',
    'Q': 'bg-yellow-500',
    'R': 'bg-yellow-500',
    'W': 'bg-yellow-500',
    '1': 'bg-red-600',
    '2': 'bg-red-600',
    '3': 'bg-red-600',
    '4': 'bg-green-600',
    '5': 'bg-green-600',
    '6': 'bg-green-600',
    '7': 'bg-purple-600',
    'L': 'bg-gray-600',
    'G': 'bg-green-500',
    'J': 'bg-brown-600',
    'Z': 'bg-brown-600',
  };
  return colors[line] || 'bg-gray-600';
};

const TrainBadge = ({ line }) => (
  <div className={`${getTrainColor(line)} w-8 h-8 rounded-full flex items-center justify-center text-white font-bold`}>
    {line}
  </div>
);

const FlipChar = ({ target, onAnimationComplete }) => {
  const [current, setCurrent] = useState(' ');
  const [isFlipping, setIsFlipping] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (current !== target) {
      setIsFlipping(true);
      const interval = setInterval(() => {
        setCharIndex((prev) => {
          const nextIndex = (prev + 1) % CHARACTERS.length;
          const nextChar = CHARACTERS[nextIndex];
          setCurrent(nextChar);
          
          if (nextChar === target) {
            clearInterval(interval);
            setIsFlipping(false);
            setTimeout(() => onAnimationComplete(), 0);
            return 0;
          }
          return nextIndex;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [target, onAnimationComplete]);

  return (
    <div className={`relative min-w-[32px] w-8 h-12 bg-black overflow-hidden border border-gray-700 rounded-sm
      ${isFlipping ? 'animate-flip' : ''}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}>
      <div className="absolute w-full h-[1px] bg-gray-700 top-1/2 transform -translate-y-1/2" />
      <div className="absolute w-full h-full flex items-center justify-center text-xl font-mono text-yellow-300">
        {current}
      </div>
    </div>
  );
};

const FlipRow = ({ destination, time, trainLine, onRowComplete }) => {
  const [completedChars, setCompletedChars] = useState(0);

  const handleCharComplete = () => {
    setCompletedChars(prev => {
      const newCount = prev + 1;
      if (newCount === destination.length) {
        onRowComplete();
      }
      return newCount;
    });
  };

  return (
    <div className="flex items-center gap-4 p-2 bg-black">
      <div className="shrink-0 w-8">
        <TrainBadge line={trainLine} />
      </div>
      <div className="flex gap-1 flex-1 overflow-x-auto">
        {destination.padEnd(17, ' ').split('').map((char, index) => (
          <FlipChar
            key={index}
            target={char}
            onAnimationComplete={handleCharComplete}
          />
        ))}
      </div>
      <div className="flex gap-1 shrink-0 w-[280px]">
        {time.padStart(8, ' ').split('').map((char, index) => (
          <FlipChar
            key={`time-${index}`}
            target={char}
            onAnimationComplete={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

const SolariBoard = () => {
  const [boardData, setBoardData] = useState([
    { line: '4', destination: 'CROWN HTS UTICA', time: '2 MIN' },
    { line: '6', destination: 'PELHAM BAY PARK', time: '4 MIN' },
    { line: 'N', destination: 'ASTORIA DITMARS', time: '6 MIN' },
    { line: 'F', destination: 'CONEY ISLAND', time: '10 MIN' },
    { line: '2', destination: 'WAKEFIELD 241 ST', time: '12 MIN' },
    { line: 'A', destination: 'FAR ROCKAWAY', time: '15 MIN' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBoardData(prev => {
        const newData = [...prev];
        newData[0] = { line: '4', destination: 'CROWN HTS UTICA', time: '1 MIN' };
        newData[1] = { line: '6', destination: 'PELHAM BAY PARK', time: '3 MIN' };
        newData[2] = { line: 'N', destination: 'DELAY - SIGNAL', time: '---' };
        return newData;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto bg-black">
      <div className="p-6 rounded-lg shadow-xl w-full max-w-5xl h-screen mx-auto">
        <div className="mb-4 text-white text-2xl font-bold text-center">
          UNION SQUARE STATION
        </div>
        <div className="text-yellow-300 text-lg mb-4 text-center font-mono">
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