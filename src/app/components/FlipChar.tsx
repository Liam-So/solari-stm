"use client";
import { useState, useEffect } from "react";

const CHARACTERS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-'.split('');

type FlipCharProps = {
  target: string;
  onAnimationComplete: () => void
}

const FlipChar: React.FC<FlipCharProps> = ({ target, onAnimationComplete }) => {
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
      }, 30); // adjust this to play with duration of flipping
      return () => clearInterval(interval);
    }
  }, [target, onAnimationComplete]);

  return (
    <div className={`relative min-w-[32px] w-8 h-10 bg-gray-900 overflow-hidden border border-gray-700 rounded-sm
      ${isFlipping ? '' : ''}`} // remove animate-flip if you want to remove
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}>
      <div className="absolute w-full h-[1px] bg-gray-700 top-1/2 transform -translate-y-1/2" />
      <div className="absolute w-full h-full flex items-center justify-center text-2xl font-mono text-yellow-300">
        {current}
      </div>
    </div>
  );
};

export default FlipChar;