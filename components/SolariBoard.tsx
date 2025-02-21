import type React from "react"
import SolariRow from "./SolariRow"
import "./SolariBoard.css"

interface SolariBoardProps {
  rows: string[]
}

const SolariBoard: React.FC<SolariBoardProps> = ({ rows }) => {
  const headers = "FLIGHT   DESTINATION    TIME    STATUS    "

  return (
    <div className="solari-board min-h-screen min-w-screen">
      <h1 className="solari-title">DEPARTURES</h1>
      <div className="solari-headers">
        {headers.split("").map((char, index) => (
          <span key={index} className="solari-header-char">
            {char}
          </span>
        ))}
      </div>

      {rows.map((row, index) => (
        <SolariRow key={index} text={row} />
      ))}
    </div>
  )
}

export default SolariBoard