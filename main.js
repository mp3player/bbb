import Shape from './util/DrawTool'
const canvas = document.querySelector('#canvas')
canvas.width = innerWidth
canvas.height = innerHeight

canvas.style.background = 'pink'
const pen = canvas.getContext('2d')

var shape = new Shape(pen)

const arc = shape.arc()

shape.draw({
    color:'purple',
    lineWidth:2,
    origin:[100,100],
    radius:100,
    startAngle:0,
    endAngle:90,
    segments:2,
    type:Shape.STROKE,
    s:Shape.ARC
})

shape.render()




