'use client';
import { useEffect, useState, useRef } from "react";

interface TrainDeparture {
  time: string;
  destination: string;
  platform: string;
  status: string;
}

export default function Home() {
  const [departures, setDepartures] = useState<TrainDeparture[]>([
    { time: "09:00", destination: "London Kings Cross", platform: "1", status: "On Time" },
    { time: "09:15", destination: "Manchester Piccadilly", platform: "2", status: "Delayed" },
    { time: "09:30", destination: "Edinburgh Waverley", platform: "3", status: "On Time" },
    { time: "09:45", destination: "Liverpool Lime St", platform: "4", status: "On Time" },
    { time: "10:00", destination: "Glasgow Central", platform: "5", status: "Cancelled" },
    { time: "10:15", destination: "Bristol Temple Meads", platform: "6", status: "On Time" },
    { time: "10:30", destination: "Leeds", platform: "7", status: "Delayed" },
    { time: "10:45", destination: "Newcastle", platform: "8", status: "On Time" },
    { time: "11:00", destination: "Birmingham New St", platform: "9", status: "On Time" },
    { time: "11:15", destination: "Cardiff Central", platform: "10", status: "On Time" },
  ]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [updatingCells, setUpdatingCells] = useState<Set<string>>(new Set());

  useEffect(() => {
    audioRef.current = new Audio('/flip-sound.wav');
    audioRef.current.volume = 0.3;

    const interval = setInterval(() => {
      setDepartures(prev => {
        const newDepartures = [...prev];
        const randomIndex = Math.floor(Math.random() * newDepartures.length);
        const statuses = ["On Time", "Delayed", "Cancelled"];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }

        const cellId = `${randomIndex}-status`;
        setUpdatingCells(prev => new Set(prev).add(cellId));

        setTimeout(() => {
          setUpdatingCells(prev => {
            const newSet = new Set(prev);
            newSet.delete(cellId);
            return newSet;
          });
        }, 600);

        newDepartures[randomIndex] = {
          ...newDepartures[randomIndex],
          status: newStatus
        };
        return newDepartures;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Train Departures</h1>
        <div className="bg-black border border-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-4 text-white font-mono text-lg font-bold bg-gray-900 p-4">
            <div>TIME</div>
            <div>DESTINATION</div>
            <div>PLATFORM</div>
            <div>STATUS</div>
          </div>
          {departures.map((departure, index) => (
            <div key={index} className="grid grid-cols-4 text-white font-mono border-t border-gray-800">
              <div className="p-4 solari-cell">
                {[...departure.time].map((char, charIndex) => (
                  <span key={charIndex} className="solari-char">
                    {char}
                  </span>
                ))}
              </div>
              <div className="p-4 solari-cell">
                {[...departure.destination].map((char, charIndex) => (
                  <span key={charIndex} className="solari-char">
                    {char}
                  </span>
                ))}
              </div>
              <div className="p-4 solari-cell">
                {[...departure.platform].map((char, charIndex) => (
                  <span key={charIndex} className="solari-char">
                    {char}
                  </span>
                ))}
              </div>
              <div 
                className={`p-4 solari-cell ${
                  updatingCells.has(`${index}-status`) ? 'updating' : ''
                } ${
                  departure.status === "Delayed" ? "text-yellow-500" :
                  departure.status === "Cancelled" ? "text-red-500" : "text-green-500"
                }`}
              >
                {[...departure.status].map((char, charIndex) => (
                  <span 
                    key={charIndex} 
                    className="solari-char"
                    style={{ animationDelay: `${charIndex * 50}ms` }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
