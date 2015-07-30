var cursorX =0;
var cursorY = 0;
var currentWindow = 0;
document.onmousemove = function(e)
{
    cursorX = e.pageX;
    cursorY = e.pageY;
}
setInterval(function(){repaint();}, 50);
function fly(xi,yi)
{
    this.x = xi;
    this.y = yi;

}

var canvas = document.getElementById("myCanvas");
canvas.width = document.body.clientWidth; //document.width is obsolete
canvas.height = document.body.clientHeight;
var width = canvas.width;
var height = canvas.height;
var ctx = canvas.getContext("2d");
var flies = new Array();
for(var i = -width; i < width; i+=35)
{
    for(var j = -height; j < height; j+=35)
{
    flies.push(new fly(i,j*3));
}
}
var r = 0;
var g = 124;
var b = 254;
var a= false;
var z = false;
var c = true;
var click=0;
 canvas.addEventListener('click', function() {if(click<2){click++}else{click = 0};}, false);
function rightArrow()
{
currentWindow +=1;
}
function leftArrow()
{
currentWindow -=1;
}
function repaint()
{
ctx.fillStyle = "#000000";
ctx.fillRect(0,0,width,height);
ctx.fillStyle = "rgb("+r+","+g+","+b+")";

if(a)
{
    if(r >0)
    {
        r-=2;
    }
    else
    {
        a = false;
    }
}
else
{
    if(r < 254)
    {
    r+=2;
    }
    else
    {
        a = true;
    }
}
if(c)
{
    if(b >0)
    {
        b-=2;
    }
    else
    {
        c = false;
    }
}
else
{
    if(b < 254)
    {
    b+=2;
    }
    else
    {
        c = true;
    }
}
if(z)
{
    if(g >0)
    {
        g-=2;
    }
    else
    {
        z = false;
    }
}
else
{
    if(g < 254)
    {
    g+=2;
    }
    else
    {
        z = true;
    }
}
if(currentWindow == 0)
{
for(var i = 0; i < flies.length; i++)
{

var d =Math.sqrt((flies[i].x-cursorX)*(flies[i].x-cursorX)+(flies[i].y-cursorY)*(flies[i].y-cursorY));   
    if(click == 1)
    {
        d = -d;
    }
    if(click == 0 || click == 1)
    {
    if(flies[i].x < cursorX)
    {
        flies[i].x+=200/d;
    }
     if(flies[i].y < cursorY)
    {
        flies[i].y+=200/d;
    }
    
    if(flies[i].x > cursorX)
    {
        flies[i].x-=200/d;
    }
     if(flies[i].y > cursorY)
    {
        flies[i].y-=200/d;
    }
    }
    ctx.fillRect(flies[i].x, flies[i].y,10,10);
}
}
else if(currentWindow ==1)
{
    for(var i = -width/2; i < width/2; i+=15)
{
for(var j = -height/2; j < height/2; j+=15)
{
var d =(70)*(i+j)/Math.sqrt((width/2+i-cursorX)*(width/2+i-cursorX)+(height/2+j-cursorY)*(height/2+j-cursorY));
    var dj = (j/(i+j)) * d;
    var di = (i/(i+j)) * d;
ctx.fillRect(width/2+i-di,height/2+j-dj,3,3);
 
}
}

}
}
