import { memo } from "react";
import TrainBadge from "./TrainBadge";
import FlipChar from "./FlipChar";

type SubwayRowProps = {
  time: string;
  destination: string;
  trainLine: string;
  color: string;
}

const SubwayRow: React.FC<SubwayRowProps> = memo(({ destination, trainLine, time, color }) => {
  return (
    <div className="flex items-center gap-4 p-2 bg-black">
      <div className="shrink-0 w-8">
        <TrainBadge line={trainLine} color={color} />
      </div>

      <div className="flex gap-1 flex-1 overflow-x-auto no-scrollbar">
          {destination.padEnd(19, ' ').split('').map((char, index) => (
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