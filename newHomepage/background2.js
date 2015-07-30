var cursorX =0;
var cursorY = 0;
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
    this.xvel= 0;
    this.yvel = 0;
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
var click= false;
 canvas.addEventListener('click', function() {click = !click;}, false);

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
for(var i = 0; i < flies.length; i++)
{

var d =Math.sqrt((flies[i].x-cursorX)*(flies[i].x-cursorX)+(flies[i].y-cursorY)*(flies[i].y-cursorY));   
    if(click)
    {
        d = -d;
    }
    if(flies[i].x < cursorX)
    {
        flies[i].xvel+=30/d;
    }
     if(flies[i].y < cursorY)
    {
        flies[i].yvel+=30/d;
    }
    
    if(flies[i].x > cursorX)
    {
        flies[i].xvel-=30/d;
    }
     if(flies[i].y > cursorY)
    {
        flies[i].yvel-=30/d;
    }
    flies[i].x += flies[i].xvel;
    flies[i].y += flies[i].yvel;

    ctx.fillRect(flies[i].x, flies[i].y,10,10);
}
}
