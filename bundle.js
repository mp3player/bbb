//generate standard shape data

class Shape {

    static STROKE = 'stroke'
    static FILL = 'fill'
    static POLYGON = 'polygon'
    static LINE = 'line'
    static ARC = 'arc'
    static RECT = 'rect'
    static CIRCLE = 'circle'
    static TEXT = 'text'

    constructor(){
        this.config = {
            points:[],
            color:'',
            lineWidth:0,
            alpha:1,
            shadow:{x:0,y:0,blur:0,color:''},
            lineCap:'round',
            lineJoin:'round',
            lineDash:[0,0],
            type:Shape.STROKE
        };
    }
    line(config){
        /**@param config
         * config
         *      points      :   Array
         *      color       :   String
         *      lineWidth   :   Number
         *      alpha       :   Number
         *      shadow      :   Object
         *          {
         *              x       :   Number
         *              y       :   Number
         *              blur    :   Number
         *              color   :   any
         *          }
         *      lineCap     :   String
         *      lineJoin    :   String
         *      lineDash    :   Array,
         *      drawStyle   :
         *
         */
        const conf = this.config;
        return {...conf,...config}
    }
    polygon(config){
        /**@param config
         * config
         *      points      :   Array
         *      color       :   String
         *      lineWidth   :   Number
         *      alpha       :   Number
         *      shadow      :   Object
         *          {
         *              x       :   Number
         *              y       :   Number
         *              blur    :   Number
         *              color   :   any
         *          }
         *      lineCap     :   String
         *      lineJoin    :   String
         *      lineDash    :   Array,
         *
         *
         */
        const conf = this.config;
        return {...conf,...config}
    }
    arc(config){
        /**@param config
         * config
         *      color       :   String
         *      lineWidth   :   Number
         *      alpha       :   Number
         *      shadow      :   Object
         *          {
         *              x       :   Number
         *              y       :   Number
         *              blur    :   Number
         *              color   :   any
         *          }
         *      lineCap     :   String
         *      lineJoin    :   String
         *      lineDash    :   Array,
         *
         *      segments    :   Number
         *      origin      :   Array
         *      radius      :   Number
         *      startAngle  :   Number
         *      endAngle    :   Number
         *
         */
        if(config == null){
            return
        }
        const points = [];
        const start = config.origin;
        points.push(start);

        const startAngle = config.startAngle * Math.PI / 180;
        const endAngle = config.endAngle * Math.PI / 180;
        const angleOffset = endAngle - startAngle;

        const segments = config.segments;

        var o = [config.origin[0],config.origin[1]];
        var r = config.radius;
        for(var i=0;i<=segments;i++){
            var cos = Math.cos(startAngle + angleOffset / segments * i);
            var sin = Math.sin(startAngle + angleOffset / segments * i);

            var x = r * cos;
            var y = r * sin;

            points.push([
                o[0] + x,
                o[1] + y
            ]);
        }
        points.push(start);

        let conf = this.config;


        return {...conf,...config,points}
    }
    rect(config){
        if(config == null){
            return
        }
        /**@param config
         * config
         *      color       :   String
         *      lineWidth   :   Number
         *      alpha       :   Number
         *      shadow      :   Object
         *          {
         *              x       :   Number
         *              y       :   Number
         *              blur    :   Number
         *              color   :   any
         *          }
         *      lineCap     :   String
         *      lineJoin    :   String
         *      lineDash    :   Array,
         *
         *      segments    :   Number
         *      origin      :   Array
         *      radius      :   Number
         *      startAngle  :   Number
         *      endAngle    :   Number
         *
         */
        const conf = this.config;
        config.points.push(config.points[0]);

        return {...conf,...config,s:'p'}
    }
    circle(config){
        /**@param config
         * config
         *      color       :   String
         *      lineWidth   :   Number
         *      alpha       :   Number
         *      shadow      :   Object
         *          {
         *              x       :   Number
         *              y       :   Number
         *              blur    :   Number
         *              color   :   any
         *          }
         *      lineCap     :   String
         *      lineJoin    :   String
         *      lineDash    :   Array,
         *
         *      segments    :   Number
         *      origin      :   Array
         *      radius      :   Number
         *      startAngle  :   Number
         *      endAngle    :   Number
         *
         */
        if(config == null){
            return
        }
        const points = [];

        const angleOffset = 360 * Math.PI / 180;

        var o = [config.origin[0],config.origin[1]];
        var r = config.radius;

        const segments = config.segments ? config.segments : (r * 2 * Math.PI);

        for(var i=0;i<=segments;i++){
            var cos = Math.cos(angleOffset / segments * i);
            var sin = Math.sin(angleOffset / segments * i);

            var x = r * cos;
            var y = r * sin;

            points.push([
                o[0] + x,
                o[1] + y
            ]);
        }

        let conf = this.config;

        return {...conf,...config,points}
    }
    ellipsis(config){
        
    }
    //text
    text(config){
        const conf = this.config;
        let textConfig = {
            x:0,
            y:0,
            str:'',
            align:'left',
            size:20,
            family:'Arial'
        };
        return {...conf,...textConfig,...config}
    }
}

class Stack {
    constructor(){
        this.d = [];
        this.c = 0;
    }
    put(val){
        this.d.push({n:this.c,d:val});
        this.c++;
    }
    out(){
        if(this.c > 0){
            this.c--;
            return this.d.splice(this.c,1)
        }
        return null
    }
    traverse(fn){
        this.d.forEach((d,i) => {
            fn(d,i,this);
        });
    }
    isEmpty(){
        return this.cout <= 0
    }
}

class Draw extends Shape{
    constructor(pen){
        super();
        this.pen = pen;
        this.canvas = this.pen.canvas;
        this.stack = new Stack();
    }
    paint(conf) {
        let c = null;
        if(!conf)
            c = this.config;
        else
            c = conf;
        var config = null;
        switch (c.s) {
            
            case Shape.POLYGON:{
                config = this.polygon(c);
            }break;
            case Shape.LINE:{
                config = this.line(c);
            }break;
            case Shape.ARC:{
                config = this.arc(c);
            }break;
            case Shape.RECT:{
                config = this.rect(c);
            }break;
            case Shape.CIRCLE:{
                config = this.circle(c);
            }break;
            case Shape.TEXT:{
                config = this.text(c);
            }break;
            default:{
                config = c ? c : this.config;
            }
        }
        var type = config.type;
        if(config.s == Shape.TEXT){
            //TODO
            //文本，临时加上，需要完善结构

            this.pen.save();
            this.pen.beginPath();
            if(type == Shape.FILL)this.pen.fillStyle = config.color ? config.color : 'black';
            if(type == Shape.STROKE)this.pen.strokeStyle = config.color ? config.color : 'black';
            this.pen.font = `${config.size}px ${config.family}`;
            this.pen.globalAlpha = config.alpha;
            this.pen.textAlign = config.align;
            this.pen.textBaseLine = 'top';
   
            if(type == Shape.FILL)this.pen.fillText(config.str,config.x,config.y);
            if(type == Shape.STROKE)this.pen.strokeText(config.str,config.x,config.y);

            this.pen.restore();

            this.stack.put(config);
        }else {
            
            this.pen.save();
            this.pen.beginPath();
            if(type == Shape.FILL)this.pen.fillStyle = config.color ? config.color : 'black';
            if(type == Shape.STROKE)this.pen.strokeStyle = config.color ? config.color : 'black';
            
            //config the shape props
            this.pen.lineWidth = config.lineWidth ? config.lineWidth : 1;
            this.pen.globalAlpha = config.alpha ? config.alpha : 1;
            this.pen.lineCap = config.lineCap ? config.lineCap : 'round';
            this.pen.lineJoin = config.lineJoin ? config.lineJoin : 'round';
            //TODO  临时加上
            this.pen.setLineDash(config.lineDash ? config.lineDash : [0,0]);
    
            var p = config.points;
            for(var i in p){
                if(i == 0) this.pen.moveTo(p[i][0],p[i][1]);
                else this.pen.lineTo(p[i][0],p[i][1]);
            }
    
            if(type == Shape.FILL)this.pen.fill();
            if(type == Shape.STROKE)this.pen.stroke();
            
            this.pen.closePath();
            this.pen.restore();
    
            //add these config to stack
    
            this.stack.put(config);

        }
        

    }
    repaint(c){
        // this.pen.clearRect(0,0,this.pen.canvas.width,this.pen.canvas.height)
        var config = null;
        switch (c.s) {
            case Shape.POLYGON:{
                config = this.polygon(c);
            }break;
            case Shape.LINE:{
                config = this.line(c);
            }break;
            case Shape.ARC:{
                config = this.arc(c);
            }break;
            case Shape.TEXT:{
                config = this.text(c);
            }break;
            default:{
                config = c;
            }
        }

        var type = config.type;
        if(config.s == Shape.TEXT){
            //TODO
            //文本，临时加上，需要完善结构
            this.pen.save();
            this.pen.fillStyle = config.color ? config.color : 'black';
            this.pen.font = `${config.size}px ${config.family}`;
            this.pen.globalAlpha = config.alpha;
            this.pen.textAlign = config.align;
            this.pen.textBaseLine = 'top';
   
            this.pen.fillText(config.str,config.x,config.y);

            this.pen.restore();

        }else {
            this.pen.save();

            this.pen.beginPath();
            if(type == Shape.FILL)this.pen.fillStyle = config.color ? config.color : 'black';
            if(type == Shape.STROKE)this.pen.strokeStyle = config.color ? config.color : 'black';
    
            //config the shape props
            this.pen.lineWidth = config.lineWidth ? config.lineWidth : 1;
            this.pen.globalAlpha = config.alpha ? config.alpha : 1;
            this.pen.lineCap = config.lineCap ? config.lineCap : 'round';
            this.pen.lineJoin = config.lineJoin ? config.lineJoin : 'round';
            this.pen.setLineDash(config.lineDash);
    
            var p = config.points;
            for(var i in p){
                if(i == 0) this.pen.moveTo(p[i][0],p[i][1]);
                else this.pen.lineTo(p[i][0],p[i][1]);
            }
    
            if(type == Shape.FILL)this.pen.fill();
            if(type == Shape.STROKE)this.pen.stroke();
    
            this.pen.closePath();
    
            this.pen.restore();
        }

    }
    out(){
        return this.stack.out()
    }
}

class DrawTool extends Draw{
    constructor(pen){
        super(pen);
        this.i = 0;
    }
    animateTo(shape,attr,opts){
        
    }
    render(){
        if(this.i % 1 == 0){
            this.pen.clearRect(0,0,this.pen.canvas.width,this.pen.canvas.height);
            this.stack.traverse((d,i) => {
                this.repaint(d.d);
            });
        }
        requestAnimationFrame(this.render.bind(this));
        this.i++;
    }
}

function select(identify){
    return document.querySelector(identify)
}
function selectAll(identify){
    return document.querySelectorAll(identify)
}
function event(dom,event,fn){
    dom['on'+event] = fn;
}
function off(dom,event){
    if(Object.prototype.toString.call(event) == '[object Array]'){
        for(let i in event){
            dom['on'+event[i]] = null;
        }
    }else {
        dom['on'+event] = null;
    }

}
function render(lists,dom,tagName){
    const s = select(dom);
    let tag = '';
    for(let i in lists){
        tag += `<${tagName}>${lists[i]}</${tagName}>`;
    }
    s.innerHTML = tag;
}
function css(dom,css){
    for(let i in css){
        transformCamelCase(i);
        dom['style'][i] = css[i];
    }
}
function attr(dom,name){
    return dom[name]
}
function transformCamelCase(cameCase){
    return cameCase.replace(/[A-Z]/g,(d) => {
        return d.toLowerCase() + '-'
    })
}

//cannel bubble

//class set and get fn
// function get(obj,name){
//     let props = name.replace(/^/,'[\'').replace(/$/,'\']').replace(/\./g,'\'][\'')
//     return eval(`obj${props}`)
// }
function set(obj,name,val){
    obj[name] = val;
}

// function screenToCoord(pen,x,y){
//     let w = pen.canvas.width,h = pen.canvas.height
//     let center = [w / 2,h / 2]
//     return [x - center[0] , center[1] - h]
// }
// function coordToScreen(pen,x,y){
//     let w = pen.canvas.width,h = pen.canvas.height
//     let center = [w / 2,h / 2]
//     return [x + center[0] , center[1] - y]
// }
function isInPolygon(points,point){
    let flag = false,len = points.length;
    if(len < 3)
        return flag
    for(let i=0,j=len-1;i<len;j=i++){
        let p1 = points[i],p2 = points[j],p3 = point;

        if( (p3[1] < p1[1] && p3[1] < p2[1]) || (p3[1] > p1[1] && p3[1] > p2[1]) )
            continue
        
        let k = (p1[0] - p2[0]) / (p1[1] - p2[1]);
        let b = p1[0] - k * p1[1];

        if(k * p3[1] + b < p3[0])
            flag = !flag;
        
    }
    return flag
}

const shape = {DrawTool,select, selectAll, event, off, render, css, attr, set,isInPolygon};

export default shape;
export { DrawTool, attr, css, event, isInPolygon, off, render, select, selectAll, set };
