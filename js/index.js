
var root = document.getElementById("project_layout");
var assets = document.getElementById("assets");
$.getJSON("projects.json",function(data){

  for(var i = 0; i < data.length; i++){
    (function(){var project = data[i];
    var img = document.createElement("img");
    img.src = project.img;
    img.setAttribute("id",i+"")
    assets.appendChild(img);
    var el = document.createElement("a-box");
    el.setAttribute("src",project.img);
    el.setAttribute("scale","1.3 1.3 1.3");
    el.addEventListener("click", function(){

        selectiveRedirect(project.href);

      },true
    );
    root.appendChild(el);
  })();
  }

});
var root_company = document.getElementById("company_layout");
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
      root_company.appendChild(el);
  })();
  }

});

function selectiveRedirect(href){
    var open_time = new Date();
    var result = window.confirm("You are about to be redirected to "+href+".")
    var close_time = new Date();
    if(result === true || close_time-open_time < 10){
      location.href = href;
    }else{
      e.preventDefault();
    }
}
