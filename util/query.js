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
    dom['on'+event] = null
}
function render(lists,dom,tagName){
    console.log(lists);
    const s = select(dom)
    let tag = ''
    for(let i in lists){
        console.log(tag);
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

const Panel = {select,selectAll,event,off,render,renderAll}
export default Panel
export {
    select,selectAll,event,off,render,renderAll
}
