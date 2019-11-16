class Color {
    constructor(r=255,g=255,b=255,a=255){
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }
    set(r,g,b,a){
        this.r = r
        this.g = g
        this.b = b
        this.a =a
    }
    toString(){
        return `rgba(${this.r},${this.g},${this.b},${this.a},)`
    }
    toArray(){
        return [this.r,this.g,this.b,this.a]
    }
    static parseHex(c){
        //parse
        let color = c.match(/\w{2}/)
        let r = parseInt(color[0])
        let g = parseInt(color[1])
        let b = parseInt(color[2])
        return new Color(r,g,b)
    }
    static parseColorName(color){
        let c = document.createElement('canvas')
        c.width = 1
        c.height = 1
        let p = c.getContext('2d')
        p.fillStyle = color
        p.fillRect(0,0,1,1)
        p.fill()
        let d = p.getImageData(0,0,1,1).data
        c = null
        return new Color(d[0],d[1],d[2],d[3])
    }
}
export {Color}