var currentLocs = [];
function genNextPoint()
{
	var windowpts = [{x:0,y:350},{x:window.innerWidth,y:350},{x:0,y:window.innerHeight},{x:window.innerWidth,y:window.innerHeight}];
	var allpts = [];
	for(var i = 0; i < windowpts.length; i++)
	{
		allpts.push(windowpts[i]);
	}
	for(var i = 0; i < currentLocs.length; i++)
	{
		allpts.push(currentLocs[i]);
	}
	var dx = 5;
	var dy = 5;
	var pt={x: Math.floor(Math.random() * window.innerWidth),
		y: 350 + Math.floor(Math.random() *(window.innerHeight-350))};
	var distance = window.innerWidth+window.innerHeight;
	while(distance < (window.innerWidth + window.innerHeight)/15){
		var pt={x: Math.floor(Math.random() * window.innerWidth),
		y: 350 + Math.floor(Math.random() *(window.innerHeight-350))};
		var td = 10000;
		for(var i = 0; i < allpts.length; i++)
		{
			var dx = allpts[i].x - pt.x;
			var dy = allpts[i].y - pt.y;
			dx*=dx;
			dy*=dy;
			var d = Math.sqrt(dx+dy);
			if(d < td)
				td = d;
		}
		distance = td;
	}
	currentLocs.push(pt);
	return pt;
}

var Project = React.createClass({
	getInitialState: function()
	{
			var pt = genNextPoint();
			var color =255;// Math.floor(y/window.innerHeight * 255);
			this.timer = setInterval(this.tick,Math.floor(Math.random() * 65));
			return{
			dec:false,
			opac:0,			
			x:pt.x,
			y:pt.y,
			color:"rgb("+color+","+color+","+color+")"};
	},
    	onMouseEnterHandler: function(e){
		this.setState({hover:true});
		$(e.currentTarget).one("mouseleave",function(e){
			this.onMouseLeaveHandler();
		}.bind(this));
	},
    	onMouseLeaveHandler: function(){
	this.setState({hover:false});
	},
	tick: function()
	{
		if(this.state.hover)
			return;
		if(this.state.pause>=1)
		{
			this.setState({pause:this.state.pause-1});
			return;
		}
		var dec = this.state.dec;
		var x = this.state.x;
		var y = this.state.y;
		var opac = this.state.opac;
		if(dec){
			opac-=.0125;
			if(opac<=0){
				clearInterval(this.timer);
				this.timer = setInterval(this.tick,Math.floor(Math.random() * 200));
				var index = -1;
			       	for(var i = 0; i < currentLocs.length; i++)
				{
					if(currentLocs[i].x == this.state.x && currentLocs[i].y == this.state.y)
					{
						index = i;
					}
				}
				if(index != -1){
					currentLocs.splice(index,1);
				}
				var pt = genNextPoint();
				var color = 255;//Math.floor(y/window.innerHeight * 255);
				this.setState({x:pt.x,
						y:pt.y,
						color:"rgb("+color+","+color+","+color+")",
						dec:false});
			}
		}
		else{
			if(opac<1)
			{
				opac+=.0125;
			}
			if(opac>=1)
			{
				this.setState({pause:Math.floor(Math.random()*50),dec:true});
			}
		}
		this.setState({opac:opac});
	},
	render: function()
	{
	var styles ={
			opacity:this.state.opac,
		    	fontFamily:" 'Source Code Pro', sans-serif",
		    	fontWeight:"200",
		    	fontSize:"32px",
		    	color:this.state.color,
		    	textDecoration:"none",
			position: 'absolute',
			left:this.state.x.toString() + "px",
		   	top:this.state.y.toString()+'px'};
	if(this.state.hover)
	{
		styles.opacity = 1;
		styles.color = "rgb(50,50,255)";
	}
   	return (
		
		    React.createElement("a",{
			    onMouseEnter:this.onMouseEnterHandler,
		    style:styles,className:'Project noselect',href:this.props.href},this.props.text)
	   );
	}
});

var ProjectList = React.createClass({displayName:"ProjectList",
	render: function(){
		var projectNodes = this.props.projects.map(function(project)
			{
				return(
					<Project href={project.href} text={project.text}>
					</Project>
					);
			});
		return(
			<div className={"ProjectList noselect"}>
				{projectNodes}
			</div>
		      );
	}
});
var MenuItem = React.createClass({displayName:"MenuItem",
	getInitialState: function()
	{
		return {hover:false};
	},
    	mouseOver: function()
	{
		this.setState({hover:true});
	},
    	mouseOut: function()
	{
		this.setState({hover:false});
	},
    	mouseClick: function()
	{
		window.location.href = this.props.href;
	},
	render: function()
	{
		var border={
			borderTop:"solid white 1px",
			borderBottom:"solid white 1px",
    			cursor:"pointer"
		};
		var style={
					
					fontSize:32,
    					color:"#000",
					textDecoration:"none",
					fontFamily:" 'Source Code Pro', sans-serif",
					fontWeight:200
		};
		var hover={
    					color:"#fff",
					fontSize:32,
					textDecoration:"none",
					fontFamily:" 'Source Code Pro', sans-serif",
					fontWeight:200
		};
		if(this.state.hover)
		{
			style.color="#fff";
			style.background="#000";
			border.background="#000",
			border.borderTop = "solid black 1px";
			border.borderBottom = "solid black 1px";
		}
		return(
			<div style={border} onMouseOver={this.mouseOver} onMouseOut={this.mouseOut} onClick={this.mouseClick}>
			<a style={style} href={this.props.href}>{this.props.text}</a>
			</div>
			);
	}});
var MenuList = React.createClass({displayName:"MenuList",
	render: function(){
		var projectNodes = this.props.projects.map(function(project)
			{
				return(
					<MenuItem href={project.href} text={project.text}></MenuItem>
					);
			});
		return(
				<center>
				{projectNodes}
				</center>
		      );
	}
});
var Title = React.createClass({displayName:"Title",
	render: function()
	{
		var style={
					margin:"25px",
					fontSize:200,
					fontFamily:" 'Source Code Pro', sans-serif",
					fontWeight:200
		};
		    return (
			    <center><h1 className="noselect" style={style}>Luke Wood</h1></center>
			   );
	}
});

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
