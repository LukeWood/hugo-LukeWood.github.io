document.addEventListener('DOMContentLoaded', function() {
show("page");
show("contentpanel");
startScroll();
document.getElementById("load").style.opacity = "0";
}, false);
function show(id) 
{
	document.getElementById(id).style.opacity = "1";
}
function hide(id) 
{
	document.getElementById(id).style.opacity = "0";
}
function startScroll()
{
	var contentpanel = document.getElementById("contentpanel");
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
			opactoset = opactoset * opactoset;
			allPanels[i].style.opacity = ""+opactoset;
		}
	}
	for(var i = 0; i < allPanels.length; i++)
	{
		(function(){
		var target = allPanels[i].getAttribute("target");
		allPanels[i].onclick = function()
		{
		toggle(target);	
		};
		})();
	}
}
var allPanelDescriptors = document.getElementsByClassName("projectdescriptor");
function toggle(targ)
{
	var target = document.getElementById(targ);
	var shown = target.getAttribute("shown");
	for(var i = 0; i < allPanelDescriptors.length; i++)
	{
		allPanelDescriptors[i].style.opacity = "0";
		allPanelDescriptors[i].setAttribute("shown","false");
	}
	if(shown === "true")
	{
		target.style.opacity = "0";
		target.setAttribute("shown","false");
	}
	else
	{
		target.style.opacity = "1";
		target.setAttribute("shown","true");
	}
}