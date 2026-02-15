let audioCtx = null

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * Unlock iOS audio + speech restrictions.
 * Must be called from a user gesture (tap/click) handler.
 */
export function unlockAudio() {
  // Unlock Web Audio API
  try {
    const ctx = getAudioContext()
    const buf = ctx.createBuffer(1, 1, 22050)
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.connect(ctx.destination)
    src.start(0)
  } catch (e) { /* ignore */ }

  // Unlock SpeechSynthesis
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance('')
    utterance.volume = 0
    utterance.lang = 'ja-JP'
    window.speechSynthesis.speak(utterance)
  }
}

/**
 * Play a heartbeat-like sound.
 * urgency: 0.0 (calm) → 1.0 (panic)
 */
export function playHeartbeat(urgency) {
  try {
    const ctx = getAudioContext()

    // Double-thump heartbeat: "lub-dub"
    const baseFreq = 40 + urgency * 40   // 40Hz calm → 80Hz panic
    const volume = 0.15 + urgency * 0.45  // louder as panic rises
    const decay = 0.15 - urgency * 0.07   // shorter decay when urgent

    // First thump ("lub")
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime)
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, ctx.currentTime + decay)
    gain1.gain.setValueAtTime(volume, ctx.currentTime)
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + decay)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(ctx.currentTime)
    osc1.stop(ctx.currentTime + decay)

    // Second thump ("dub") — slightly delayed, slightly higher
    const dubDelay = 0.1 - urgency * 0.04  // tighter gap when urgent
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(baseFreq * 1.3, ctx.currentTime + dubDelay)
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, ctx.currentTime + dubDelay + decay * 0.8)
    gain2.gain.setValueAtTime(0.001, ctx.currentTime)
    gain2.gain.setValueAtTime(volume * 0.7, ctx.currentTime + dubDelay)
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dubDelay + decay * 0.8)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(ctx.currentTime)
    osc2.stop(ctx.currentTime + dubDelay + decay * 0.8)
  } catch (e) {
    // Audio not available
  }
}

export function playExplosion() {
  try {
    const ctx = getAudioContext()
    const duration = 0.8

    // Noise burst for explosion
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15))
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    // Low-pass filter for rumble
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 400

    const gainNode = ctx.createGain()
    gainNode.gain.setValueAtTime(1.0, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    noise.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    noise.start(ctx.currentTime)
    noise.stop(ctx.currentTime + duration)

    // Sub-bass impact
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(80, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.5)
    oscGain.gain.setValueAtTime(0.8, ctx.currentTime)
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)

    osc.connect(oscGain)
    oscGain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.5)
  } catch (e) {
    // Audio not available
  }
}

export function playSuccess() {
  try {
    const ctx = getAudioContext()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(523, ctx.currentTime)
    oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.1)

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.2)
  } catch (e) {
    // Audio not available
  }
}
