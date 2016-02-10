
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
var allTilesList = document.getElementsByClassName("projectimage");
for(var i = 0; i < allTilesList.length; i++)
{
allTilesList[i].parentNode.removeChild(element);
}
var height = window.innerHeight;
var width = window.innerWidth;
var foreground = document.getElementById("foreground");
var ySpeed = 200;
var tiles = [];
var currentNum = 1;
var alternate = false;
for(var i = -200;i< height + 201;i+=210)
{
for(var j = -200; j < width+201;j+=210)
{	
var tile = document.createElement("div");
if(alternate)
{
tile = initTile(tile,currentNum);
alternate = false;
}
else
{
	alternate = true;
	tile = initTile(tile,Math.floor(Math.random()*7)+1);
}
currentNum++;
if(currentNum > 7)
{
	currentNum = 1;
}
var positionInfo = "left: "+j+";top: "+i+";"+"background-color:"+getRandomColor()+";";
tile.setAttribute("style",positionInfo);
tiles.push(tile);
foreground.appendChild(tile);
}
}

function initTile(tile,rNumber)
{
var initfunc = true;
if(rNumber==1)
{
var img = document.createElement("img");
img.setAttribute("src","img/Matlabicon.png");
img.setAttribute("class","projectimage");
tile.setAttribute("target","stringrep");
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
img.setAttribute("src","img/snake.jpg");
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
else if(rNumber ==6)
{
var img = document.createElement("img");
img.setAttribute("src","img/wordSearch.jpg");
img.setAttribute("class","projectimage");
tile.setAttribute("target","wordsearcher");
tile.appendChild(img);
}
else if(rNumber ==7)
{
var img = document.createElement("img");
img.setAttribute("src","img/matrixpic.gif");
img.setAttribute("class","projectimage");
tile.setAttribute("target","linearlib");
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
			if(opactoset<.5){opactoset=.5;}
			opactoset = opactoset * opactoset*opactoset;
			allPanels[i].style.opacity = ""+opactoset;
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
	document.getElementById("projectDescriptor").style.top = "0";
	document.getElementById("projectPDF").setAttribute("src","pdf/"+targ+".pdf");
}
function askredirect(target)
{
		window.location = target;

}
window.addEventListener("resize",createTiles,false);
createTiles();
