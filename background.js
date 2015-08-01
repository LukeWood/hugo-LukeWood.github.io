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
    this.xin = xi;
    this.yin =yi;
}

var canvas = document.getElementById("myCanvas");
canvas.width = document.body.clientWidth; //document.width is obsolete
canvas.height = document.body.clientHeight;
var width = canvas.width;
var height = canvas.height;
var ctx = canvas.getContext("2d");
var flies = new Array();
window.onresize = function(event) 
{
canvas.width = document.body.clientWidth; //document.width is obsolete
canvas.height = document.body.clientHeight;
width =canvas.width;
height= canvas.height;
};
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
var initialized = false;
var previousInterval;
 canvas.addEventListener('click', function() {if(click<2){click++}else{click = 0};}, false);
function rightArrow()
{
        if(currentWindow == 0)
    {
    clearInterval(previousInterval);
    }
currentWindow +=1;
    initialized = false;

}
function leftArrow()
{
        if(currentWindow == 0)
    {
    clearInterval(previousInterval);
    currentWindow = 2;
    }
    else
    {
currentWindow -=1;
    }

    initialized = false;
}
function paintScreen1()
{
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,width,height);

ctx.fillStyle = "rgb("+r+","+g+","+b+")";

    for(var i = 0; i < flies.length; i++)
{

var d =Math.sqrt((flies[i].x-cursorX)*(flies[i].x-cursorX)+(flies[i].y-cursorY)*(flies[i].y-cursorY));   

    if(d < 200)
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
    else
    {
        if((flies[i].x - flies[i].xin != 0) && (flies[i].y - flies[i].yin !=0))
        {
    var d2 =Math.sqrt(((flies[i].x-flies[i].xin)*(flies[i].x-flies[i].xin))+((flies[i].y-flies[i].yin)*(flies[i].y-flies[i].yin)));   
    if(flies[i].x < flies[i].xin)
    {
        flies[i].x+=4;
    }
     if(flies[i].y < flies[i].yin)
    {
        flies[i].y+=4;
    }
    
    if(flies[i].x > flies[i].xin)
    {
        flies[i].x-=4;
    }
     if(flies[i].y > flies[i].yin)
    {
        flies[i].y-=4;
    }
      }
    }
    ctx.fillRect(flies[i].x, flies[i].y,10,10);
}
}
function paintScreen2()
{
        ctx.fillStyle = "#000000";
ctx.fillRect(0,0,width,height);

ctx.fillStyle = "rgb("+r+","+g+","+b+")";

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
function incrementColor()
{
    if(a)
{
    if(r >0)
    {
        r-=5;
    }
    else
    {
        a = false;
    }
}
else
{
    if(r < 250)
    {
    r+=5;
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
        b-=5;
    }
    else
    {
        c = false;
    }
}
else
{
    if(b < 250)
    {
    b+=5;
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
        g-=5;
    }
    else
    {
        z = false;
    }
}
else
{
    if(g < 250)
    {
    g+=5;
    }
    else
    {
        z = true;
    }
}
}

function repaint()
{
    if(currentWindow == 0)
    {
        incrementColor();
        paintWelcomeScreen();
    }
    else if(currentWindow == 1)
    {
        incrementColor();
        paintScreen2(); 

    }

    else if(currentWindow ==2)
    {
        incrementColor();
        paintScreen1();

    }
    else
    {
        currentWindow=0;
    }
}
function paintWelcomeScreen()
{
    if(!initialized)
    {
    var banner = new Banner();
    banner.initialize(canvas);
    initialized = true;
}
}
function WormHoleScreen()
{
    var canvas;
    var context;

    this.initialize = function(canvas){
    canvas = canvas;
    context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    };
};
function Banner(){

  var keyword = "Luke";
  var secondKeyword = "Wood"
    var canvas;
    var context;
    
    var bgCanvas;
    var bgContext;
    
    var denseness = 10;
    
    //Each particle/icon
    var parts = [];
    
    var mouse = {x:-100,y:-100};
    var mouseOnScreen = false;
    
    var itercount = 0;
    var itertot = 40;
    
    this.initialize = function(canvas_id){
        canvas = canvas_id
        context = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        bgCanvas = document.createElement('canvas');
        bgContext = bgCanvas.getContext('2d');
        
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
    
        document.addEventListener('mousemove', MouseMove, false);
        document.addEventListener('mouseout', MouseOut, false);
            
        start();
    }
    
    var start = function(){
            
        bgContext.fillStyle = "#000000";
        bgContext.font = '300px impact';
        bgContext.fillText(keyword, width/2 - bgContext.measureText(keyword).width/2, height/2);
        bgContext.fillText(secondKeyword, width/2 - ctx.measureText(secondKeyword).width/2-300, height/2 + 300);
        
        clear();    
        getCoords();
    }
    
    var getCoords = function(){
        var imageData, pixel, height, width;
        
        imageData = bgContext.getImageData(0, 0, canvas.width, canvas.height);
        
        // quickly iterate over all pixels - leaving density gaps
        for(height = 0; height < bgCanvas.height; height += denseness){
            for(width = 0; width < bgCanvas.width; width += denseness){   
               pixel = imageData.data[((width + (height * bgCanvas.width)) * 4) - 1];
                  //Pixel is black from being drawn on. 
                  if(pixel == 255) {
                    drawCircle(width, height);
                  }
            }
        }
        
       previousInterval=  setInterval( update, 40 );
    }
    
    var drawCircle = function(x, y){
        
        var startx = (Math.random() * canvas.width);
        var starty = (Math.random() * canvas.height);
        
        var velx = (x - startx) / itertot;
        var vely = (y - starty) / itertot;  
        
        parts.push(
            {c: '#' + (Math.random() * 0x949494 + 0xaaaaaa | 0).toString(16),
             x: x, //goal position
             y: y,
             x2: startx, //start position
             y2: starty,
             r: true, //Released (to fly free!)
             v:{x:velx , y: vely}
            }
        )
    }
        
    var update = function(){
        if(currentWindow==0)
        {
        var i, dx, dy, sqrDist, scale;
        itercount++;
        clear();
        for (i = 0; i < parts.length; i++){
                    
            //If the dot has been released
            if (parts[i].r == true){
                //Fly into infinity!!
                parts[i].x2 += parts[i].v.x;
                parts[i].y2 += parts[i].v.y;
            //Perhaps I should check if they are out of screen... and kill them?
            }
            if (itercount == itertot){
                parts[i].v = {x:(Math.random() * 6) * 2 - 6 , y:(Math.random() * 6) * 2 - 6};
                parts[i].r = false;
            }
            
    
            //Look into using svg, so there is no mouse tracking.
            //Find distance from mouse/draw!
            dx = parts[i].x - mouse.x;
            dy = parts[i].y - mouse.y;
            sqrDist =  Math.sqrt(dx*dx + dy*dy);
            
            if (sqrDist < 20){
                parts[i].r = true;
            }           

            //Draw the circle
            context.fillStyle = parts[i].c;
            context.beginPath();
            context.arc(parts[i].x2, parts[i].y2, 4 ,0 , Math.PI*2, true);
            context.closePath();
            context.fill(); 
                
        }   
    }
    }
    
    var MouseMove = function(e) {
        if (e.layerX || e.layerX == 0) {
            //Reset particle positions
            mouseOnScreen = true;
            
            
            mouse.x = e.layerX - canvas.offsetLeft;
            mouse.y = e.layerY - canvas.offsetTop;
        }
    }
    
    var MouseOut = function(e) {
        mouseOnScreen = false;
        mouse.x = -100;
        mouse.y = -100; 
    }
    
    //Clear the on screen canvas
    var clear = function(){
        context.fillStyle = '#333';
        context.beginPath();
        context.rect(0, 0, canvas.width, canvas.height);
        context.closePath();
        context.fill();
    }
}
