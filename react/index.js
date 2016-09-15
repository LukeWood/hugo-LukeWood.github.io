//imports
var ProjectList = window.ProjectList;
var MenuList = window.MenuList;

function main()
{
	if(window.mobile)
		renderMobile();
	else
		renderDesktop();
}

//Title is in index because its pretty simple and standalone
var Title = React.createClass({displayName:"Title",
	render: function()
	{
		var style={
					margin:"25px",
					fontSize:200,
					fontFamily:"'Orbitron', sans-serif",
					fontWeight:200
		};
		    return (
			    <center><h1 className="noselect" style={style}>Luke Wood</h1></center>
			   );
	}
});
function renderMobile()
{
	var butcont = document.getElementById("buttoncontainer");
	var txt = document.getElementById("menutext"); 
	var menu = document.getElementById("menuButton");
	txt.className = "mobilemenutext";
	txt.style.position = "relative";
	txt.style.display="inline-block";
	menu.style.display="inline-block";
	txt.style.marginLeft="0";
	menu.style.marginRight="0";
	$("#buttoncontainer").click(function(){
	Menu.activateMenu();
	if($("#menu").is(":visible"))
	{$("#menu").slideUp(650);$("#cover").slideUp(650)}
	else{$("#menu").slideDown(650);$("#cover").slideDown(650)}});
	butcont.setAttribute("style","width:100%;cursor:pointer");
	document.getElementById("menu").style.width="100%";
	var ctr = document.createElement("center");
	ctr.style.overflow="visible";
	ctr.appendChild(menu);
	ctr.appendChild(txt);
	
	butcont.appendChild(ctr);
	
	$.ajax({
		dataType:"json",
		url:"projects.json",
		success:function(data){
			ReactDOM.render(
			(
			 <div>
			<ProjectList projects={data}/>
			</div>
			),
			document.getElementById('content')
		);
			ReactDOM.render(
			(
			 <div>
				<MenuList projects={data}/>
			</div>
			),
			document.getElementById("inner"));},
		error:function(xhr,error){
			console.debug(xhr);console.debug(error);
		}	
	});
}

function renderDesktop()
{
	$.ajax({
		dataType:"json",
		url:"projects.json",
		success:function(data){
			ReactDOM.render(
			(
			 <div>

			 <Title/>
			<ProjectList projects={data}/>
			</div>
			),
			document.getElementById('content')
		);
			ReactDOM.render(
			(
			 <div>
				<MenuList projects={data}/>
			</div>
			),
			document.getElementById("inner"));},
		error:function(xhr,error){
			console.debug(xhr);console.debug(error);
		}	
	});
}

main();
