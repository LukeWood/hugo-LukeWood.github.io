document.addEventListener('DOMContentLoaded', function() {
show("page");
}, false);
function show(id) 
{
	document.getElementById(id).style.opacity = "1";
}
function hideDescriptor()
{
	document.getElementById("projectDescriptor").style.top = "-110%";
}