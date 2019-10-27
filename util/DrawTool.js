import Draw from "./Draw";

export default class DrawTool extends Draw{
    constructor(pen){
        super(pen)
        this.i = 0
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