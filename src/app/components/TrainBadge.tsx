type TrainBadgeProps = {
  line: string;
  color: string;
}

const TrainBadge: React.FC<TrainBadgeProps> = ({ line, color }) => (
  <div 
    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold`}
    style={{backgroundColor: color}}
    >
    {line}
  </div>
);

export default TrainBadge;