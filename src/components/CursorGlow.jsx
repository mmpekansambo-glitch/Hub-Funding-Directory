import { useEffect, useRef } from 'react'

// A soft gradient ball that trails the mouse. Off on touch screens and for people who prefer reduced motion.
export default function CursorGlow() {
  const ref = useRef(null)
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = ref.current
    if (!fine || calm || !el) return
    let x = -500, y = -500, cx = x, cy = y, raf = 0
    const move = (e) => {
      x = e.clientX
      y = e.clientY
      el.style.opacity = '1'
    }
    const leave = () => { el.style.opacity = '0' }
    const tick = () => {
      cx += (x - cx) * 0.18
      cy += (y - cy) * 0.18
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', leave)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(raf)
    }
  }, [])
  return <div ref={ref} className="cursor-glow" aria-hidden="true" />
}
