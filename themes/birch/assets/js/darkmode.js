if (localStorage.getItem("preferredTheme") === null) {
  var theme = (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) ? "light" : "dark"
  localStorage.setItem("preferredTheme", theme);
}

function getTheme() {
  return window.localStorage.getItem("preferredTheme") || "dark";
}

document.documentElement.setAttribute("data-theme", getTheme());
