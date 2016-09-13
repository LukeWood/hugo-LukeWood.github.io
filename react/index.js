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
