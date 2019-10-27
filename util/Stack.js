export default class Stack {
    constructor(){
        this.d = []
        this.c = 0
    }
    put(val){
        this.d.push(val)
        this.c++
    }
    out(){
        if(this.c > 0){
            this.c--
            return this.d.splice(this.c,1)
        }
        return null
    }
    traverse(fn){
        this.d.forEach((d,i) => {
            fn(d,i,this)
        })
    }
    isEmpty(){
        return this.cout <= 0
    }
}