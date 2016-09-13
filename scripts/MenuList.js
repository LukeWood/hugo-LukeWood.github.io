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
					<MenuItem key={project.key} href={project.href} text={project.text}></MenuItem>
					);
			});
		return(
				<center>
				{projectNodes}
				</center>
		      );
	}
});

window.MenuList = MenuList;