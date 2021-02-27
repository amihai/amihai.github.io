$(function(){
	const canvasWidth =  800;
	const canvasHeight = 400;
	var player1Height = 68;
	var player1Width = 41;
	var interval = 5;
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
	
	window.setInterval(function () {
		environmentPosition = environmentPosition+1;
		
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
		}
		if (!jump) {
			if (environmentPosition % 30 == 0) {
				if (currentPosition == 1) {
					player1Image = player1_2;
					currentPosition = 2;
				} else if (currentPosition == 2) {
					player1Image = player1_1;
					currentPosition = 1;
				}
			}	
		}
		drawEnvironment();
	    ctx.drawImage(player1Image, player1LocationW, player1LocationH, player1Width, player1Height);
		
	}, interval);
	
	function jump(e) {
		if (!down) {
			up = true;
		}
		e.preventDefault();
	}
	
	document.onkeydown = jump;
	document.touchstart = jump;
	
});