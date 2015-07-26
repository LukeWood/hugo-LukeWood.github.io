function moveOff(i)
{
	//OPENING PAGE JAVASCRIPT
	document.getElementById('topHome').className += ' upscreen';
	document.getElementById('bottomHome').className += ' downscreen';
	document.getElementById('leftbuffer').className += ' moveoffLeft';
	document.getElementById('rightbuffer').className += ' moveoffRight';
	if(i ==1)
	{
	document.getElementById('softwarepage').className+=' visible';
	}
	else
	{
		document.getElementById('tutoringpage').className+=' visible';
	}
	setTimeout(function () {
		document.getElementsByTagName("body")[0].setAttribute("class", "scrollablebody");},1500);
	setTimeout(function () {	
	document.getElementById('topHome').className += ' hidden';
	document.getElementById('bottomHome').className += ' hidden';

}, 3500);
}