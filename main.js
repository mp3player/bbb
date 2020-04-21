import DrawTool from './util/DrawTool'
import {select, selectAll, event, off, render, css, attr, set,get} from "./util/query/query";
import {ColorPicker} from "./util/color/ColorPicker";
import {isInPolygon} from './util/coords/coords.js'

import './scss/tool.scss'
import './scss/normal.scss'
import './scss/tool-panel.scss'
import {Color} from "./util/color/Color";

const canvas = document.querySelector('#canvas')
canvas.width = 800
canvas.height = 800
let center = [800,800]
let maxRadius = 400
canvas.style.background = 'pink'

const pen = canvas.getContext('2d')
console.log(pen)

let shape = new DrawTool(pen)

let start = -90
let end = -90

//原数据
let data = [25,30,35,40,50,43,32,54]
let per = []
let total = 0
let angle = 90 / data.length
for(let i=0;i<data.length;i++){
    total += data[i]
}
data.forEach((d,i) => {
    per[i] = d / total
})
for(let i=0;i<data.length;i++){
    
    //lines
    end = end - angle

    let a = (end + angle / 2) * Math.PI / 180
    let x = Math.cos(a) * maxRadius + center[0]
    let y = Math.sin(a) * maxRadius + center[1]

    shape.paint({
        color:'cyan',
        lineWidth:1,
        points:[[x,y],center],
        type:DrawTool.STROKE,
        s:DrawTool.LINE
    })
    //circles

    shape.paint({
        color:'red',
        lineWidth:1,
        origin:center,
        lineDash:[10,10],
        radius:maxRadius / data.length * (i+1),
        type:DrawTool.STROKE,
        s:DrawTool.CIRCLE
    })

    //triangles

    let gradient = pen.createRadialGradient(center[0],center[1],100,center[0],center[1],100 * per[i] * 20)
    gradient.addColorStop(0,'hsla(206, 96%, 36%, 1)')
    gradient.addColorStop(.99,'hsla(206, 96%, 56%, 1)')
    gradient.addColorStop(1,'hsla(206, 96%, 56%, 1)')
    shape.paint({
        color:gradient,
        lineWidth:2,
        origin:center,
        radius:100 * per[i] * 20,
        startAngle:start,
        endAngle:end,
        segments:1,
        selectColor:'red',
        commonColor:gradient,
        commonRadius:100 * per[i] * 20,
        selectRadius:100 * per[i] * 20 + 20,
        type:DrawTool.FILL,
        s:DrawTool.ARC
    })
    start = end
}
console.log(shape.stack.d)
event(canvas,'mousemove',function(e){
    let rect = this.getBoundingClientRect()
    let x = e.x - rect.x,y = rect.y = e.y
    //获取画布上xy的位置
    shape.stack.d.forEach((d,i) => {
        let f = isInPolygon(d.d.points,[x,y])
        if(d.d.s == 'arc'){
            if(f)
                d.d.color = d.d.selectColor,d.d.radius = d.d.selectRadius
            else
                d.d.color = d.d.commonColor,d.d.radius = d.d.commonRadius
        }
    })
})
shape.render()
// const s = {
//     POLYGON:'POLYGON',
//     LINE:'LINE',
//     RECT:'RECT',
//     ARC:'ARC',
//     CIRCLE:'CIRCLE',
//     PEN:'PEN'
// }
// let shapes = s.LINE
// const config = {color:'',lineWidth:0,alpha:1,type:DrawTool.STROKE}

// event(canvas,'mousedown',function(e){
//     let x = e.x
//     let y = e.y
//     shape.paint({})
//     let p = []
//     event(document,'mousemove',function(e){
//         //出栈
//         shape.out()
//         switch (shapes) {
//             case s.POLYGON:{
//                 shape.paint()
//             }break;
//             case s.CIRCLE:{
//                 shape.paint({
//                     origin:[x,y],
//                     radius:Math.sqrt(Math.pow(e.x - x,2) + Math.pow(e.y - y ,2)),
//                     s:DrawTool.CIRCLE,
//                     segments:100,
//                     ...config
//                 })
//             }break;
//             case s.RECT :{
//                 p = [[x,y],[e.x,y],[e.x,e.y],[x,e.y]]
//                 shape.paint({
//                     points:p,
//                     s:DrawTool.RECT,
//                     ...config
//                 })
//             }break;
//             case s.LINE:{
//                 p = [[x,y],[e.x,e.y]]
//                 shape.paint({
//                     points:p,
//                     s:DrawTool.LINE,
//                     ...config,
//                     type:DrawTool.STROKE
//                 })
//             }break;
//             case s.PEN:{
//                 p.push([e.x,e.y])
//                 shape.paint({
//                     points:p,
//                     s:DrawTool.LINE,
//                     ...config,
//                     type:DrawTool.STROKE
//                 })
//             }break;
//             default:{
//                 shape.paint()
//             }break;
//         }
//     })
//     event(document,'mouseup',function(){
//         off(document,'mousemove')
//         off(document,'mouseup')
//     })
// })
event(document.body,'load',function(e) {
    // let picker = new ColorPicker('color-picker-canvas',330,400)
    //shape cmd
    selectAll('#tool .shape p').forEach((d,i) => {
        d.onclick = function(e){
            shapes = s[this.dataset.shape]
            selectAll('#tool .shape p').forEach((d,i) => {
                css(d,{background:'#003333'})
            })
                css(d,{background:'red'})
        }
    })
    //tool cmd
    selectAll('#tool .draggable').forEach((d,i) => {
            d.onmousedown = function(e){
                css(d,{zIndex:100})
                //获取宽高
                const width = attr(this,'offsetWidth')
                const height = attr(this,'offsetHeight')
                //计算偏移
                const disX = e.x - attr(this,'offsetLeft')
                const disY = e.y - attr(this,'offsetTop')
                css(d,{opacity:.5})
                event(document,'mousemove',(e) => {
                    css(this,{
                        position:'absolute',
                        left:e.x - disX + 'px',
                        top:e.y - disY + 'px'
                    })
                    if(e.x - disX < 0){
                        css(this,{
                            left:'0px'
                        })
                    }
                    if(e.y - disY < 0){
                        css(this,{
                            top:'0px'
                        })
                    }
                    if(e.x - disX > innerWidth - width){
                        css(this,{
                            left:innerWidth - width + 'px'
                        })
                    }
                    if(e.y - disY > innerHeight - height){
                        css(this,{
                            top:innerHeight - height + 'px'
                        })
                    }

                })
                event(document,'mouseup',function(){
                    off(document,['mousemove','mouseup'])
                    css(d,{opacity:1})
                })
            }
        })
    //props cmd
    // initProps()
    selectAll('#tool .conf .props').forEach((d,i) => {
        event(d,'input',function(e){
            set(config,get(d, 'dataset.props'),get(d,'value'))
        })
    })
    //cancel event bubble
    selectAll('#tool .cancel-bubble').forEach((d,i) => {
        event(d,'mousedown',(e) => {
            e.cancelBubble = true
        })
    })
})

function initProps(){
    const conf = selectAll('#tool .conf .props')
    conf.forEach((d,i) => {
        // config[get(d, 'dataset.props')]
        get(d,'value')
        set(config,get(d, 'dataset.props'),get(d,'value'))
    })
}






