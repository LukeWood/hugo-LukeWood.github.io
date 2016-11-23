
var assets = document.getElementById("assets");
var root = document.getElementById("project_layout");

function create_asset(url,i){
  var img = document.createElement("img");
  img.src = url;
  img.setAttribute("id",i+"")
  assets.appendChild(img);
}


var rotation = document.createElement("a-animation");
rotation.setAttribute("attribute","rotation");
rotation.setAttribute("dur","40000");
rotation.setAttribute("easing","linear");
rotation.setAttribute("fill","forwards");
rotation.setAttribute("to","0 360 0");
rotation.setAttribute("repeat","indefinite");

$.getJSON("projects.json",function(data){
  for(var i = 0; i < data.length; i++){
    (function(){
      var project = data[i];
      create_asset(project.img,i);

      var el = document.createElement("a-box");
      el.setAttribute("src",project.img);
      el.setAttribute("scale","4 4 .1");
      el.addEventListener("click", function(){
          selectiveRedirect(project.href);
        },true
      );
      var t_rot = rotation.cloneNode(true);
      t_rot.setAttribute("begin",i * 1000);
      el.appendChild(rotation.cloneNode(true));

      root.appendChild(el);

  })();
  }

});
/*
$.getJSON("companies.json",function(data){

  for(var i = 0; i < data.length; i++){
    (function(){
      var project = data[i];
      var img = document.createElement("img");
      img.src = project.img;
      img.setAttribute("id",i+"")
      assets.appendChild(img);
      var el = document.createElement("a-box");
      el.setAttribute("src",project.img);
      el.setAttribute("scale","1 1 1");


      el.addEventListener("click", function(e){
          selectiveRedirect(project.href)
        });
        orbits[Math.floor(Math.random() * orbits.length)].appendChild(el);
  })();
  }

});
*/
function selectiveRedirect(href){
    var open_time = new Date();
    var result = window.confirm("You are about to be redirected to "+href+".")
    var close_time = new Date();
    if(result === true || close_time-open_time < 10){
      location.href = href;
    }
}
