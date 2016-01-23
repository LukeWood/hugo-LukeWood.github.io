
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function createTiles()
{
var height = window.innerHeight;
var width = window.innerWidth;
var foreground = document.getElementById("foreground");
var ySpeed = 200;
var tiles = [];

for(var i = -200;i< height + 201;i+=210)
{
for(var j = -200; j < width+201;j+=210)
{	
var tile = document.createElement("div");
var rNumber = Math.floor(Math.random()*25);
tile = initTile(tile,rNumber);

var positionInfo = "left: "+j+";top: "+i+";"+"background-color:"+getRandomColor()+";";
tile.setAttribute("style",positionInfo);
tiles.push(tile);
foreground.appendChild(tile);
}
}
tick();
setInterval(tick,12000);

function tick()
{
var max=0;
for(var i = 0; i < tiles.length; i++)
{
		var y=  tiles[i].offsetTop;
		if(max<y){max=y;}
		y = y+ySpeed;
		if(y>height+200){
			y = -200;
			tiles[i].style.display="none";
			setTimeRestore(tiles[i]);
		}
		tiles[i].style.top = y+"px";
}
}
function setTimeRestore(elem)
{
setTimeout(function(){elem.style.display = "block";},10000);
}
function initTile(tile,rNumber)
{
var initfunc = true;
if(rNumber==1)
{
var img = document.createElement("img");
img.setAttribute("src","img/Matlabicon.png");
img.setAttribute("class","projectimage");
tile.setAttribute("target","helloai");
tile.appendChild(img);
}
else if(rNumber ==2)
{
var img = document.createElement("img");
img.setAttribute("src","img/neuralnet.png");
img.setAttribute("class","projectimage");
tile.setAttribute("target","neuralrap");
tile.appendChild(img);
}
else if(rNumber ==3)
{
var img = document.createElement("img");
img.setAttribute("src","img/snake.png");
img.setAttribute("class","projectimage");
tile.setAttribute("target","onelinejsgames");
tile.appendChild(img);
}
else if(rNumber ==4)
{
var img = document.createElement("img");
img.setAttribute("src","img/starwarsjs.png");
img.setAttribute("class","projectimage");
initfunc = false;
(function(){tile.onclick = function(){askredirect('http://lukewoodsmu.github.io/StarWarsJS/')};})();
tile.appendChild(img);
}
else
{
tile.setAttribute("target","");
}
if(initfunc)
{
	(function(){
		var target = tile.getAttribute("target");
		tile.onclick = function()
		{
		toggle(target);	
		};
		})();
}
tile.setAttribute("class","project");
return tile;

}
}


var allPanelDescriptors = document.getElementsByClassName("projectdescriptor");
function toggle(targ)
{
	if(targ =="")
	{
	for(var i = 0; i < allPanelDescriptors.length; i++)
	{
		allPanelDescriptors[i].style.opacity = "0";
		allPanelDescriptors[i].setAttribute("shown","false");
		allPanelDescriptors[i].style.top = "-80vh";
		allPanelDescriptors[i].style.overflow="hidden";
	}
	}
	else
	{
	var target = document.getElementById(targ);
	var shown = target.getAttribute("shown");
	for(var i = 0; i < allPanelDescriptors.length; i++)
	{
		allPanelDescriptors[i].style.opacity = "0";
		allPanelDescriptors[i].setAttribute("shown","false");
		allPanelDescriptors[i].style.top = "-80vh";
		allPanelDescriptors[i].style.overflow="hidden";
	}
	if(shown === "true")
	{
		target.style.opacity = "0";
		target.setAttribute("shown","false");
		target.style.top = "-80vh";
		target.style.overflow="hidden";
	}
	else
	{
		target.style.opacity = "1";
		target.setAttribute("shown","true");
		target.style.top = "7vh";
		setTimeout(function(){target.style.overflow="auto";},1000);
	}
	}
}
function askredirect(target)
{
		window.location = target;

}

createTiles();
