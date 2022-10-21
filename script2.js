"use strict"

let c = {
  canvas: null, 
  ctx: null,
  w: undefined, 
  h: undefined,
  mouse: {x: undefined, y: undefined},

  center: {x: undefined, y: undefined},
  factor1: 0,
  factor2: 0,
  amount : 8, 
  spin: Math.PI,
  depth: 6,
  hue: 0,
  hueIncrement: 240,
  timerId: undefined,

  init() {
    this.canvas = document.querySelector('canvas')
    this.w = (this.canvas.width = window.innerWidth)
    this.h = (this.canvas.height = window.innerHeight)
    this.ctx = this.canvas.getContext('2d')
  },

  drawMandala(x, y ,r, angle, step) {
    this.center.x = x + 0.5 * r * Math.cos(angle)
    this.center.y = y + 0.5 * r * Math.sin(angle)
    this.ctx.beginPath()
    this.ctx.arc(this.center.x, this.center.y, r/10, 0, 2*Math.PI)
    this.hue = step * (360/this.amount) + this.hueIncrement
    this.ctx.fillStyle = "hsla(" + this.hue + ", 100%, 50%, 1)"
    this.ctx.fill()

    if (step < c.depth){
        this.drawMandala(
          x + r * Math.cos(angle + this.factor1), 
          y + r * Math.sin(angle + this.factor1),
          0.7  * r,
          angle + this.factor2 * Math.PI / 180 + this.spin,
          step + 1
        )
        this.drawMandala(
          x + r * Math.cos(angle - this.factor1), 
          y + r * Math.sin(angle - this.factor1),
          0.4 * r,
          angle - this.factor2 * Math.PI / 180 + this.spin,
          step + 1
        )
    }
  },

  main() {
    this.ctx.fillStyle = 'hsla(0, 0%, 0%, 0.1)'
    this.ctx.fillRect(0, 0, this.w, this.h)
    this.hueIncrement += 1
    for (let i = 0; i < this.amount; i++){
      this.drawMandala(
        this.w / 2,
        this.h / 2,
        c.w / 6 + (c.w / 6 - 100) * Math.cos(c.factor1),
        i * 2* Math.PI / (this.amount),
        0
      )
    }

    if (this.mouse.x && this.mouse.y){ 
      this.factor2 = this.w - this.mouse.x
      this.factor1 = this.h / this.mouse.y
    } else{
      this.factor1 -= 0.005
      this.factor2 -= 0.07
    }

  }
}


let events = ['load', 'resize']
events.forEach(function(e) {
	window.addEventListener(e, function() { 
    c.init()
    c.timerId = setInterval(function () { c.main() }, 1000 / 60)
	})
})

window.addEventListener("mousemove",function(e) {
    c.mouse.x = e.x
    c.mouse.y = e.y
    if (c.timerId!=false) {
      setTimeout(() => { 
        clearInterval(c.timerId) 
        c.timerId = false
      }, 1)
    }
    c.main()
}, false)

document.onkeydown = function(e) {
  switch (e.key) {
    case "ArrowRight": 
      c.depth++
      c.main()
    break
    case "ArrowLeft":  
      c.depth--
      c.main()
    break
    case "ArrowUp": 
      c.amount++
      c.main()
    break
    case "ArrowDown":  
      c.amount--
      c.main()
    break
  }
}

document.addEventListener("click", function(e) {
  c.mouse.x = undefined
  c.mouse.y = undefined
  c.timerId = setInterval(function () { c.main() }, 1000 / 60)
})
