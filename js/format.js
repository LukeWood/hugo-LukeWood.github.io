document.addEventListener('DOMContentLoaded', function() {
show("page",true);
document.getElementById("load").style.opacity = "0";
}, false);
function show(id) 
{
	document.getElementById(id).style.opacity = "1";
}