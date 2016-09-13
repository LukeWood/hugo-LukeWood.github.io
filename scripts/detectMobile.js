if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	window.mobile = true;
	console.log("Rendering mobile version");
}
else
{
	window.mobile = false;
	console.log("Desktop version will be rendered");
}

