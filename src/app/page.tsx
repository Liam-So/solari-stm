"use client"

import { useState, useEffect } from "react"
import SolariBoard from "../../components/SolariBoard"

const flights = [
  { flight: "AA123", destination: "NEW YORK", time: "09:00", status: "ON TIME" },
  { flight: "BA456", destination: "LONDON", time: "10:30", status: "DELAYED" },
  { flight: "JL789", destination: "TOKYO", time: "12:15", status: "BOARDING" },
  { flight: "AF101", destination: "PARIS", time: "14:45", status: "ON TIME" },
  { flight: "QF202", destination: "SYDNEY", time: "18:00", status: "CANCELLED" },
  { flight: "LH303", destination: "BERLIN", time: "20:30", status: "ON TIME" },
  { flight: "EK404", destination: "DUBAI", time: "22:00", status: "DELAYED" },
  { flight: "SQ505", destination: "SINGAPORE", time: "23:45", status: "ON TIME" },
]

const NUM_ROWS = 5

const padRight = (str: string, length: number) => str.padEnd(length, " ")

export default function Home() {
  const [displayedFlights, setDisplayedFlights] = useState(flights.slice(0, NUM_ROWS))

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDisplayedFlights((prevFlights) => {
        const newFlights = [...prevFlights]
        newFlights.shift()
        const nextFlight = flights[(flights.indexOf(newFlights[newFlights.length - 1]) + 1) % flights.length]
        newFlights.push(nextFlight)
        return newFlights
      })
    }, 7000) // Rotate every 3 seconds

    return () => clearInterval(intervalId)
  }, [])

  const formattedFlights = displayedFlights.map(
    (flight) =>
      `${padRight(flight.flight, 8)}${padRight(flight.destination, 16)}${padRight(flight.time, 8)}${padRight(flight.status, 10)}`,
  )

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SolariBoard rows={formattedFlights} />
    </div>
  )
}
