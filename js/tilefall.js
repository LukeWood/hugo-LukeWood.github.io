
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
var xSpeed = 0;
var ySpeed = 1;
var tiles = [];
if(height > width)
{
	xSpeed = 1;
	ySpeed= 0;
}

for(var i = -200;i< height + 201;i+=210)
{
for(var j = -200; j < width+201;j+=210)
{	
var tile = document.createElement("div");
var rNumber = Math.floor(Math.random()*20);
tile = initTile(tile,rNumber);

var positionInfo = "left: "+j+";top: "+i+";"+"background-color:"+getRandomColor()+";";
tile.setAttribute("style",positionInfo);

		(function(){
		var target = tile.getAttribute("target");
		tile.onclick = function()
		{
		toggle(target);	
		};
		})();

tiles.push(tile);
foreground.appendChild(tile);
}
}
setInterval(tick,100);

function tick()
{
for(var i = 0; i < tiles.length; i++)
{

}
}

function initTile(tile,rNumber)
{
if(rNumber==1)
{
var img = document.createElement("img");
img.setAttribute("src","img/Matlabicon.png");
img.setAttribute("class","projectimage");
tile.setAttribute("target","helloai");
tile.appendChild(img);
}
else
{
tile.setAttribute("target","");
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

createTiles();
