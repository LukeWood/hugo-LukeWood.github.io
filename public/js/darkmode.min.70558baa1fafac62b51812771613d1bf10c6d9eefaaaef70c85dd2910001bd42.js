window.addEventListener("load",function(){if(localStorage.getItem("preferredTheme")===null){var theme=(window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches)?"light":"dark"
localStorage.setItem("preferredTheme",theme);}
function getTheme(){return window.localStorage.getItem("preferredTheme")||"dark";}
document.documentElement.setAttribute("data-theme",getTheme());document.getElementById("night-toggle").addEventListener("click",function(){var current=document.documentElement.getAttribute("data-theme");var next=null
if(current=="dark"){next="light";}else{next="dark";}
document.documentElement.setAttribute("data-theme",next);if(window.localStorage){window.localStorage.setItem("preferredTheme",next);}});})