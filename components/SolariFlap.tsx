import type React from "react"
import { useState, useEffect } from "react"
import { soundEffect } from "../utils/soundEffects"

interface SolariFlapProps {
  char: string
  isFlipping: boolean
}

const SolariFlap: React.FC<SolariFlapProps> = ({ char, isFlipping }) => {
  const [displayChar, setDisplayChar] = useState(" ")

  useEffect(() => {
    if (isFlipping) {
      const interval = setInterval(() => {
        setDisplayChar((prev) => {
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 "
          const newChar = chars[Math.floor(Math.random() * chars.length)]
          soundEffect.playFlipSound()
          return newChar
        })
      }, 50)

      setTimeout(() => {
        clearInterval(interval)
        setDisplayChar(char.toUpperCase())
        soundEffect.playFlipSound(0.2)
      }, 500)

      return () => clearInterval(interval)
    }
  }, [char, isFlipping])

  return (
    <div className="w-6 h-8 bg-gray-900 text-white flex items-center justify-center text-lg font-mono font-bold overflow-hidden perspective-500 border border-gray-800">
      <div
        className={`w-full h-full flex items-center justify-center transition-transform duration-100 ${isFlipping ? "animate-flip" : ""}`}
      >
        {displayChar}
      </div>
    </div>
  )
}

export default SolariFlap

