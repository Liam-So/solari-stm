import type React from "react"
import useCharacterAnimation from "../hooks/useCharacterAnimation"

interface SolariCharacterProps {
  char: string
}

const SolariCharacter: React.FC<SolariCharacterProps> = ({ char }) => {
  const { displayChar } = useCharacterAnimation(char)

  return <div className="solari-character">{displayChar}</div>
}

export default SolariCharacter

