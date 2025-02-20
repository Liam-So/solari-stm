import TrainBadge from "./TrainBadge";
import FlapDisplay from './FlapDisplay';
import {Presets} from './Presets';
import { useBreakpointValue } from '../hooks/useBreakpointValue';

type FlipRowProps = {
  destination: string;
  time: string;
  trainLine: string;
  onRowComplete: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FlipRow: React.FC<FlipRowProps> = ({ destination, time, trainLine, onRowComplete = () => {} }) => {
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
};

export default FlipRow;