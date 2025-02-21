import FlipChar from "./FlipChar";
import TrainBadge from "./TrainBadge";
import { useState } from "react";

type FlipRowProps = {
  destination: string;
  time: string;
  trainLine: string;
  onRowComplete: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FlipRow: React.FC<FlipRowProps> = ({ destination, time, trainLine, onRowComplete }) => {
  const [, setCompletedChars] = useState(0);

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
      <div className="flex gap-1 flex-1 overflow-x-auto no-scrollbar">
        {destination.padEnd(19, ' ').split('').map((char, index) => (
            <FlipChar
              key={index}
              target={char}
              onAnimationComplete={handleCharComplete}
            />
          ))}
      </div>

      <div className="flex gap-1 shrink-0">
        {/* should we add a padStart for more space? */}
        <div className="flex gap-1">
          {time.slice(0, 2).split('').map((char, index) => (
            <FlipChar
              key={`time-mobile-${index}`}
              target={char}
              onAnimationComplete={() => {}}
            />
          ))}
        </div>
        <div className="hidden sm:flex gap-1">
          {time.slice(2).split('').map((char, index) => (
            <FlipChar
              key={`time-desktop-${index}`}
              target={char}
              onAnimationComplete={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlipRow;