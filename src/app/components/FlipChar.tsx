"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";

const CHARACTERS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-'.split('');

type FlipCharProps = {
  target: string;
  onAnimationComplete: () => void
}

const FlipChar: React.FC<FlipCharProps> = ({ target, onAnimationComplete }) => {
  const [current, setCurrent] = useState(' ');
  const [, setCharIndex] = useState(0);

  useEffect(() => {
    if (current !== target) {
      const interval = setInterval(() => {
        setCharIndex((prev) => {
          const nextIndex = (prev + 1) % CHARACTERS.length;
          const nextChar = CHARACTERS[nextIndex];
          setCurrent(nextChar);
          
          if (nextChar === target) {
            clearInterval(interval);
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
    <div className={`digit relative min-w-[30px] min-h-[30px] w-8 h-10 overflow-hidden`}>
        {current}
        <div className="hinge"></div>
    </div>
  );
};

export default FlipChar;