import Shape from "./Shape";
import Queue from "./Queue/Queue";
import Stack from "./Stack/Stack";

export default class Draw extends Shape{
    constructor(pen){
        super()
        this.pen = pen
        this.canvas = this.pen.canvas
        this.stack = new Stack()
    }
    paint(conf) {
        let c = null
        if(!conf)
            c = this.config
        else
            c = conf
        var config = null
        switch (c.s) {
            case Shape.POLYGON:{
                config = this.polygon(c)
            }break;
            case Shape.LINE:{
                config = this.line(c)
            }break;
            case Shape.ARC:{
                config = this.arc(c)
            }break;
            case Shape.RECT:{
                config = this.rect(c)
            }break;
            case Shape.CIRCLE:{
                config = this.circle(c)
            }break;
            default:{
                config = c ? c : this.config
            }
        }
        var type = config.type
        this.pen.save()
        this.pen.beginPath()
        if(type == Shape.FILL)this.pen.fillStyle = config.color ? config.color : 'black'
        if(type == Shape.STROKE)this.pen.strokeStyle = config.color ? config.color : 'black'

        //config the shape props
        this.pen.lineWidth = config.lineWidth ? config.lineWidth : 1
        this.pen.globalAlpha = config.alpha ? config.alpha : 1
        this.pen.lineCap = config.lineCap ? config.lineCap : 'round'
        this.pen.lineJoin = config.lineJoin ? config.lineJoin : 'round'

        var p = config.points
        for(var i in p){
            if(i == 0) this.pen.moveTo(p[i][0],p[i][1])
            else this.pen.lineTo(p[i][0],p[i][1])
        }

        if(type == Shape.FILL)this.pen.fill()
        if(type == Shape.STROKE)this.pen.stroke()

        this.pen.closePath()

        this.pen.closePath()
        this.pen.restore()

        //add these config to stack

        this.stack.put(config)

    }
    repaint(c){
        var config = null
        switch (c.s) {
            case Shape.POLYGON:{
                config = this.polygon(c)
            }break;
            case Shape.LINE:{
                config = this.line(c)
            }break;
            case Shape.ARC:{
                config = this.arc(c)
            }break;
            default:{
                config = c
            }
        }

        var type = config.type

        this.pen.save()

        this.pen.beginPath()
        if(type == Shape.FILL)this.pen.fillStyle = config.color ? config.color : 'black'
        if(type == Shape.STROKE)this.pen.strokeStyle = config.color ? config.color : 'black'

        //config the shape props
        this.pen.lineWidth = config.lineWidth ? config.lineWidth : 1
        this.pen.globalAlpha = config.alpha ? config.alpha : 1
        this.pen.lineCap = config.lineCap ? config.lineCap : 'round'
        this.pen.lineJoin = config.lineJoin ? config.lineJoin : 'round'

        var p = config.points
        for(var i in p){
            if(i == 0) this.pen.moveTo(p[i][0],p[i][1])
            else this.pen.lineTo(p[i][0],p[i][1])
        }

        if(type == Shape.FILL)this.pen.fill()
        if(type == Shape.STROKE)this.pen.stroke()

        this.pen.closePath()

        this.pen.closePath()
        this.pen.restore()

    }
    out(){
        return this.stack.out()
    }
}
