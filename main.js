import DrawTool from './util/DrawTool'

import './scss/tool.scss'

const canvas = document.querySelector('#canvas')
canvas.width = innerWidth
canvas.height = innerHeight
canvas.style.background = 'pink'

const pen = canvas.getContext('2d')

var shape = new DrawTool(pen)

shape.paint({
    color:'purple',
    lineWidth:2,
    origin:[100,100],
    radius:100,
    startAngle:0,
    endAngle:90,
    segments:10,
    type:DrawTool.FILL,
    s:DrawTool.ARC
})
shape.paint({
    color:'blue',
    lineWidth:2,
    points:[[100,100],[200,200],[300,400]],
    type:DrawTool.FILL,
    s:DrawTool.POLYGON
})
shape.render()

const s = {
    POLYGON:'POLYGON',
    LINE:'LINE',
    RECT:'RECT',
    ARC:'ARC',
    CIRCLE:'CIRCLE',
    PEN:'PEN'
}
let shapes = s.LINE
console.log(shape.stack);
canvas.onmousedown = function(e){
    let x = e.x
    let y = e.y
    shape.paint({})
    let p = []
    document.onmousemove = function(e){
        //出栈
        shape.out()

        switch (shapes) {
            case s.POLYGON:{
                shape.paint()
            }break;
            case s.CIRCLE:{
                shape.paint({
                    origin:[x,y],
                    radius:Math.sqrt(Math.pow(e.x - x,2) + Math.pow(e.y - y ,2)),
                    type:DrawTool.STROKE,
                    lineWidth:4,
                    s:DrawTool.CIRCLE,
                    segments:100,
                    color:'cyan'
                })
            }break;
            case s.RECT :{
                p = [[x,y],[e.x,y],[e.x,e.y],[x,e.y]]
                shape.paint({
                    points:p,
                    type:DrawTool.STROKE,
                    lineWidth:4,
                    s:DrawTool.RECT,
                    color:'red'
                })
            }break;
            case s.LINE:{
                p = [[x,y],[e.x,e.y]]
                shape.paint({
                    points:p,
                    type:DrawTool.STROKE,
                    lineWidth:8,
                    s:DrawTool.LINE,
                    color:'orange'
                })
            }break;
            case s.PEN:{
                p.push([e.x,e.y])
                shape.paint({
                    points:p,
                    type:DrawTool.STROKE,
                    lineWidth:2,
                    s:DrawTool.LINE,
                    color:'green'
                })
            }break;
            default:{
                shape.paint()
            }break;
        }
    }
    document.onmouseup = function(){
        document.onmousemove = null
        document.onmouseup = null

    }
}
document.body.onload = () => {
    document.body.querySelectorAll('#tool .shape p').forEach((d,i) => {

        d.onclick = function(e){
            shapes = s[this.dataset.shape]
            document.body.querySelectorAll('#tool .shape p').forEach((d,i) => {
                d.style.background = '#003333'
            })
            this.style.background = 'red'
        }
    })
    document.body.querySelector('#tool .shape').onmousedown = function(e){
        //获取宽高
        const width = this.offsetWidth
        const height = this.offsetHeight
        //计算偏移
        const disX = e.x - this.offsetLeft
        const disY = e.y - this.offsetTop

        console.log(width,height)
        document.onmousemove = (e) => {
            this.style.position = 'absolute'
            this.style.left = e.x - disX + 'px'
            this.style.top = e.y - disY + 'px'

        }
        document.onmouseup = function(){
            document.onmouseup = null
            document.onmousemove = null
        }
    }
}






