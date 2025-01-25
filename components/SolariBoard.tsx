import type React from "react";
import { useState, useEffect } from "react";
import SolariFlap from "./SolariFlap";

interface Departure {
  time: string;
  destination: string;
  platform: string;
  status: string;
}

interface SolariBoardProps {
  departures: Departure[];
}

const SolariBoard: React.FC<SolariBoardProps> = ({ departures }) => {
  const [displayDepartures, setDisplayDepartures] = useState<Departure[]>(
    Array(10).fill({
      time: "     ",
      destination: "                    ",
      platform: "  ",
      status: "        ",
    })
  );

  const [flipping, setFlipping] = useState<boolean[][]>(
    Array(10)
      .fill([])
      .map(() => Array(40).fill(false))
  );

  useEffect(() => {
    departures.forEach((departure, rowIndex) => {
      const newFlipping = [...flipping];
      const currentRow = displayDepartures[rowIndex];

      // Check each character in each field
      const rowText = `${departure.time}${departure.destination.padEnd(20)}${departure.platform.padEnd(2)}${departure.status.padEnd(8)}`;
      const currentText = `${currentRow.time}${currentRow.destination.padEnd(20)}${currentRow.platform.padEnd(2)}${currentRow.status.padEnd(8)}`;

      for (let i = 0; i < rowText.length; i++) {
        if (rowText[i] !== currentText[i]) {
          newFlipping[rowIndex][i] = true;
        }
      }

      setFlipping(newFlipping);
    });
    setDisplayDepartures(departures);
  }, [departures]);

  return (
    <div className="p-8 max-w-screen-lg mx-auto font-mono font-bold">
      {/* Header row */}
      <div className="mb-6 grid grid-cols-4 gap-8 text-white">
        <div className="flex">TIME</div>
        <div className="flex">DESTINATION</div>
        <div className="flex">PLATFORM</div>
        <div className="flex">STATUS</div>
      </div>

      {/* Departure rows */}
      <div className="space-y-4">
        {displayDepartures.map((departure, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-8">
              {/* <p>{departure.time}</p>
              <p>{departure.destination}</p>
              <p>{departure.platform}</p>
              <p>{departure.status}</p> */}
            

            {/* Time Column */}
            <div className="pl-2">
              <div className="flex gap-[2px]">
                {departure.time.split("").map((char, index) => (
                  <SolariFlap 
                    key={`time-${index}`} 
                    char={char} 
                    isFlipping={flipping[rowIndex][index]} 
                  />
                ))}
              </div>
            </div>
            
            {/* Destination Column */}
            <div className="pl-2">
              <div className="flex gap-[2px]">
                {departure.destination.padEnd(20).split("").map((char, index) => (
                  <SolariFlap 
                    key={`dest-${index}`} 
                    char={char} 
                    isFlipping={flipping[rowIndex][index + 5]} 
                  />
                ))}
              </div>
            </div>
            
            {/* Platform Column */}
            <div className="pl-2">
              <div className="flex gap-[2px]">
                {departure.platform.padEnd(2).split("").map((char, index) => (
                  <SolariFlap 
                    key={`plat-${index}`} 
                    char={char} 
                    isFlipping={flipping[rowIndex][index + 25]} 
                  />
                ))}
              </div>
            </div>
            
            {/* Status Column */}
            <div className="pl-2">
              <div className="flex gap-[2px]">
                {departure.status.padEnd(8).split("").map((char, index) => (
                  <SolariFlap 
                    key={`status-${index}`} 
                    char={char} 
                    isFlipping={flipping[rowIndex][index + 27]} 
                  />
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default SolariBoard;
