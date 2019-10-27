import Draw from "./Draw";

export default class DrawTool extends Draw{
    constructor(pen){
        super(pen)
        this.i = 0
    }
    render(){
        this.pen.clearRect(0,0,this.pen.canvas.width,this.pen.canvas.height)
        this.queue.traverse((d,i) => {
            d.d.origin[0] += .001
            this.draw(d.d)
        })
        if(this.i % 30 == 0)
            requestAnimationFrame(this.render.bind(this))
        console.log(this.i);
        this.i++
    }
}