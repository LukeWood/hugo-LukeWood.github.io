var currentLocs = [];

function genNextPoint()
{
	// var windowpts = [{x:0,y:350},{x:window.innerWidth,y:350},{x:0,y:window.innerHeight},{x:window.innerWidth,y:window.innerHeight}];
	// var allpts = [];
	// for(var i = 0; i < windowpts.length; i++)
	// {
	// 	allpts.push(windowpts[i]);
	// }
	// for(var i = 0; i < currentLocs.length; i++)
	// {
	// 	allpts.push(currentLocs[i]);
	// }
	// var dx = 5;
	// var dy = 5;s
	// var pt={x: Math.floor(Math.random() * window.innerWidth),
	// 	y: 350 + Math.floor(Math.random() *(window.innerHeight-350))};
	// var points = [];
	// for(var i; i < 10; i++)
	// {
		var pt={x: Math.floor(Math.random() * window.innerWidth),
		y: 350 + Math.floor(Math.random() *(window.innerHeight-350))};
		//points.push(pt);
	// }
	return pt;
	// var distance = window.innerWidth+window.innerHeight;
	// var finalpt = points[0];
	// for(var pt in points)
	// {
	// 	var td = 10000;
	// 	for(var i = 0; i < allpts.length; i++)
	// 	{
	// 		var dx = allpts[i].x - pt.x;
	// 		var dy = allpts[i].y - pt.y;
	// 		dx*=dx;
	// 		dy*=dy;
	// 		var d = Math.sqrt(dx+dy);
	// 		if(d < td)
	// 			td = d;
	// 	}
	// 	if(distance > td)
	// 	{
	// 		distance = td;
	// 		finalpt = pt;
	// 	}
	// }
	// currentLocs.push(finalpt);
	// return finalpt;
}

var Project = React.createClass({
	getInitialState: function()
	{
			var pt = genNextPoint();
			this.timer = setInterval(this.tick,Math.floor(Math.random() * 65));
			return{
			dec:false,
			opac:0,
			x:pt.x,
			y:pt.y};
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
				this.setState({x:pt.x,
						y:pt.y,
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
			padding:"10px",
		    	fontFamily:" 'Source Code Pro', sans-serif",
		    	fontWeight:"200",
		    	fontSize:"32px",
			backgroundColor:"rgba(255,255,255,.75",
			borderRadius: 16,
		    	color:"#222",
		    	textDecoration:"none",
			position: 'absolute',
			border:"solid #222 2px",
			left:this.state.x.toString() + "px",
		   	top:this.state.y.toString()+'px'};
	if(this.state.hover)
	{
		styles.opacity = "1";
                styles.zIndex = "1000";
		styles.color = "#bbb";
		styles.border= "solid #bbb 2px";
		styles.backgroundColor = "#222";
	}
   	return (
			<a style={styles} onMouseEnter={this.onMouseEnterHandler} className={'Project noselect'} href={this.props.href}>{this.props.text}</a>
	   );
	}
});


var ProjectList = React.createClass({displayName:"ProjectList",
	render: function(){
		var projectNodes = this.props.projects.map(function(project)
			{
				return(
					<Project key={project.key} href={project.href} text={project.text}>
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
window.Project = Project;
window.ProjectList = ProjectList;
