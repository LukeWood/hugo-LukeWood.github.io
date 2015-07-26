//PARRALAX JAVASCRIPT

	var isec1 = document.getElementById('imagesec1');
	var isec2 = document.getElementById('imagesec2');

	isec1.style.backgroundPosition = "50% " + -(window.pageYOffset/1.5) + 'px';

	var contentpic1 = document.getElementById('contentpic1');
	var maintitle1 = document.getElementById('maintitle1');
	var solidsec2contentpane = document.getElementById("solidsec2contentpane");
	var githublogo = document.getElementById('githubcontainer');
	var aboutme = document.getElementById('aboutme');
	var imagesec1 = document.getElementById('imagesec1');
	var contactInfo1 = document.getElementById('contactInfo1');
	var contactInfo2 = document.getElementById('contactInfo2');
	var languages = document.getElementsByClassName("languages");
	for(var i = 0; i < languages.length; i++)
	{
		languages[i].style.bottom=  (-window.pageYOffset + 10000) + 'px';
	}
		//contentpic1.style.top =-((window.pageYOffset/2) -100)+ 'px';
			contentpic1.style.bottom =(window.pageYOffset + 10)+ 'px';

		maintitle1.style.bottom = (window.pageYOffset/2) + 'px';
var lastPos = 0;
function parralax()
{
	for(var i = 1; i < languages.length+1; i++)
	{
		languages[i-1].style.bottom=  -((i*200)-(2*(window.pageYOffset))) + 'px';
	}
	solidsec2contentpane.style.bottom =  (-( -(2*window.pageYOffset) +2600)) + 'px';
	if((-( -(2*window.pageYOffset) +2600)) >0)
	{
		imagesec1.style.zIndex = "5";
	}
	else
	{
		imagesec1.style.zIndex = "3";
	}

	isec1.style.backgroundPosition = "50% " + -((window.pageYOffset/2) +100)+ 'px';
	//contentpic1.style.top =-((window.pageYOffset) -100)+ 'px';
	contentpic1.style.bottom =(window.pageYOffset + 10)+ 'px';

			maintitle1.style.bottom = (window.pageYOffset/2) + 'px';

	isec2.style.backgroundPosition = "50% " + -((window.pageYOffset/2) + 1050 -1500) + 'px';

		githublogo.style.top =(350-((2*window.pageYOffset/3) -900))+ 'px';
		aboutme.style.top =(350-((2*window.pageYOffset/3) -900))+ 'px';

		contactInfo1.style.top =(650-((window.pageYOffset) -1350))+ 'px';
	lastPos = window.pageYOffset;

}
window.addEventListener("scroll",parralax,false);