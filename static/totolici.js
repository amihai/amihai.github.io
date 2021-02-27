$(function(){
	const canvasWidth =  800;
	const canvasHeight = 400;
	var player1Height = 68;
	var player1Width = 41;
	var jumpingInterval = 5;
	var runningInterval = 200;
	var environmentInterval = 10;
	var roofLine = 60;
	var horizontalLine = 300; 
	var player1LocationW = 100;
	var jumpPace = 2;
	var player1InitialLocationH = horizontalLine - player1Height;
	var player1LocationH = player1InitialLocationH;
	var environmentPosition = 0;
	
	var player1_1 = document.getElementById("player1-1");
	var player1_2 = document.getElementById("player1-2");
	var player1_jump = document.getElementById("player1-jump");
	var soil = document.getElementById("soil");
	
	var canvas = $("#game-canvas");
	ctx = canvas[0].getContext('2d');
	ctx.canvas.height = canvasHeight;
    ctx.canvas.width = canvasWidth;
	
	
	var player1Image = player1_1;

	drawEnvironment();
	ctx.drawImage(player1Image, player1LocationW, player1LocationH, player1Width, player1Height);
	
	
	
	var currentPosition = 1;
	var up = false;
	var down = false;
	
	function drawEnvironment() {
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		// draw horizon
		var soilStarting = environmentPosition % canvasWidth; 
		ctx.drawImage(soil, -soilStarting, horizontalLine + 1, canvasWidth, canvasHeight - horizontalLine);
		ctx.drawImage(soil, canvasWidth-soilStarting, horizontalLine + 1, canvasWidth, canvasHeight - horizontalLine);
	}
	
	// Environment cicle
	window.setInterval(function () {
		environmentPosition = environmentPosition+1;
	}, environmentInterval);
	
	// Jump cicle
	window.setInterval(function () {
		var jump = up || down;
		if (jump) {
			if (up) {
				player1Image = player1_jump;
				player1LocationH = player1LocationH - jumpPace;
				if (player1LocationH <= roofLine) {
					up = false;
					down = true;
				}
			} else if (down) {
				player1Image = player1_jump;
				player1LocationH = player1LocationH + jumpPace;
				if (player1LocationH >= player1InitialLocationH) {
					player1LocationH = player1InitialLocationH;
					down = false;
				}
			} 		
			drawEnvironment();
			ctx.drawImage(player1Image, player1LocationW, player1LocationH, player1Width, player1Height);
		}
	}, jumpingInterval);
	
	// Running cicle
	window.setInterval(function () {
		var jump = up || down;
		if (!jump) {
			if (currentPosition == 1) {
				player1Image = player1_2;
				currentPosition = 2;
			} else if (currentPosition == 2) {
				player1Image = player1_1;
				currentPosition = 1;
			} 		
			drawEnvironment();
			ctx.drawImage(player1Image, player1LocationW, player1LocationH, player1Width, player1Height);
		}
	}, runningInterval);
	
	document.onkeydown = function(e) {
		if (!down) {
			up = true;
		}
	};
	
});