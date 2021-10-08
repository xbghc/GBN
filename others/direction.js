function getBorder(){
    return (0,600,0,800);
}
var top,bottom,left,right = getBorder();


function changeXY(x,y)
{
    return (y,x);
}



function changeXY_ratioly(x,y){
    let tmpx = x;
    let tmpy = y;
    let width = right - left;
    let height = bottom - top;
    tmpx = top + (y-top)/height*width;
    tmpy = left + (x-left)*height/width;
    return (tmpx,tmpy);
}

function changeXdirection(x){
    return right - (x-left);
}

function changeYdirection(y){
    return bottom - (y- top);
}