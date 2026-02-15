import { useState, useCallback, useEffect } from 'react'
import SetupScreen from './components/SetupScreen'
import GameScreen from './components/GameScreen'
import ExplosionScreen from './components/ExplosionScreen'
import { resetQuestions } from './data/QuestionBank'
import { unlockAudio } from './utils/sound'

function App() {
  const [screen, setScreen] = useState('setup') // 'setup' | 'game' | 'explosion'
  const [playerCount, setPlayerCount] = useState(4)
  const [mode, setMode] = useState('friend')

  // Prevent back gesture from leaving the app
  useEffect(() => {
    // Push an initial dummy entry so there's always somewhere to "go back" to
    history.pushState({ screen: 'app' }, '')

    const handlePopState = () => {
      // Re-push so the user can never actually navigate away
      history.pushState({ screen: 'app' }, '')
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleStart = useCallback((count, selectedMode) => {
    // Unlock iOS audio/speech on user gesture
    unlockAudio()

    setPlayerCount(count)
    setMode(selectedMode)
    resetQuestions()
    setScreen('game')
  }, [])

  const handleExplode = useCallback(() => {
    setScreen('explosion')
  }, [])

  const handleRestart = useCallback(() => {
    setScreen('game')
  }, [])

  const handleHome = useCallback(() => {
    setScreen('setup')
  }, [])

  return (
    <div className="w-full h-full">
      {screen === 'setup' && (
        <SetupScreen onStart={handleStart} />
      )}
      {screen === 'game' && (
        <GameScreen
          key={Date.now()}
          playerCount={playerCount}
          mode={mode}
          onExplode={handleExplode}
        />
      )}
      {screen === 'explosion' && (
        <ExplosionScreen onRestart={handleRestart} onHome={handleHome} />
      )}
    </div>
  )
}

export default App
