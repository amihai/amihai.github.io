$(function(){
	const canvasWidth =  800;
	const canvasHeight = 400;
	var player1Height = 65;
	var player1Width = 40;
	
	var player1Left = document.getElementById("player1-left");
	var player1Right = document.getElementById("player1-right");
	
	var canvas = $("#game-canvas");
	ctx = canvas[0].getContext('2d');
	ctx.canvas.height = canvasHeight;
    ctx.canvas.width = canvasWidth;
	
	var player1LocationW = 10;
	var player1LocationH = 10;
	var player1Image = player1Right;

	ctx.drawImage(player1Image, player1LocationW, player1LocationH, player1Width, player1Height);
	
	document.onkeydown = function(e) {
		switch(e.which) {
			case 37: // left
				player1Image = player1Left;
				player1LocationW = player1LocationW - 10;
			break;

			case 38: // up
				player1LocationH = player1LocationH - 10;
			break;

			case 39: // right
				player1Image = player1Right;
				player1LocationW = player1LocationW + 10;
			break;

			case 40: // down
				player1LocationH = player1LocationH + 10;
			break;

			default: return; // exit this handler for other keys
		}
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		ctx.drawImage(player1Image, player1LocationW, player1LocationH, player1Width, player1Height);
		e.preventDefault(); // prevent the default action (scroll / move caret)
	};
	
});