var projects = [{"href":"http://lukewoodsmu.github.io/EarthMeteors/",
		"text":"Earth Data Visualization"},
		{"href":"https://lukewoodsmu.github.io/pyrap/",
		"text":"Neural Network Rapper"}
		}
		];		
ReactDOM.render(
	<ProjectList projects={projects}/>,
	document.getElementById('content')
);
