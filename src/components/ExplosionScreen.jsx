import { useEffect, useState, useMemo } from 'react'
import { RotateCcw, Home } from 'lucide-react'
import { playExplosion } from '../utils/sound'

const EMOJIS = ['💥', '🔥', '💣', '😱', '🤯', '⚡', '💀', '🎆']

function Particle({ emoji, delay, angle, distance }) {
  return (
    <div
      className="absolute text-4xl sm:text-5xl animate-particle pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%)`,
        animationDelay: `${delay}ms`,
        '--tw-translate-x': `${Math.cos(angle) * distance}px`,
        '--tw-translate-y': `${Math.sin(angle) * distance}px`,
        animationName: 'particle-fly-custom',
      }}
    >
      <style>{`
        @keyframes particle-fly-custom {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(
            calc(-50% + ${Math.cos(angle) * distance}px),
            calc(-50% + ${Math.sin(angle) * distance}px)
          ) scale(0.3); opacity: 0; }
        }
      `}</style>
      <div style={{ animation: `particle-fly-custom 1.5s ${delay}ms ease-out forwards` }}>
        {emoji}
      </div>
    </div>
  )
}

export default function ExplosionScreen({ onRestart, onHome }) {
  const [showContent, setShowContent] = useState(false)

  const particles = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      emoji: EMOJIS[i % EMOJIS.length],
      delay: Math.random() * 300,
      angle: (i / 16) * Math.PI * 2 + (Math.random() - 0.5) * 0.5,
      distance: 120 + Math.random() * 100,
    })),
  [])

  useEffect(() => {
    playExplosion()
    const timer = setTimeout(() => setShowContent(true), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-red-950 to-bomb-dark relative overflow-hidden">
      {/* Explosion flash */}
      <div className="absolute inset-0 bg-orange-500 animate-explosion pointer-events-none" />

      {/* Particles */}
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* Main content */}
      {showContent && (
        <div className="relative z-10 flex flex-col items-center gap-8 animate-bounce-in">
          <div className="text-center">
            <p className="text-8xl mb-4">💣</p>
            <h1 className="text-6xl font-black text-bomb-red mb-2">ドカン！</h1>
            <p className="text-2xl text-gray-300">爆発した人は罰ゲーム！</p>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-xs px-4">
            <button
              onClick={onRestart}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-bomb-red to-orange-500 text-white text-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-lg"
            >
              <RotateCcw size={24} />
              もう一回！
            </button>
            <button
              onClick={onHome}
              className="w-full py-4 rounded-2xl bg-white/10 text-white text-lg font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <Home size={20} />
              設定に戻る
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
