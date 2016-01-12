
function initSnake(parent, style)
{
	var snake;
	var foodArr = [];
	var count = 0;
	var currentInter;
	var repaintInter;
	var gameIsOver = true;
	window.addEventListener('keydown',function(e) 
	{
    var key = e.keyCode ? e.keyCode : e.which;
	//UP
    if (key == 87) 
	{
		snake.setDir(0);
    }
	//RIGHT
	if(key == 68)
	{
		snake.setDir(1);
	}
	//LEFT
	if(key == 65)
	{
		snake.setDir(3);
	}
	//DOWN
	else if (key == 83) 
	{
		snake.setDir(2);
    }
	else if (key == 13)
	{
		spaceHit();
	}
	else if (key == 32)
	{
		spaceHit();
	}
	});
	var parentDiv = document.getElementById(parent);
	var snakeCanvas = document.createElement("canvas");
	snakeCanvas.setAttribute("width", "500px");
	snakeCanvas.setAttribute("height", "500px");

	var ctx = snakeCanvas.getContext("2d");
	ctx.fillStyle = "#FF0000";
	ctx.font="30px Georgia";
	ctx.fillText("SNAKE",200,200);
	ctx.fillText("WASD to control", 160,250);
	ctx.fillText("Space or Enter to Start", 160,300);
	var snakeContainer = document.createElement("div");
	if(!style)
	{
	snakeContainer.setAttribute("style","width: 520px; height: 520px;background-color: black;padding: 10px;");
	snakeCanvas.setAttribute("style","border: solid white 2px;");
	}
	snakeContainer.appendChild(snakeCanvas);
	parentDiv.appendChild(snakeContainer);
	
	function tick()
	{
		if(count > 10)
		{
		foodArr.push(new food());
		count = 0;
		}
		count++;
		snake.tick();
		checkCollisions();
	}
	function startGame()
	{
		gameIsOver = false;
		snake = new snakeConstructor();
		currentInter = setInterval(tick, 200);
		repaintInter = setInterval(repaint,50);
	}
	function checkCollisions()
	{
		snake.checkColl(foodArr);
	}
	function repaint()
	{
		ctx.fillStyle = "#000000";
		ctx.fillRect(0,0,500,500);
		ctx.fillStyle="#FF0000";
		for(var i = 0; i < foodArr.length; i++)
		{
			ctx.fillRect(foodArr[i].x *25,foodArr[i].y * 25,25,25);
		}
		snake.draw(ctx);
	}
	function food()
	{
		this.x = Math.floor(Math.random() * 20);
		this.y = Math.floor(Math.random() * 20);
	}
	function gameOver()
	{
		window.clearInterval(currentInter);
		window.clearInterval(repaintInter);
		foodArr = [];
		repaint();
		ctx.fillStyle = "#FF0000";
		ctx.font="30px Georgia";
		ctx.fillText("Game Over",170,200);
		ctx.fillText("Score: "+ snake.length, 170,250);
		ctx.fillText("Space or Enter to Restart", 120, 300);
		gameIsOver = true;
	}
	function spaceHit()
	{
		if(gameIsOver)
		{
		startGame();
		}
	}
	function snakeConstructor()
	{
		var direction = 1;
		var x = 0;
		var y = 0;
		var pastLocs = [];
		this.length = 0;
		var speed = 1;
		var hasGrown = false;
		this.checkColl = function(food)
		{
			for(var i = 0; i < food.length; i++)
			{
			if(x == food[i].x && y == food[i].y)
			{
			food.splice(i, 1);
			this.length = this.length+1;
			hasGrown = true;
			}
			}
			for(var j = 0; j < this.length;j++)
			{
				if(x == pastLocs[j].x && y == pastLocs[j].y)
				{
					gameOver();
				}
			}
		}
		this.tick = function()
		{
			if(hasGrown)
			{
				pastLocs.push(new pastLoc(x,y));
				hasGrown = false;
			}
			for(var i = 0; i < this.length; i++)
			{
				if(i != pastLocs.length-1)
				{
					pastLocs[i] = pastLocs[i+1];
				}
				else
				{
					pastLocs[i] = new pastLoc(x,y);
				}
			}
			if(direction == 1)
			{
			if(x < 19)
			{
			x += speed;
			}
			else{gameOver();}
			}
			else if(direction == 2)
			{
			if(y < 19)
			{
			y += speed;
			}else{gameOver();}
			}
			else if(direction == 3)
			{
			if(x > 0)
			{
			x -= speed;
			}else{gameOver();}
			}
			else if(direction == 0)
			{
			if(y >0)
			{
			y -= speed;
			}else{gameOver();}
			}
		}
		this.setDir = function(i)
		{
			direction = i;
		}
		this.draw = function(ctx)
		{
			ctx.fillStyle = "#ffff00";
			ctx.fillRect(x*25,y*25,25,25);
			for(var i = 0; i < this.length; i++)
			{
				ctx.fillRect(pastLocs[i].x*25,pastLocs[i].y*25,25,25);
			}
		}
		function pastLoc(nx,ny)
		{
			this.x = nx;
			this.y = ny;
		}
	}
	return snakeContainer;
}