import { useState, useEffect, useRef } from "react"

const FLIP_DURATION = 50 // 50ms per flip
const CHAR_DELAY = 100 // 100ms delay between character changes
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 "

const useFlipAnimation = (targetChar: string) => {
  const [displayChar, setDisplayChar] = useState(targetChar)
  const [isFlipping, setIsFlipping] = useState(false)
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (targetChar !== displayChar) {
      setIsFlipping(true)
      let currentIndex = CHARS.indexOf(displayChar)
      const targetIndex = CHARS.indexOf(targetChar)

      const flipToNextChar = () => {
        currentIndex = (currentIndex + 1) % CHARS.length
        setDisplayChar(CHARS[currentIndex])

        if (currentIndex === targetIndex) {
          setIsFlipping(false)
        } else {
          flipTimeoutRef.current = setTimeout(flipToNextChar, FLIP_DURATION + CHAR_DELAY)
        }
      }

      flipTimeoutRef.current = setTimeout(flipToNextChar, FLIP_DURATION)

      return () => {
        if (flipTimeoutRef.current) {
          clearTimeout(flipTimeoutRef.current)
        }
      }
    }
  }, [targetChar, displayChar])

  return { displayChar, isFlipping }
}

export default useFlipAnimation

