var Project = React.createClass({
	getInitialState: function()
	{
			var y = 350 + Math.floor(Math.random() *(window.innerHeight-350));
			var color = Math.floor(y/window.innerHeight * 255);
			this.timer = setInterval(this.tick,Math.floor(Math.random() * 100));
			return{
			dec:false,
			opac:0,			
			x:Math.floor(Math.random() * window.innerWidth),
			y:y,
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
		var dec = this.state.dec;
		var x = this.state.x;
		var y = this.state.y;
		var opac = this.state.opac;
		if(dec){
			opac-=.0125;
			if(opac<=0){
				clearInterval(this.timer);
				this.timer = setInterval(this.tick,Math.floor(Math.random() * 200));
				var y = 350 + Math.floor(Math.random() *(window.innerHeight-350));
				var color = Math.floor(y/window.innerHeight * 255);
				this.setState({x:Math.floor(Math.random() * window.innerWidth),
						y:y,
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
				this.setState({dec:true});
			}
		}
		this.setState({opac:opac});
	},
	render: function()
	{
	var styles ={
			opacity:this.state.opac,
		    	fontFamily:"Rockwell, sans-serif",
		    	fontWeight:"bolder",
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
	render: function()
	{
		var projectNodes = this.props.projects.map(function(project)
			{
				return(
					<Project href={project.href} text={project.text}>
					</Project>
					);
			});
		return(
			<div className="ProjectList noselect">
				{projectNodes}
			</div>
		      );
	}
});
var Title = React.createClass({displayName:"Title",
	render: function()
	{
		var style={
					margin:"25px",
					fontSize:200,
					fontFamily:"Rockwell, sans-serif"
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
	}	
});
