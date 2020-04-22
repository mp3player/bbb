import Draw from "./Draw";

export default class DrawTool extends Draw{
    constructor(pen){
        super(pen)
        this.i = 0
    }
    animateTo(shape,attr,opts){
        if(shape.timer){
           clearInterval(shape.timer)
            shape.timer = null
        }
        if(shape[attr] == opts.to){
            return 
        }
        let duration = opts.duration ? opts.duration : 1000
        let interval = 5
        let off = opts.to - shape[attr]
        let segs = duration / interval
        let section = off / segs
        let t = 0
        shape.timer = setInterval(() => {
            if(t < duration){
                shape[attr] += section
                t += interval
            }else{
                clearInterval(shape.timer)
                shape.timer = null
            }
        },interval)
    }
    render(){
        if(this.i % 1 == 0){
            this.pen.clearRect(0,0,this.pen.canvas.width,this.pen.canvas.height)
            this.stack.traverse((d,i) => {
                this.repaint(d.d)
            })
        }
        requestAnimationFrame(this.render.bind(this))
        this.i++
    }
}