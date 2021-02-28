var playerName = "Andreea & Mihaela";

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
	var lives = 5;
	
	var player1_1 = document.getElementById("player1-1");
	var player1_2 = document.getElementById("player1-2");
	var player1_jump = document.getElementById("player1-jump");
	var player1_dead = document.getElementById("player1-dead");
	var soil = document.getElementById("soil");
	var portal1 = document.getElementById("portal-1");
	var portal2 = document.getElementById("portal-2");
	var portal3 = document.getElementById("portal-3");
	var portal4 = document.getElementById("portal-4");
	var firstObstacleIndex = 0;
	var obstaclesPerScreen = 4;
	var obstacles = []; 
	
	function getRandomObstacle() {
		var rand = Math.floor((Math.random() * 7) + 1);
		if (rand == 1) {
			return portal1;
		} else if (rand == 2) {
			return portal2;
		} else if (rand == 3) {
			return portal3;
		} else if (rand == 4) {
			return portal4;
		} else {
			return undefined;
		}
	}
	
	// generate initial list of obstacles
	for (var i = 0; i < 10; i++) {
		obstacles.push(getRandomObstacle());
	}
	
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
	
	var lastObstacoleHit = -1;
	function isHit() {
		var bottomLeftCornerW = player1LocationW + player1Width;
		var bottomLeftCornerH = player1LocationH + player1Height;
		for (var indexObstacle = firstObstacleIndex; indexObstacle < firstObstacleIndex + obstaclesPerScreen; indexObstacle++) {
			if (lastObstacoleHit == indexObstacle) {
				continue;
			}
			var obstacle = obstacles[indexObstacle];
			var obstacleStarting = indexObstacle * 200 - environmentPosition;
			if (obstacle) {
				var obstacleStartW = obstacleStarting;
				var obstacleStartH = horizontalLine - obstacle.height;
				var obstacleEndW = obstacleStartW + obstacle.width;
				var obstacleEndH = obstacleStartH + obstacle.height;
				if (bottomLeftCornerW >= obstacleStartW && bottomLeftCornerW <= obstacleEndW
					&& bottomLeftCornerH >= obstacleEndH && bottomLeftCornerH <= obstacleEndH) {
						lives = lives - 1; 
						lastObstacoleHit = indexObstacle;
					}
			}
		}
	}
	
	
	var isDeadImage = false;
	function drawGameOver() {
		ctx.font = "100px Regular semi-serif";
		ctx.fillStyle = "#DF1313";
		ctx.fillText("GAME OVER", 100, 150);
		
		const currentDate = new Date();
		const timestamp = currentDate.getTime();
		if (timestamp % 10 == 0) {
			isDeadImage = !isDeadImage;
		}
		if (isDeadImage) {
			ctx.drawImage(player1_dead, player1LocationW, player1LocationH, player1Width, player1Height);
		} else {
			ctx.drawImage(player1Image, player1LocationW, player1LocationH, player1Width, player1Height);
		}
	}
	function drawEnvironment() {
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		// draw horizon
		var soilStarting = environmentPosition % canvasWidth; 
		ctx.drawImage(soil, -soilStarting, horizontalLine + 1, canvasWidth, canvasHeight - horizontalLine);
		ctx.drawImage(soil, canvasWidth-soilStarting, horizontalLine + 1, canvasWidth, canvasHeight - horizontalLine);
		
		for (var indexObstacle = firstObstacleIndex; indexObstacle < firstObstacleIndex + obstaclesPerScreen; indexObstacle++) {
			var obstacle = obstacles[indexObstacle];
			var obstacleStarting = indexObstacle * 200 - environmentPosition;
			if (obstacleStarting < 0) {
				firstObstacleIndex++;
				obstacles.push(getRandomObstacle());
			}
			if (obstacle) {
				ctx.drawImage(obstacle, obstacleStarting, horizontalLine - obstacle.height, obstacle.width, obstacle.height);	
			}
		}
		ctx.font = "14px Regular semi-serif";
		ctx.fillText("SCORE: " + Math.floor(environmentPosition/100), 600, 10);
		//ctx.fillText(playerName, 10, 10);
		
		isHit();
		
		for (var i=0; i < lives; i++) {
			ctx.drawImage(heart, 10 + i * 20, 10, 13, 10);
		}
		
	}
	
	window.setInterval(function () {
		if (lives == 0) {
			drawGameOver();
			return;
		}
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
	document.getElementsByTagName("body")[0].addEventListener("touchstart", jump);
	window.addEventListener("touchstart", jump);
});