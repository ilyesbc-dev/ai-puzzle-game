const BASE = '/api'

async function request(path, options) {
  const res = await fetch(`${BASE}${path}`, options)

  if (!res.ok) {
    const text = await res.text()
    let msg = text

    try {
      const j = JSON.parse(text)
      msg = j.detail || j.message || text
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(msg || `HTTP ${res.status}`)
  }

  return res.json()
}

export const api = {
  health: () => request('/health'),

  detect: async (blob) => {
    const form = new FormData()
    form.append('file', blob, 'frame.jpg')

    return request('/detect', {
      method: 'POST',
      body: form,
    })
  },

  createPuzzle: (image, difficulty) =>
    request('/puzzle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, difficulty }),
    }),

  demoImage: () => request('/demo-image'),

  submitScore: (nickname, difficulty, score, time_seconds) =>
    request('/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, difficulty, score, time_seconds }),
    }),

  leaderboard: (limit = 5) =>
    request(`/leaderboard?limit=${limit}`),

  cleanup: () => request('/cleanup', { method: 'DELETE' }),
}