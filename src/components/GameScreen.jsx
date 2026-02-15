import { useState, useEffect, useRef, useCallback } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { getRandomQuestion } from '../data/QuestionBank'
import { speakQuestion, stopSpeech } from '../utils/speech'
import { playHeartbeat, playSuccess } from '../utils/sound'

export default function GameScreen({ playerCount, mode, onExplode }) {
  const totalTime = playerCount * 15
  const [timeLeft, setTimeLeft] = useState(totalTime)
  const [question, setQuestion] = useState('')
  const [isSpeechOn, setIsSpeechOn] = useState(true)
  const [questionKey, setQuestionKey] = useState(0)
  const heartbeatRef = useRef(null)
  const isFirstRender = useRef(true)

  // Initialize first question (runs once, safe under StrictMode)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      setQuestion(getRandomQuestion(mode))
    }
  }, [mode])

  // Speak whenever the displayed question changes
  useEffect(() => {
    if (question && isSpeechOn) {
      speakQuestion(question, mode)
    }
  }, [question])

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          stopSpeech()
          onExplode()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [onExplode])

  // Heartbeat sound — tempo accelerates continuously as time runs out
  useEffect(() => {
    clearInterval(heartbeatRef.current)

    const elapsed = totalTime - timeLeft
    const progress = elapsed / totalTime // 0 → 1

    // Urgency curve: slow ramp then rapid increase at the end
    const urgency = Math.min(1, Math.pow(progress, 1.5) * 1.2)

    // Heartbeat interval: 1200ms (calm) → 180ms (panic)
    const interval = Math.max(180, 1200 - urgency * 1020)

    playHeartbeat(urgency)

    heartbeatRef.current = setInterval(() => {
      playHeartbeat(urgency)
    }, interval)

    return () => clearInterval(heartbeatRef.current)
  }, [timeLeft, totalTime])

  const nextQuestion = useCallback(() => {
    stopSpeech()
    setQuestion(getRandomQuestion(mode))
    setQuestionKey(k => k + 1)
    playSuccess()
  }, [mode])

  const toggleSpeech = () => {
    if (isSpeechOn) {
      stopSpeech()
    }
    setIsSpeechOn(!isSpeechOn)
  }

  // Urgency phases based on remaining ratio
  const ratio = timeLeft / totalTime
  const urgency = Math.min(1, Math.pow(1 - ratio, 1.5) * 1.2)

  // Background flash speed: derived from urgency
  // No flash at start, gentle pulse in middle, rapid blink at end
  const flashClass =
    urgency > 0.85
      ? 'animate-blink-panic'
      : urgency > 0.6
      ? 'animate-blink-critical'
      : urgency > 0.3
      ? 'animate-pulse-warning'
      : ''

  // Background color shifts from calm dark → warm → red
  const bgClass =
    urgency > 0.85
      ? 'bg-gradient-to-b from-red-950 to-red-900'
      : urgency > 0.6
      ? 'bg-gradient-to-b from-red-950/80 to-amber-950'
      : urgency > 0.3
      ? 'bg-gradient-to-b from-amber-950/60 to-[#1a1a2e]'
      : 'bg-gradient-to-b from-bomb-dark to-[#16213e]'

  // Button color shifts
  const buttonColor =
    urgency > 0.85
      ? 'from-red-600 to-red-700'
      : urgency > 0.6
      ? 'from-red-600 to-amber-600'
      : urgency > 0.3
      ? 'from-yellow-600 to-amber-600'
      : 'from-emerald-600 to-green-600'

  return (
    <div className={`flex flex-col h-full transition-colors duration-1000 ${bgClass} ${flashClass}`}>
      {/* Header: Speech toggle only (no timer) */}
      <div className="flex items-center justify-end px-4 pt-4 pb-2">
        <button
          onClick={toggleSpeech}
          className="p-3 rounded-full bg-white/10 active:bg-white/20"
        >
          {isSpeechOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-6 py-4">
        <p
          key={questionKey}
          className={`text-2xl sm:text-3xl font-bold text-center leading-relaxed animate-bounce-in ${
            urgency > 0.85 ? 'animate-shake' : ''
          }`}
        >
          {question}
        </p>
      </div>

      {/* Big Next Button */}
      <div className="px-4 pb-6 flex-1 flex items-stretch">
        <button
          onClick={nextQuestion}
          className={`w-full rounded-3xl bg-gradient-to-b ${buttonColor} text-white text-3xl sm:text-4xl font-black active:scale-95 transition-all duration-500 shadow-2xl flex items-center justify-center`}
        >
          クリア！次へ
        </button>
      </div>
    </div>
  )
}
