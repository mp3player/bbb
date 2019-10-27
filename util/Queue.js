export default class Queue {
    constructor(){
        this.d = []
        this.c = 0
    }
    put(val){
        this.d.unshift({n:this.c,d:val})
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
    find(n){
        for(var i=0;i<this.c;i++){
            if(this.d[i].n == n){
                return this.d[i];
            }
        }
    }
    isEmpty(){
        return this.c <= 0
    }
}