document.addEventListener('DOMContentLoaded', function() {
show("page");
}, false);
function show(id) 
{
	document.getElementById(id).style.opacity = "1";
}



function askredirect(target)
{
	if(confirm("You are about to be redirected to the homepage of the selected project, continue?"))
	{
		window.location = target;
	}
}
