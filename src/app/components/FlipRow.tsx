import TrainBadge from "./TrainBadge";
import FlapDisplay from './FlapDisplay';
import {Presets} from './Presets';
import { useBreakpointValue } from '../hooks/useBreakpointValue';
import { memo, useEffect } from 'react';

type FlipRowProps = {
  destination: string;
  time: string;
  trainLine: string;
  onRowComplete: () => void;
  playAudio: () => void;
}

// Wrap FlipRow with React.memo and add proper comparison function
const FlipRow: React.FC<FlipRowProps> = memo(
  ({ destination, time, trainLine, playAudio }) => {
    const displayLength = useBreakpointValue({ base: 6, md: 20 });
    const minLength = useBreakpointValue({ base: 2, md: 6 })

    // Add useEffect to trigger audio when props change
    useEffect(() => {
      playAudio();
    }, [destination, time, trainLine, playAudio]);

    return (
      <div className="flex justify-center items-center gap-4 p-2 bg-black">
        <div className="shrink-0 w-8">
          <TrainBadge line={trainLine} />
        </div>
        <div className="flex gap-1 flex-1 overflow-x-auto no-scrollbar">
          <FlapDisplay
            id="destination-display"
            className=""
            css={{}}
            words={[]}
            render={undefined} 
            value={destination}
            chars={Presets.ALPHANUM}
            padChar={' '}
            padMode={'auto'}
            hinge={true}
            length={displayLength}
            timing={30}
          />
        </div>

        <div className="flex gap-1 shrink-0">
          <FlapDisplay
            id="time-display"
            className=""
            css={{}}
            words={[]}
            render={undefined}
            value={time}
            chars={Presets.ALPHANUM}
            padChar={' '}
            padMode={'start'}
            hinge={true}
            timing={30}
            length={minLength}
          />
        </div>

      </div>
    );
  },
  // Update comparison function to trigger re-render and audio when props change
  (prevProps, nextProps) => {
    const shouldNotUpdate = 
      prevProps.destination === nextProps.destination &&
      prevProps.time === nextProps.time &&
      prevProps.trainLine === nextProps.trainLine;
    
    return shouldNotUpdate;
  }
);

FlipRow.displayName = "FlipRow";

export default FlipRow;