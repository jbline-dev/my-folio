"use client"

import { useEffect, useRef } from "react"

export function StardustTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Only run on desktop/fine pointers to save mobile battery
    if (window.matchMedia("(pointer: coarse)").matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let particles: { x: number; y: number; life: number; size: number; vx: number; vy: number }[] = []
    let mouse = { x: -100, y: -100 }
    let lastMouse = { x: -100, y: -100 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const onPointerMove = (e: PointerEvent) => {
      lastMouse.x = mouse.x
      lastMouse.y = mouse.y
      mouse.x = e.clientX
      mouse.y = e.clientY

      // Calculate speed
      const dx = mouse.x - lastMouse.x
      const dy = mouse.y - lastMouse.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Spawn particles based on distance moved (cap at 8 per frame)
      const count = Math.min(distance * 0.4, 8)
      for (let i = 0; i < count; i++) {
        particles.push({
          x: mouse.x + (Math.random() - 0.5) * 15,
          y: mouse.y + (Math.random() - 0.5) * 15,
          life: 1,
          size: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.5 + dx * 0.01,
          vy: (Math.random() - 0.5) * 0.5 + dy * 0.01 - 0.2 // slight upward drift like embers
        })
      }
    }

    window.addEventListener("pointermove", onPointerMove)

    let raf: number
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life -= 0.015 // fade out speed
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }
        
        p.x += p.vx
        p.y += p.vy
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        // Blue/cyan tint for starry night feel
        ctx.fillStyle = `rgba(180, 220, 255, ${p.life * 0.8})`
        ctx.fill()
        
        // Add a soft glow to some particles
        if (p.size > 1.2) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(180, 220, 255, ${p.life * 0.1})`
          ctx.fill()
        }
      }
      
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onPointerMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="pointer-events-none absolute inset-0 z-20 h-full w-full mix-blend-screen"
    />
  )
}
