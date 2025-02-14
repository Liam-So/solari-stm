import { useState, useEffect, useRef } from "react"

const CHAR_CHANGE_INTERVAL = 100 // 100ms between character changes
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 "

const useCharacterAnimation = (targetChar: string) => {
  const [displayChar, setDisplayChar] = useState(targetChar)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // useEffect(() => {
  //   if (!audioRef.current) {
  //     audioRef.current = new Audio("/flip-sound.wav") // Make sure to add this sound file to your public folder
  //   }
  // }, [])

  useEffect(() => {
    if (targetChar !== displayChar) {
      let currentIndex = CHARS.indexOf(displayChar)
      const targetIndex = CHARS.indexOf(targetChar)

      const changeToNextChar = () => {
        currentIndex = (currentIndex + 1) % CHARS.length
        setDisplayChar(CHARS[currentIndex])

        if (audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.play()
        }

        if (currentIndex === targetIndex) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
        }
      }

      intervalRef.current = setInterval(changeToNextChar, CHAR_CHANGE_INTERVAL)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [targetChar, displayChar])

  return { displayChar }
}

export default useCharacterAnimation

