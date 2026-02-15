// Each call to speakQuestion gets a unique ID.
// When stopSpeech or a new speakQuestion is called, the old ID is invalidated
// so lingering setTimeouts from the previous call become no-ops.
let currentSessionId = 0

// Mode presets for voice personality
const modePresets = {
  friend: { rate: 1.15, pitch: 1.1 },  // Fast, provocative
  pink:   { rate: 0.88, pitch: 0.85 },  // Slow, sultry
}

/**
 * Insert natural pauses by splitting on punctuation
 * and speaking each segment sequentially with timed gaps.
 */
export function speakQuestion(text, mode = 'friend') {
  if (!('speechSynthesis' in window)) return

  // Invalidate any in-flight timeouts from a previous call
  const sessionId = ++currentSessionId

  window.speechSynthesis.cancel()

  const preset = modePresets[mode] || modePresets.friend

  // Split text into segments at punctuation, keeping the delimiter
  const segments = text.match(/[^。、！？!?,，.]+[。、！？!?,，.]?/g) || [text]

  let delay = 0

  segments.forEach((segment) => {
    const trimmed = segment.trim()
    if (!trimmed) return

    setTimeout(() => {
      // Bail out if a newer speakQuestion call has since been made
      if (sessionId !== currentSessionId) return

      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(trimmed)
      utterance.lang = 'ja-JP'
      utterance.volume = 1.0

      // Apply mode-specific voice
      utterance.rate = preset.rate

      // Slight pitch variation per segment for natural feel
      const pitchWobble = (Math.random() - 0.5) * 0.15
      utterance.pitch = Math.max(0.5, Math.min(2.0, preset.pitch + pitchWobble))

      // Try to use a Japanese voice
      const voices = window.speechSynthesis.getVoices()
      const jaVoice = voices.find(v => v.lang.startsWith('ja'))
      if (jaVoice) {
        utterance.voice = jaVoice
      }

      window.speechSynthesis.speak(utterance)
    }, delay)

    // Calculate pause length based on ending punctuation
    const lastChar = trimmed.slice(-1)
    let pauseMs = 100
    if (lastChar === '。' || lastChar === '.') pauseMs = 500
    else if (lastChar === '、' || lastChar === ',' || lastChar === '，') pauseMs = 350
    else if (lastChar === '？' || lastChar === '?') pauseMs = 450
    else if (lastChar === '！' || lastChar === '!') pauseMs = 400

    // Pink mode gets longer pauses for dramatic effect
    if (mode === 'pink') pauseMs = Math.round(pauseMs * 1.3)

    // Estimate segment speaking duration (rough: chars * ms-per-char / rate)
    const speakDuration = (trimmed.length * 150) / preset.rate
    delay += speakDuration + pauseMs
  })
}

export function stopSpeech() {
  // Invalidate all pending setTimeout callbacks
  currentSessionId++

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}
