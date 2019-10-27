import Shape from './util/DrawTool'
const canvas = document.querySelector('#canvas')
canvas.width = innerWidth
canvas.height = innerHeight

canvas.style.background = 'pink'
const pen = canvas.getContext('2d')

var shape = new Shape(pen)

const arc = shape.arc()

shape.paint({
    color:'purple',
    lineWidth:2,
    origin:[100,100],
    radius:100,
    startAngle:0,
    endAngle:90,
    segments:10,
    type:Shape.FILL,
    s:Shape.ARC
})
shape.paint({
    color:'blue',
    lineWidth:2,
    points:[[100,100],[200,200],[300,400]],
    type:Shape.FILL,
    s:Shape.POLYGON
})
shape.render()




