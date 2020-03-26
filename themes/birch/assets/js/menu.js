document.getElementById("night-toggle").addEventListener("click", function() {
  var current = document.documentElement.getAttribute("data-theme");
  var next = null
  if (current == "dark") {
    next = "light";
  } else {
    next = "dark";
  }
  document.documentElement.setAttribute("data-theme", next);

  if(window.localStorage) {
    window.localStorage.setItem("preferredTheme", next);
  }
});
