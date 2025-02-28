import { Train } from "../types/train";
import FlipChar from "./FlipChar";
import { memo } from "react";


const MTRRow: React.FC<Train> = memo(({ destination, time, remarks, color }) => {
  return (
    <>
      <div className="flex items-center gap-4 py-2 bg-black">

        <div className="flex gap-1 md:flex-none flex-1 shrink-0 overflow-x-auto">
            {/* should we add a padStart for more space? */}
            <div className="flex gap-1">
              {time.split('').map((char, index) => (
                <FlipChar
                  key={`time-mobile-${index}`}
                  target={char}
                  onAnimationComplete={() => {}}
                />
              ))}
            </div>
        </div>

        <div className="flex gap-1 flex-1 md:flex-[2] overflow-x-auto no-scrollbar">
          {destination.padEnd(19, ' ').split('').map((char, index) => (
              <FlipChar
                key={index}
                target={char}
                onAnimationComplete={() => {}}
                color={color}
              />
            ))}
        </div>

        <div className="flex gap-1 flex-1 overflow-x-auto no-scrollbar">
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