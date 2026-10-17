// Détecte les machines où les animations lourdes (WebGL, flous) ne seront pas fluides :
// rendu logiciel (pas d'accélération GPU, fréquent sur les PC Linux d'université),
// préférence "réduire les animations", ou CPU très faible.
// Forçage possible via l'URL : ?lite ou ?full
function detectLowPerf() {
  if (typeof window === 'undefined') return true

  const params = new URLSearchParams(window.location.search)
  if (params.has('full')) return false
  if (params.has('lite')) return true

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return true
  if ((navigator.hardwareConcurrency || 4) <= 2) return true

  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true })
    if (!gl) return true
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : ''
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)) return true
  } catch {
    return true
  }

  return false
}

export const LOW_PERF = detectLowPerf()
