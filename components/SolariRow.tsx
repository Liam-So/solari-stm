import type React from "react"
import SolariCharacter from "./SolariCharacter"

interface SolariRowProps {
  text: string
}

const SolariRow: React.FC<SolariRowProps> = ({ text }) => {
  return (
    <div className="solari-row">
      {text.split("").map((char, index) => (
        <SolariCharacter key={index} char={char} />
      ))}
    </div>
  )
}

export default SolariRow

