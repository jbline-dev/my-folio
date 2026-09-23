"use client"

import { useEffect, useState } from "react"

export function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isActive, setIsActive] = useState(false)
  
  useEffect(() => {
    // Hide default cursor globally
    document.documentElement.style.cursor = 'none'

    const onPointerMove = (e: PointerEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      
      // Check if hovering over a clickable element
      const target = e.target as HTMLElement
      const clickable = target.closest('a, button, [role="button"], input, select, textarea, [data-interactive]') !== null
      
      // Don't show custom cursor on text selection areas if we want native text cursor
      // but for this ethereal theme, we'll override it everywhere.
      setIsHovering(clickable)
    }
    
    const onPointerDown = () => setIsActive(true)
    const onPointerUp = () => setIsActive(false)

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      document.documentElement.style.cursor = 'auto'
    }
  }, [])

  // Hide on mobile (coarse pointer)
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null
  }

  return (
    <div 
      className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference transition-transform duration-75 ease-out will-change-transform"
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
    >
      {/* Outer Halo */}
      <div 
        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-300 ease-out ${
          isHovering ? 'h-10 w-10 opacity-30 blur-[2px]' : 'h-4 w-4 opacity-70'
        } ${isActive ? 'scale-90 opacity-50' : ''}`}
      />
      
      {/* Inner Core */}
      <div 
        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-300 ease-out ${
          isHovering ? 'h-2 w-2 opacity-100' : 'h-1 w-1 opacity-100'
        }`}
      />
    </div>
  )
}
