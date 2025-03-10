import { memo } from "react";
import TrainBadge from "./TrainBadge";
import FlipChar from "./FlipChar";
import { Train } from "../types/train";

const SubwayRow: React.FC<Train> = memo(({ destination, line, time, color }) => {
  return (
    <div className="flex items-center gap-4 p-2 bg-black">
      <div className="shrink-0 w-8">
        <TrainBadge line={line || ""} color={color || ""} />
      </div>

      <div className="flex gap-1 flex-1 overflow-x-auto no-scrollbar px-1">
          {destination.padEnd(20, ' ').split('').map((char, index) => (
              <FlipChar
                key={index}
                target={char}
                onAnimationComplete={() => {}}
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
  )
});

SubwayRow.displayName = 'SubwayRow'

export default SubwayRow;