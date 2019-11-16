function select(identify){
    return document.querySelector(identify)
}
function selectAll(identify){
    return document.querySelectorAll(identify)
}
function event(dom,event,fn){
    dom['on'+event] = fn
}
function off(dom,event){
    if(Object.prototype.toString.call(event) == '[object Array]'){
        for(let i in event){
            dom['on'+event[i]] = null
        }
    }else{
        dom['on'+event] = null
    }

}
function render(lists,dom,tagName){
    const s = select(dom)
    let tag = ''
    for(let i in lists){
        tag += `<${tagName}>${lists[i]}</${tagName}>`
    }
    s.innerHTML = tag
}
function renderAll(lists,dom,tagName){
    const s = selectAll(dom)
    let tag = ''
    for(let i in lists){
        tag += `<${tagName}>${lists[i].toString()}</${tagName}>`
    }
    s.forEach((d,i) => {
        d.innerHTML = tag
    })
}
function css(dom,css){
    for(let i in css){
        transformCamelCase(i)
        dom['style'][i] = css[i]
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
function get(obj,name){
    let props = name.replace(/^/,'[\'').replace(/$/,'\']').replace(/\./g,'\'][\'')
    return eval(`obj${props}`)
}
function set(obj,name,val){
    obj[name] = val
}

const Query = {select,selectAll,event,off,render,renderAll,css,attr,set,get}
export default Query
export {
    select,selectAll,event,off,render,renderAll,css,attr,set,get
}
