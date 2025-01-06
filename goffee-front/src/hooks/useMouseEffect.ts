/* 自定义鼠标特效 */
import { useEventListener } from '@vueuse/core'
import anime from 'animejs/lib/anime.es.js'

interface EventParam {
  x: number
  y: number
  color: string
  radius: number
  endPos: {
    x: number
    y: number
  }
  draw: () => void
}

export const useMouseEffect = () => {
  const fireworks = [
    'rgba(255,182,185,.9)',
    'rgba(250,227,217,.9)',
    'rgba(187,222,214,.9)',
    'rgba(138,198,209,.9)'
  ]
  const we = document.createElement('canvas')
  we.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9999999'
  document.body.appendChild(we)
  const Ce = we.getContext('2d') as CanvasRenderingContext2D
  const xe = 30
  let ke = 0
  let Le = 0
  const Ee = 'click'
  const Te = fireworks
  const Me = () => {
    we.width = window.innerWidth * 2
    we.height = window.innerHeight * 2
    we.style.width = window.innerWidth + 'px'
    we.style.height = window.innerHeight + 'px'
    we.getContext('2d')!.scale(2, 2)
  }
  const Ne = (e: MouseEvent | TouchEvent) => {
    ke =
      (e as MouseEvent).clientX ||
      ((e as TouchEvent).touches && (e as TouchEvent).touches[0].clientX)
    Le =
      (e as MouseEvent).clientY ||
      ((e as TouchEvent).touches && (e as TouchEvent).touches[0].clientY)
  }
  const Oe = (e: EventParam) => {
    const t = (anime.random(0, 360) * Math.PI) / 180
    const a = anime.random(50, 180)
    const n = [-1, 1][anime.random(0, 1)] * a
    return {
      x: e.x + n * Math.cos(t),
      y: e.y + n * Math.sin(t)
    }
  }
  const je = (e: number, t: number) => {
    const a = {
      x: 0,
      y: 0,
      color: '#fff',
      radius: 0,
      endPos: {
        x: 0,
        y: 0
      },
      draw: () => {}
    }
    a.x = e
    a.y = t
    a.color = Te[anime.random(0, Te.length - 1)]
    a.radius = anime.random(16, 32)
    a.endPos = Oe(a)
    a.draw = function () {
      Ce.beginPath()
      Ce.arc(a.x, a.y, a.radius, 0, 2 * Math.PI, true)
      Ce.fillStyle = a.color
      Ce.fill()
    }
    return a
  }
  const Ie = (e: number, t: number) => {
    const a = {
      x: 0,
      y: 0,
      color: '#fff',
      radius: 0,
      alpha: 0,
      lineWidth: 0,
      draw: () => {}
    }
    a.x = e
    a.y = t
    a.color = '#FFF'
    a.radius = 0.1
    a.alpha = 0.5
    a.lineWidth = 6
    a.draw = () => {
      Ce.globalAlpha = a.alpha
      Ce.beginPath()
      Ce.arc(a.x, a.y, a.radius, 0, 2 * Math.PI, true)
      Ce.lineWidth = a.lineWidth
      Ce.strokeStyle = a.color
      Ce.stroke()
      Ce.globalAlpha = 1
    }
    return a
  }
  const He = (e: any) => {
    for (let t = 0; t < e.animatables.length; t++) {
      e.animatables[t].target.draw()
    }
  }
  const Ae = (e: number, t: number) => {
    const a = Ie(e, t)
    const n = []
    for (let i = 0; i < xe; i++) {
      n.push(je(e, t))
    }
    anime
      .timeline()
      .add({
        targets: n,
        x: function (e: EventParam) {
          return e.endPos.x
        },
        y: function (e: EventParam) {
          return e.endPos.y
        },
        radius: 0.1,
        duration: anime.random(1200, 1800),
        easing: 'easeOutExpo',
        update: He
      })
      .add(
        {
          targets: a,
          radius: anime.random(80, 160),
          lineWidth: 0,
          alpha: {
            value: 0,
            easing: 'linear',
            duration: anime.random(600, 800)
          },
          duration: anime.random(1200, 1800),
          easing: 'easeOutExpo',
          update: He
        },
        0
      )
  }
  const Se = anime({
    duration: Infinity,
    update: function () {
      Ce.clearRect(0, 0, we.width, we.height)
    }
  })
  useEventListener(
    document,
    Ee,
    function (e: MouseEvent | TouchEvent) {
      Se.play()
      Ne(e)
      Ae(ke, Le)
    },
    false
  )
  Me()
  useEventListener('resize', Me, false)
}
