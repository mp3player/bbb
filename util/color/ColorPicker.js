import Query from '../query/query'
import {Color} from './Color'

console.log(Query);

class ColorPicker{
    constructor(container,width,height){
        this.canvas = Query.select('#'+container)
        this.pen = null
        this.dimension = {width:0,height:0}
        this.state = this.canvas ? true : false
        this.init(width,height)
    }
    init(width,height){
        if(!this.state){
            throw new Error("the canvas can not found");
            return
        }
        this.pen = this.canvas.getContext('2d')

        Query.set(this.dimension,'width',width)
        Query.set(this.dimension,'height',height)
        Query.set(this.canvas,'width',width)
        Query.set(this.canvas,'height',height)

        this.draw()
    }
    draw(){
        if(this.state){
            let pen = this.pen
            let linearBasicColor = pen.createLinearGradient(0,0,this.dimension.width,0)
            linearBasicColor.addColorStop(0,'rgba(255,255,255,255)')
            linearBasicColor.addColorStop(1,'rgba(255,0,0,255)')

            pen.save()
            pen.fillStyle = linearBasicColor
            pen.fillRect(0,0,this.dimension.width,this.dimension.height)
            pen.fill()
            pen.restore()
            pen.save()

            let linearBlackColor = pen.createLinearGradient(0,0,0,this.dimension.height)
            linearBlackColor.addColorStop(0,'rgba(0,0,0,0)')
            linearBlackColor.addColorStop(1,'rgba(0,0,0,255)')

            pen.save()

            pen.fillStyle = linearBlackColor
            pen.fillRect(0,0,this.dimension.width,this.dimension.height)
            pen.fill()
            pen.restore()
            pen.save()
        }
    }
    picker(){
        if(this.canvas.onclick)
            return
        this.canvas.onclick = (e) => {
            let data = this.pen.getImageData(0,0,this.dimension.width,this.dimension.height).data
            let index = this.dimension.width * e.offsetY + e.offsetX
            let r = data[index * 4]
            let g = data[index * 4 + 1]
            let b = data[index * 4 + 2]
            let a = data[index * 4 + 3]
            let color = new Color(r,g,b,a)
            return color
        }
    }
}

export {ColorPicker}