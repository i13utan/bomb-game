import { useState } from 'react'
import { Users, Flame, Heart, Play, Minus, Plus } from 'lucide-react'

export default function SetupScreen({ onStart }) {
  const [playerCount, setPlayerCount] = useState(4)
  const [mode, setMode] = useState('friend')

  const decrement = () => setPlayerCount(c => Math.max(2, c - 1))
  const increment = () => setPlayerCount(c => Math.min(20, c + 1))

  return (
    <div className="flex flex-col items-center justify-between h-full px-6 py-10 bg-gradient-to-b from-bomb-dark to-[#16213e]">
      {/* Title */}
      <div className="text-center animate-bounce-in">
        <h1 className="text-5xl font-black mb-2">
          <span className="text-bomb-red">AI</span>時限爆弾ゲーム
        </h1>
      </div>

      {/* Player Count */}
      <div className="w-full max-w-xs animate-slide-up">
        <div className="flex items-center justify-center gap-2 mb-4 text-gray-300">
          <Users size={20} />
          <span className="text-lg">参加人数</span>
        </div>
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={decrement}
            className="w-16 h-16 rounded-full bg-white/10 active:bg-white/20 flex items-center justify-center text-3xl font-bold transition-colors"
          >
            <Minus size={28} />
          </button>
          <span className="text-7xl font-black w-24 text-center tabular-nums">
            {playerCount}
          </span>
          <button
            onClick={increment}
            className="w-16 h-16 rounded-full bg-white/10 active:bg-white/20 flex items-center justify-center text-3xl font-bold transition-colors"
          >
            <Plus size={28} />
          </button>
        </div>
        <p className="text-center text-gray-500 mt-2 text-sm">
          制限時間: {playerCount * 15}秒
        </p>
      </div>

      {/* Mode Selection */}
      <div className="w-full max-w-xs space-y-3 animate-slide-up">
        <p className="text-center text-gray-300 mb-2">モード選択</p>
        <button
          onClick={() => setMode('friend')}
          className={`w-full py-4 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 transition-all ${
            mode === 'friend'
              ? 'bg-bomb-purple text-white shadow-lg shadow-bomb-purple/30 scale-105'
              : 'bg-white/10 text-gray-400'
          }`}
        >
          <Flame size={24} />
          友達モード
        </button>
        <button
          onClick={() => setMode('pink')}
          className={`w-full py-4 rounded-2xl text-xl font-bold flex items-center justify-center gap-3 transition-all ${
            mode === 'pink'
              ? 'bg-bomb-pink text-white shadow-lg shadow-bomb-pink/30 scale-105'
              : 'bg-white/10 text-gray-400'
          }`}
        >
          <Heart size={24} />
          ピンクモード
        </button>
      </div>

      {/* Start Button */}
      <button
        onClick={() => onStart(playerCount, mode)}
        className="w-full max-w-xs py-5 rounded-2xl bg-gradient-to-r from-bomb-red to-orange-500 text-white text-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-lg shadow-bomb-red/30"
      >
        <Play size={28} />
        ゲーム開始！
      </button>
    </div>
  )
}
