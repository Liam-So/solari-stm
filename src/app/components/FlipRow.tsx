import TrainBadge from "./TrainBadge";
import FlapDisplay from './FlapDisplay';
import {Presets} from './Presets';
import { useBreakpointValue } from '../hooks/useBreakpointValue';
import React from 'react';

type FlipRowProps = {
  destination: string;
  time: string;
  trainLine: string;
  onRowComplete: () => void;
}

// Wrap FlipRow with React.memo and add proper comparison function
const FlipRow: React.FC<FlipRowProps> = React.memo(
  ({ destination, time, trainLine, onRowComplete = () => {} }) => {
    const displayLength = useBreakpointValue({ base: 7, md: 20 });
    const minLength = useBreakpointValue({ base: 2, md: 6 })

    return (
      <div className="flex items-center gap-4 p-2 bg-black">
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
  // Custom comparison function to determine if re-render is needed
  (prevProps, nextProps) => {
    return (
      prevProps.destination === nextProps.destination &&
      prevProps.time === nextProps.time &&
      prevProps.trainLine === nextProps.trainLine
    );
  }
);

export default FlipRow;