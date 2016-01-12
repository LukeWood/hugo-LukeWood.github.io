//NAME OF PARENT DIV
function initTicTacToe(parentContainerName, style)
{
	var currentTurn = "X";
	var xVictories = 0;
	var oVictories = 0;
	var xWins;
	var oWins;
	var lastWinnerDisplay;
	var lastWinner = "";
	var ticVic = false;
	var currentTurnDisplay = "X";
	var ticTacToeGame = document.createElement("div");
	ticTacToeGame.setAttribute("class","ticTacToeBoard");
	var leftSection = document.createElement("div");
	leftSection.setAttribute("style", "display:inline-block;float:left;");
	var rightSection = document.createElement("div");
	var scoreBoard = createScoreBoard(style);
	rightSection.appendChild(scoreBoard);
	rightSection.setAttribute("style", "display:inline-block;float:right;");
	if(!style)
	{
		ticTacToeGame.setAttribute("style","border-radius: 10px; border: solid 2px black;display:inline-block;padding: 20px;margin: 20px; background: white;");
	}
	var parentContainer = document.getElementById(parentContainerName);
	var pieces = createTicTacToeBoard(style);
	var clearButton = document.createElement("div");
	clearButton.setAttribute("id","ticTacToeClearButton");
	if(!style)
	{
			clearButton.setAttribute("style","margin-top: 10px;width: 200px; height: 30px; font-family: Rockwell; font-size: 20px; background-color: #D0D0D0; cursor: pointer;");
	}
	clearButton.addEventListener("click", clearBoard);
	clearButton.innerHTML="Clear";

	for(var i = 0; i < 9; i++)
	{	
	(function(t){
	pieces[t].addEventListener("click",function(){takeTurn(t);});
	})(i)
		if(i%3 == 0)
		{
			leftSection.appendChild(document.createElement("br"));
		}
		leftSection.appendChild(pieces[i]);
	}
	leftSection.appendChild(document.createElement("br"));
	leftSection.appendChild(clearButton);
	ticTacToeGame.appendChild(leftSection);
	ticTacToeGame.appendChild(rightSection);
	parentContainer.appendChild(ticTacToeGame);
	
	function createTicTacToeBoard(style)
	{
	var arr = [];
	for(var i = 0; i < 9; i++)
	{

		var temp = document.createElement("div");
		temp.setAttribute("class", "ticTacToeBoardPiece");
		if(!style)
		{
			temp.setAttribute("style","width: 50px; height: 50px; background-color: white; border: solid 2px black;border-radius: 4px; margin: 5px; display: inline-block;	vertical-align:top;");
		}
		arr.push(temp);
	}
	return arr;
	}
	function takeTurn(i)
	{
		if(!ticVic)
		{
		if(pieces[i].innerHTML ==="")
		{
		pieces[i].innerHTML = currentTurn;
		if(currentTurn === "X"){currentTurn = "O"}
		else{currentTurn = "X"}
		checkVictory();
		}
		}
	}
	function clearBoard()
	{
		ticVic = false;
		for(var i = 0; i < 9; i++)
		{
			pieces[i].innerHTML = "";
		}
	}

	function createScoreBoard(a)
	{
		var scoreBoardDiv = document.createElement("div");
		scoreBoardDiv.setAttribute("id", "ticTactoeScoreboard");
		xWins = document.createElement("div");
		oWins = document.createElement("div");
		xWins.setAttribute("class", "ticTacToeWinsDisplay");
		oWins.setAttribute("class", "ticTacToeWinsDisplay");

		currentTurnDisplay = document.createElement("div");
		currentTurnDisplay.setAttribute("id", "ticTacToeCurrentTurnDisplay");
		var header = document.createElement("div");
		lastWinnerDisplay = document.createElement("div");
		lastWinnerDisplay.setAttribute("id","ticTacToeLastWinnerDisplay");
		lastWinnerDisplay.innerHTML = "Last Winner: ";
		header.setAttribute("id","ticTacToeScoreboardHeader");
		header.innerHTML = "Scoreboard";
		if(!a)
		{
			header.setAttribute("style","font-family: Rockwell; font-size: 20px;font-weight: bold;");
			scoreBoardDiv.setAttribute("style","display:inline-block; padding: 10px; margin:10px; border: solid black 2px; border-radius: 5px;");
			xWins.setAttribute("style","font-family: Rockwell; font-size: 15px;font-weight: bold;");
			oWins.setAttribute("style","font-family: Rockwell; font-size: 15px;font-weight: bold;");
			currentTurnDisplay.setAttribute("style","font-family:Courier, monospace; font-size: 15px;font-weight: bolder;");
			lastWinnerDisplay.setAttribute("style","font-family:Courier, monospace; font-size: 15px;font-weight: bolder;");
		}
		updateWins();
		scoreBoardDiv.appendChild(header);
		scoreBoardDiv.appendChild(xWins);
		scoreBoardDiv.appendChild(oWins);
		scoreBoardDiv.appendChild(document.createElement("br"));
		scoreBoardDiv.appendChild(currentTurnDisplay);
		scoreBoardDiv.appendChild(document.createElement("br"));
		scoreBoardDiv.appendChild(lastWinnerDisplay);

		return scoreBoardDiv;
	}
	function updateWins()
	{
		var xText = "X Wins: "+ xVictories;
		var yText = "Y Wins: "+ oVictories;
		xWins.innerHTML = xText;
		oWins.innerHTML = yText;
		currentTurnDisplay.innerHTML = "Current Turn: "+ currentTurn;
	}
	function checkVictory()
	{
	if(!ticVic)
	{
	if(pieces[0].innerHTML === pieces[4].innerHTML && pieces[0].innerHTML === pieces[8].innerHTML&& !(pieces[0].innerHTML === ""))
	{
	victory(pieces[0].innerHTML);
	}
	if(pieces[0].innerHTML === pieces[1].innerHTML && pieces[0].innerHTML === pieces[2].innerHTML&& !(pieces[0].innerHTML === ""))
	{
	victory(pieces[0].innerHTML);
	}
	if(pieces[0].innerHTML === pieces[3].innerHTML && pieces[0].innerHTML === pieces[6].innerHTML&& !(pieces[0].innerHTML === ""))
	{
	victory(pieces[1].innerHTML);
	}
	if(pieces[1].innerHTML === pieces[4].innerHTML && pieces[1].innerHTML === pieces[7].innerHTML && !(pieces[1].innerHTML === ""))
	{
	victory(pieces[1].innerHTML);
	}
	if(pieces[2].innerHTML === pieces[4].innerHTML && pieces[2].innerHTML === pieces[6].innerHTML&& !(pieces[2].innerHTML === ""))
	{
	victory(pieces[2].innerHTML);
	}
	if(pieces[2].innerHTML === pieces[5].innerHTML && pieces[2].innerHTML === pieces[8].innerHTML&& !(pieces[2].innerHTML === ""))
	{
	victory(pieces[2].innerHTML);
	}
	if(pieces[3].innerHTML === pieces[4].innerHTML && pieces[3].innerHTML === pieces[5].innerHTML&& !(pieces[3].innerHTML === ""))
	{
	victory(pieces[3].innerHTML);
	}
	if(pieces[6].innerHTML === pieces[7].innerHTML && pieces[6].innerHTML === pieces[8].innerHTML&& !(pieces[6].innerHTML === ""))
	{
	victory(pieces[6].innerHTML);
	}
		}
	updateWins();
	}
function victory(a)
{
	if(!ticVic)
	{
	ticVic = true;
	if(a === "X"){xVictories++; lastWinner = "X";}
	else if(a ==="O"){oVictories++;lastWinner = "O";}
	}
	lastWinnerDisplay.innerHTML = "Last Winner: "+ lastWinner;
}
	return ticTacToeGame;
}
