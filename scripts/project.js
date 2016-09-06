var Project = React.createClass({
	getInitialState: function()
	{
			this.timer = setInterval(this.tick,Math.floor(Math.random() * 200));
			return{
			dec:false,
			opac:0,			
			x:Math.floor(Math.random() * window.innerWidth),
			y:Math.floor(Math.random() * window.innerHeight)};
	},
	tick: function()
	{
		var dec = this.state.dec;
		var x = this.state.x;
		var y = this.state.y;
		var opac = this.state.opac;
		if(dec){
			opac-=.0125;
			if(opac<=0){
				clearInterval(this.timer);
				this.timer = setInterval(this.tick,Math.floor(Math.random() * 200));
				this.setState({x:Math.floor(Math.random() * window.innerWidth),
						y:Math.floor(Math.random() * window.innerHeight),
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
   	return (
		
		    React.createElement("a",{
		    style:
		    {
			opacity:this.state.opac,
		    	fontFamily:"Rockwell, sans-serif",
		    	fontWeight:"bolder",
		    	fontSize:"32px",
		    	color:"white",
		    	textDecoration:"none",
			position: 'absolute',
			left:this.state.x.toString() + "px",
		   	top:this.state.y.toString()+'px'
		    }
	    	,className:'Project',href:this.props.href},this.props.text)
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
			<div className="ProjectList">
				{projectNodes}
			</div>
		      );
	}
});

