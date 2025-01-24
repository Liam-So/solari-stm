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
    <div className="bg-black p-8">
      {/* Header row */}
      <div className="mb-6 grid w-full" 
           style={{ 
             display: "grid",
             gridTemplateColumns: "100px 300px 100px 120px",
             gap: "2rem"
           }}>
        <div>TIME</div>
        <div>DESTINATION</div>
        <div>PLATFORM</div>
        <div>STATUS</div>
      </div>

      {/* Departure rows */}
      <div className="space-y-4">
        {displayDepartures.map((departure, rowIndex) => (
          <div key={rowIndex} 
               className="w-full"
               style={{ 
                 display: "grid",
                 gridTemplateColumns: "100px 300px 100px 120px",
                 gap: "2rem"
               }}>
            {/* Time */}
            <div className="flex gap-[2px]">
              {departure.time.split("").map((char, index) => (
                <SolariFlap 
                  key={`time-${index}`} 
                  char={char} 
                  isFlipping={flipping[rowIndex][index]} 
                />
              ))}
            </div>
            
            {/* Destination */}
            <div className="flex gap-[2px]">
              {departure.destination.padEnd(20).split("").map((char, index) => (
                <SolariFlap 
                  key={`dest-${index}`} 
                  char={char} 
                  isFlipping={flipping[rowIndex][index + 5]} 
                />
              ))}
            </div>
            
            {/* Platform */}
            <div className="flex gap-[2px]">
              {departure.platform.padEnd(2).split("").map((char, index) => (
                <SolariFlap 
                  key={`plat-${index}`} 
                  char={char} 
                  isFlipping={flipping[rowIndex][index + 25]} 
                />
              ))}
            </div>
            
            {/* Status */}
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
        ))}
      </div>
    </div>
  );
};

export default SolariBoard;
