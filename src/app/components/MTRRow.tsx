import { Train } from "../types/train";
import FlipChar from "./FlipChar";
import { memo } from "react";


const MTRRow: React.FC<Train> = memo(({ destination, time, remarks, color }) => {
  return (
    <>
      <div className="flex items-center gap-4 p-2 bg-black">

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

        <div className="flex gap-1 flex-1 overflow-x-auto no-scrollbar">
          {destination.padEnd(19, ' ').split('').map((char, index) => (
              <FlipChar
                key={index}
                target={char}
                onAnimationComplete={() => {}}
                color={color}
              />
            ))}
        </div>

        <div>
          {remarks?.split('').map((char, index) => (
            <FlipChar
              key={index}
              target={char}
              onAnimationComplete={() => {}}
            />
          ))}
        </div>

      </div>
    </>
  )
});

MTRRow.displayName = 'MTRRow';

export default MTRRow;