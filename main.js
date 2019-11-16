import DrawTool from './util/DrawTool'
import {select, selectAll, event, off, render, css, attr, set,get} from "./util/query/query";
import {ColorPicker} from "./util/color/ColorPicker";

import './scss/tool.scss'
import './scss/normal.scss'
import './scss/tool-panel.scss'
import {Color} from "./util/color/Color";

const canvas = document.querySelector('#canvas')
canvas.width = innerWidth
canvas.height = innerHeight
canvas.style.background = 'pink'

const pen = canvas.getContext('2d')

let shape = new DrawTool(pen)


shape.paint({
    color:'purple',
    lineWidth:2,
    origin:[100,100],
    radius:500,
    startAngle:0,
    endAngle:90,
    segments:100,
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
    let picker = new ColorPicker('color-picker-canvas',330,400)
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
                //获取宽高
                const width = attr(this,'offsetWidth')
                const height = attr(this,'offsetHeight')
                //计算偏移
                const disX = e.x - attr(this,'offsetLeft')
                const disY = e.y - attr(this,'offsetTop')
                css(d,{opacity:.3})
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






