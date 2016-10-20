var currentLocs = [];


function genNextPoint()
{

		var best_pt = {x: Math.floor(Math.random() * window.innerWidth)-50,
		y: 350 + Math.floor(Math.random() *(window.innerHeight-400))};

		var best_dist = 100000;

		for(var b = 0; b <  10; b++){

			var pt={x: Math.floor(Math.random() * window.innerWidth)-50,
			y: 350 + Math.floor(Math.random() *(window.innerHeight-400))};

			var min_dist = 100000;
			for(var i = 0; i < currentLocs.length; i++)
			{
					var t_dist = Math.pow(pt.x - currentLocs[i].x,2) + Math.pow(pt.y - currentLocs[i].y,2);
					if(t_dist < min_dist){
							t_dist = min_dist;
					}
			}
			if(min_dist < best_dist){
				best_dist = min_dist;
				best_pt = pt;
			}
		}

		for(var i = 0; i <  4; i++){
			for(var j = 0; j < 4; j++){
				var pt={x: Math.floor(i/10 * window.innerWidth)-50,
				y: 350 + Math.floor(j/10 *(window.innerHeight-400))};

				var min_dist = 100000;
				for(var c = 0; c < currentLocs.length; c++)
				{
						var t_dist = Math.pow(pt.x - currentLocs[c].x,2) + Math.pow(pt.y - currentLocs[c].y,2);
						if(t_dist < min_dist){
								t_dist = min_dist;
						}
				}
				if(min_dist < best_dist){
					best_dist = min_dist;
					best_pt = pt;
				}
			}
		}

		currentLocs.push(best_pt);

		return best_pt;
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
				this.timer = setInterval(this.tick,Math.floor(Math.random() * 125));
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
