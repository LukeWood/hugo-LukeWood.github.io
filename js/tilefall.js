
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
var currentNum = 1;
for(var i = -200;i< height + 201;i+=210)
{
for(var j = -200; j < width+201;j+=210)
{	
var rNumber = Math.floor(Math.random()*3);

var tile = document.createElement("div");
if(rNumber ==1)
{
tile = initTile(tile,currentNum);
currentNum++;
if(currentNum > 5)
{
	currentNum = 1;
}
var positionInfo = "left: "+j+";top: "+i+";"+"background-color:"+getRandomColor()+";";
tile.setAttribute("style",positionInfo);
tiles.push(tile);
foreground.appendChild(tile);
}
}
}

tick();
setInterval(tick,10050);

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
img.setAttribute("src","img/starwarsjs.jpg");
img.setAttribute("class","projectimage");
tile.setAttribute("target","starwarsjs");
tile.appendChild(img);
}

else if(rNumber ==5)
{
var img = document.createElement("img");
img.setAttribute("src","img/nodejs.png");
img.setAttribute("class","projectimage");
tile.setAttribute("target","fileserver");
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

	var allPanels = document.getElementsByClassName("project");
	document.onmousemove = function(e)
	{
		var x = e.clientX;
		var y = e.clientY;
		var maxDistance = window.innerWidth*window.innerWidth + window.innerHeight*window.innerHeight;
		maxDistance = Math.sqrt(maxDistance);
		for(var i = 0; i < allPanels.length; i++)
		{
			var bounding = allPanels[i].getBoundingClientRect();
			var px = bounding.left + 100;
			var py = bounding.top + 100;
			var distance = Math.sqrt((px - x)*(px-x)+(py-y)*(py-y));
			var opactoset = 1-(distance / maxDistance);
			if(opactoset<.75){opactoset=.75;}
			opactoset = opactoset * opactoset*opactoset;
			allPanels[i].style.opacity = ""+opactoset;
		}
	}


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
