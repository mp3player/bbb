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
let center = [700,700]
let maxRadius = 570
canvas.style.background = 'black'

const pen = canvas.getContext('2d')

let shape = new DrawTool(pen)

let start = -90
let end = -90

//原数据
let data = [25,30,35,40,50]
let len = data.length
let per = []
let total = 0
let angle = 90 / len
for(let i=0;i<len;i++){
    total += data[i]
}
data.forEach((d,i) => {
    per[i] = d / total
})
for(let i=0;i<len;i++){
    //lines
    end = end - angle
    //triangles
    let gradienteven = pen.createRadialGradient(center[0],center[1],100,center[0],center[1],100 * per[i] * 20)
    let gradientodd = pen.createRadialGradient(center[0],center[1],100,center[0],center[1],100 * per[i] * 20)
    gradienteven.addColorStop(0,'hsla(206, 96%, 36%, 1)')
    gradienteven.addColorStop(1,'hsla(206, 96%, 56%, 1)')

    gradientodd.addColorStop(0,'rgba(192, 247, 255, 1)')
    gradientodd.addColorStop(1,'rgba(192, 247, 255, 1)')


    shape.paint({
        color:i % 2 == 0 ? gradienteven : gradientodd,
        lineWidth:2,
        origin:center,
        radius:100 * per[i] * 20,
        Sradius:100 * per[i] * 20,
        startAngle:start,
        endAngle:end,
        segments:1,
        touch:true,
        symbol:false,
        type:DrawTool.FILL,
        s:DrawTool.ARC
    })
    start = end
    let a = (start + angle / 2) * Math.PI / 180
    let x = Math.cos(a) * maxRadius + center[0]
    let y = Math.sin(a) * maxRadius + center[1]
    
    //line
    shape.paint({
        color:'white',
        lineWidth:2,
        alpha:.6,
        points:[[x,y],center],
        type:DrawTool.STROKE,
        s:DrawTool.LINE
    })
    // text
    shape.paint({
        color:'white',
        x:x,
        y:y - 10,
        str:'15:00-18:001',
        align:'right',
        size:20,
        family:'宋体',
        type:DrawTool.FILL,
        s:DrawTool.TEXT
    })
    //circles
    shape.paint({
        color:'white',
        lineWidth:1,
        origin:center,
        alpha:.4,
        lineDash:[2,2],
        startAngle:-90,
        endAngle:-180,
        segments:100,
        radius:maxRadius / len * (i+1),
        type:DrawTool.STROKE,
        s:DrawTool.ARC
    })
    //axies
    shape.paint({
        color:'white',
        lineWidth:2,
        points:[center,[center[0] - maxRadius - 100 , center[1]]],
        type:DrawTool.STROKE,
        s:DrawTool.LINE
    })
    shape.paint({
        color:'white',
        size:20,
        alpha:.8,
        str:Number.parseInt(i * maxRadius / len),
        align:'center',
        x:-maxRadius / len * i + center[0],y:center[1] + 20,
        type:DrawTool.STROKE,
        s:DrawTool.TEXT
    })
}
event(canvas,'mousemove',function(e){
    let rect = this.getBoundingClientRect()
    let x = e.x - rect.x,y = rect.y = e.y

    shape.stack.d.forEach((d,i) => {
        if(d.d.touch){
            let f = isInPolygon(d.d.points,[x,y])
            if(f){
                css(canvas,{cursor:'pointer'})
                if(!d.d.symbol){
                    d.d.symbol = true
                    css(canvas,{cursor:'pointer'})
                    shape.animateTo(d.d,'alpha',{to:.6,duration:100})
                    shape.animateTo(d.d,'radius',{to:d.d.radius + 10,duration:100})
                }
                    
            }else{
                if(d.d.symbol){
                    d.d.symbol = false
                    shape.animateTo(d.d,'alpha',{to:1,duration:100})
                    shape.animateTo(d.d,'radius',{to:d.d.Sradius,duration:100})
                    css(canvas,{cursor:'default'})
                }
            }   
        }
    })
})

console.log(shape)
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
const config = {color:'',lineWidth:0,alpha:1,type:DrawTool.STROKE}

event(canvas,'mousedown',function(e){
    let x = e.x
    let y = e.y
    shape.paint({})
    let p = []
    event(document,'mousemove',function(e){
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
                    s:DrawTool.CIRCLE,
                    segments:100,
                    ...config
                })
            }break;
            case s.RECT :{
                p = [[x,y],[e.x,y],[e.x,e.y],[x,e.y]]
                shape.paint({
                    points:p,
                    s:DrawTool.RECT,
                    ...config
                })
            }break;
            case s.LINE:{
                p = [[x,y],[e.x,e.y]]
                shape.paint({
                    points:p,
                    s:DrawTool.LINE,
                    ...config,
                    type:DrawTool.STROKE
                })
            }break;
            case s.PEN:{
                p.push([e.x,e.y])
                shape.paint({
                    points:p,
                    s:DrawTool.LINE,
                    ...config,
                    type:DrawTool.STROKE
                })
            }break;
            default:{
                shape.paint()
            }break;
        }
    })
    event(document,'mouseup',function(){
        off(document,'mousemove')
        off(document,'mouseup')
    })
})
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






