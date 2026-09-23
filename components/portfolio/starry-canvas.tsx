"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

/**
 * "Starry Night" static background image.
 * Uses a slightly scaled-up wrapper with a gentle floating animation and subtle cursor parallax
 * to replicate the ambient, slow-moving feel of the original canvas.
 */
export function StarryCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0
    let time = 0

    const onPointerMove = (e: PointerEvent) => {
      // Normalize pointer position from -1 to 1
      targetX = (e.clientX / window.innerWidth) * 2 - 1
      targetY = (e.clientY / window.innerHeight) * 2 - 1
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })

    let raf: number
    const loop = () => {
      time += 0.002 // Ambient time scale
      
      // Smoothly interpolate the current mouse position towards the target position
      mouseX += (targetX - mouseX) * 0.04
      mouseY += (targetY - mouseY) * 0.04

      // Calculate an ambient drifting offset using sine waves
      const ambientX = Math.sin(time) * 1.5
      const ambientY = Math.cos(time * 0.8) * 1.5
      
      // Combine parallax and ambient offsets (values in percentages)
      const tx = mouseX * 2 + ambientX
      const ty = mouseY * 2 + ambientY

      // Apply transform. The image is scaled up slightly (1.08) so edges don't show when translating.
      container.style.transform = `translate(${tx}%, ${ty}%) scale(1.08)`
      
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="starry-canvas pointer-events-none absolute inset-0 overflow-hidden h-full w-full">
      <div 
        ref={containerRef} 
        className="absolute inset-0 h-full w-full will-change-transform"
        style={{ transform: "scale(1.08)" }}
      >
        <Image
          src="/starry-night-bg.png"
          alt="Starry Night Background (Dark)"
          fill
          priority
          className="starry-canvas-dark object-cover opacity-80 transition-opacity duration-700"
        />
        <Image
          src="/starry-night-light.jpg"
          alt="Starry Night Background (Light)"
          fill
          priority
          className="starry-canvas-light object-cover opacity-80 transition-opacity duration-700"
        />
      </div>
    </div>
  )
}
