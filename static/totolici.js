$(function(){
	const width  = $(window).width();
    const height = $(window).height();
	const canvasWidth =  800; //width * 0.8;
	const canvasHeight = 400; //height * 0.8;
	
	var canvas = $("#game-canvas");
	ctx = canvas[0].getContext('2d');
	ctx.canvas.height = canvasHeight;
    ctx.canvas.width = canvasWidth;
	
	
});