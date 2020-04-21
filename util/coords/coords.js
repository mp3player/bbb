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
    let flag = false,len = points.length
    if(len < 3)
        return flag
    for(let i=0,j=len-1;i<len;j=i++){
        let p1 = points[i],p2 = points[j],p3 = point

        if( (p3[1] < p1[1] && p3[1] < p2[1]) || (p3[1] > p1[1] && p3[1] > p2[1]) )
            continue
        
        let k = (p1[0] - p2[0]) / (p1[1] - p2[1])
        let b = p1[0] - k * p1[1]

        if(k * p3[1] + b < p3[0])
            flag = !flag
        
    }
    return flag
}

export {
    isInPolygon
}