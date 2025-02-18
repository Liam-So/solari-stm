const getTrainColor = (line: string): string => {
  const colors: Record<string, string> = {
    'A': 'bg-blue-600',
    'C': 'bg-blue-600',
    'E': 'bg-blue-600',
    'B': 'bg-orange-600',
    'D': 'bg-orange-600',
    'F': 'bg-orange-600',
    'M': 'bg-orange-600',
    'N': 'bg-yellow-500',
    'Q': 'bg-yellow-500',
    'R': 'bg-yellow-500',
    'W': 'bg-yellow-500',
    '1': 'bg-red-600',
    '2': 'bg-red-600',
    '3': 'bg-red-600',
    '4': 'bg-green-600',
    '5': 'bg-green-600',
    '6': 'bg-green-600',
    '7': 'bg-purple-600',
    '7X': 'bg-purple-600', // should this be a diamond?
    'L': 'bg-gray-600',
    'G': 'bg-green-500',
    'J': 'bg-brown-600',
    'Z': 'bg-brown-600',
  };
  return colors[line] || 'bg-gray-600';
};

type TrainBadgeProps = {
  line: string;
}

const TrainBadge: React.FC<TrainBadgeProps> = ({ line }) => (
  <div className={`${getTrainColor(line)} w-8 h-8 rounded-full flex items-center justify-center text-white font-bold`}>
    {line}
  </div>
);

export default TrainBadge;