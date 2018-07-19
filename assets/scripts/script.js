/*jslint browser: true*/
/*global $, jQuery */

var main_canv = document.getElementById("main-canvas");
var ctx = main_canv.getContext("2d");

// store the score
// default is 0
localStorage.setItem("highest score", 0);


// current level
var level = 1;
// total number of planets
var planet_num = 10;
// update the score
var score = 200;

// timer
var game_length = 60;
var time_left = game_length;

function Counter_loop(callback, delay) {
	var id,
		start,
		resume,
		remaining = delay;
	this.pause = function () {
		window.clearTimeout(id);
		remaining -= new Date() - start;
	};

	resume = function () {
        start = new Date();
		id = window.setTimeout(function () {
			resume();
			callback();
		}, delay);
	};
	
	this.resume = resume;
	this.resume();
}

// draw the border
function draw_border() {
	ctx.lineWidth = "4";
	ctx.strokeStyle = "black";
	ctx.beginPath();
	ctx.moveTo(0, 0);
    ctx.lineTo(0, 640);
    ctx.lineTo(1000, 640);
    ctx.lineTo(1000, 0);
	ctx.lineTo(0, 0);
	ctx.stroke();
}

// draw the infobar
function draw_InfoBar() {
	// draw the line
	ctx.strokeStyle = "black";
	ctx.lineWidth = "2";
	ctx.beginPath();
	ctx.moveTo(0, 40);
    ctx.lineTo(1000, 40);
	ctx.stroke();
	
	// draw Level#
	ctx.font = "25px Arial Black";
	ctx.textAlign = "left";
	ctx.fillText("Level # " + level, 10, 30);
	
	// draw score
	ctx.font = "25px Arial Black";
	ctx.fillText("Score: " + score, 425, 30);
	
	// draw time_left
	ctx.font = "25px Arial Black";
	ctx.fillText(time_left + " seconds", 825, 30);
}

// gnerates different types of planets
// and giving each planet a random direction
function planet(type) {
    this.rand_dir = Math.random() * Math.PI;
    this.ctx = window.ctx;
    this.dir_x = Math.cos(this.rand_dir) * 3;
    this.dir_y = Math.sin(this.rand_dir) * 3;
    this.start_x = Math.floor(Math.random() * (973 - 27)) + 27;
    this.start_y = Math.floor(Math.random() * (613 - 67)) + 67;
    this.type = type;
    this.eaten = false;

    this.next_dir = function () {
        var j = 0;
        this.in_horizon = false;
        this.colide = false;
        this.grav_toward = null;
        for (j = 0; j < window.black_holes.length; j += 1) {
            if (window.black_holes[j].in_horizon(this.start_x, this.start_y)) {
                this.grav_toward = window.black_holes[j];
                this.in_horizon = true;
            }
            if (window.black_holes[j].colide(this.start_x, this.start_y)) {
                this.colide = true;
                if (window.black_holes[j].planet_storage_current
						=== window.black_holes[j].planet_storage_max) {
                    window.black_holes.splice(j, 1);
                }
            }
        }
        if (this.colide) {//colide){ //BH.inkill
            this.eaten = true;
            score -= 50;
        } else {
            if (this.in_horizon) { //BH.inhori
                this.rand_dir = Math.atan((this.grav_toward.center_y - this.start_y)
										  / (this.grav_toward.center_x - this.start_x));
                this.dir_x = Math.cos(this.rand_dir) * this.grav_toward.gravity;
                this.dir_y = Math.sin(this.rand_dir) * this.grav_toward.gravity;
                if ((this.grav_toward.center_x - this.start_x) < 0) {
                    this.dir_x = this.dir_x * -1;
                    this.dir_y = this.dir_y * -1;
                }
            } else {
                if (this.start_x >= 975 || this.start_x <= 25) {
                    this.dir_x = this.dir_x * -1;
                }
                if (this.start_y >= 615 || this.start_y <= 65) {
                    this.dir_y = this.dir_y * -1;
                }
            }
            this.start_x = Math.min(Math.max(this.start_x + this.dir_x, 23), 977);
            this.start_y = Math.min(Math.max(this.start_y + this.dir_y, 63), 617);
        }
    };
}

// draw the pokeball type of planet
function draw_planet1(x, y) {
    
    ctx.strokeStyle = "black";
	ctx.lineWidth = "3";
	ctx.lineCap = "round";
	
    ctx.beginPath();
	ctx.moveTo(x - 25, y);
    ctx.lineTo(x + 25, y);
	ctx.stroke();
    
	ctx.beginPath();
	ctx.arc(x, y, 25, 0, Math.PI, false);
	ctx.fillStyle = "white";
    ctx.fill();
	ctx.stroke();
    
    
	ctx.beginPath();
	ctx.arc(x, y, 25, 0, Math.PI, true);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.stroke();
    ctx.fillStyle = "black";
    
    ctx.beginPath();
	ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
	ctx.fillStyle = "white";
    ctx.fill();
	ctx.stroke();
    
    ctx.beginPath();
	ctx.arc(x, y, 8, 0, 2 * Math.PI, false);
    ctx.fill();
	ctx.stroke();
    ctx.fillStyle = "black";
    
	ctx.beginPath();
	ctx.arc(x, y, 2, 0, 2 * Math.PI, false);
    ctx.fill();
	ctx.stroke();
}

// draw the white stript type of planet
function draw_planet2(x, y) {
	
	ctx.strokeStyle = "black";
	ctx.lineWidth = "2";
	ctx.beginPath();
	ctx.arc(x, y, 24, 0, 2 * Math.PI, false);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.stroke();
	
	ctx.strokeStyle = "white";
	ctx.lineWidth = "3.5";
	ctx.lineCap = "round";
	ctx.beginPath();
	
	ctx.moveTo(x - 5, y - 20);
    ctx.lineTo(x + 9, y - 20);
	
	ctx.moveTo(x - 20, y - 15);
    ctx.lineTo(x, y - 15);

	ctx.moveTo(x - 5, y - 5);
    ctx.lineTo(x + 23, y - 5);
	
	ctx.moveTo(x + 5, y);
    ctx.lineTo(x + 10, y);
	
	ctx.moveTo(x - 20, y + 5);
    ctx.lineTo(x - 5, y + 5);
	
	ctx.moveTo(x + 5, y + 10);
    ctx.lineTo(x + 15, y + 10);
	
	ctx.moveTo(x - 5, y + 20);
    ctx.lineTo(x + 14, y + 20);
	ctx.stroke();
    
    ctx.strokeStyle = "black";
	ctx.lineWidth = "2";
    ctx.beginPath();
	ctx.arc(x, y, 25, 0, 2 * Math.PI, false);
	ctx.fillStyle = "black";
	ctx.stroke();
}

// draw the death star type of planet
function draw_planet3(x, y) {
    
    ctx.strokeStyle = "black";
	ctx.lineWidth = "2";
	ctx.beginPath();
	ctx.arc(x, y, 24, 0, 2 * Math.PI, false);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.stroke();
    
    ctx.beginPath();
	ctx.arc(x - 10, y - 12, 7, 0, 2 * Math.PI, false);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.stroke();

	ctx.strokeStyle = "white";
    ctx.lineWidth = "4";
    ctx.beginPath();
	ctx.moveTo(x + 10, y - 20);
    ctx.lineTo(x + 14, y - 20);
    
	ctx.moveTo(x + 7, y - 16);
    ctx.lineTo(x + 18, y - 16);

    ctx.moveTo(x + 13, y - 12);
    ctx.lineTo(x + 21, y - 12);
    
    ctx.moveTo(x + 10, y - 8);
    ctx.lineTo(x + 22, y - 8);
    
    ctx.moveTo(x - 24, y);
    ctx.lineTo(x + 24, y);
	
    ctx.moveTo(x + 10, y + 20);
    ctx.lineTo(x + 14, y + 20);
    
	ctx.moveTo(x + 7, y + 16);
    ctx.lineTo(x + 18, y + 16);

    ctx.moveTo(x + 13, y + 12);
    ctx.lineTo(x + 21, y + 12);
    
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x + 22, y + 8);
    
    ctx.stroke();
    
    ctx.strokeStyle = "grey";
    ctx.lineWidth = "2";
    ctx.beginPath();
	ctx.arc(x, y, 25, 0, 2 * Math.PI, false);
	ctx.stroke();
    
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
}

// black hole objects
var black_holes = new Array();

// object black hole
// this are the default values
function BH() {
	this.x = 0;
	this.y = 0;
	this.center_x = 25;
	this.center_y = 25;
	this.color = "black";
	this.planet_storage_max = 1;
	this.planet_storage_current = 0;
    this.gravity = 7;
	this.points = 20;
    this.in_horizon = function (x, y) {
        if (x >= (this.x - 25) && x <= (this.x + 75) &&
                y >= (this.y - 25) && y <= (this.y + 75)) {
            return true;
        } else {
            return false;
        }
    };
    this.colide = function (x, y) {
        var distance = Math.sqrt(Math.pow((x - this.center_x), 2) +
                                 Math.pow((y - this.center_y), 2));
        if (distance > 10) {
            return false;
        } else {
            this.planet_storage_current += 1;
            return true;
        }
    };
}

// add a random color black hole to a random position
//  the new back hole will not be added on top of another
function add_bh() {
	
	var new_bh = new BH(),
		color_det = Math.random();
	new_bh.x = Math.floor(Math.random() * (900 - 0)) + 0;
	new_bh.center_x = new_bh.x + 25;
	new_bh.y = Math.floor(Math.random() * (540 - 40)) + 40;
	new_bh.center_y = new_bh.y + 25;

	if (color_det < 0.5) {
		new_bh.color = "blue";
		new_bh.planet_storage_max = 3;
		new_bh.points = 5;
        new_bh.gravity = 3;
	} else if (color_det > 0.65) {
		new_bh.color = "purple";
		new_bh.planet_storage_max = 2;
		new_bh.points = 10;
        new_bh.gravity = 5;
	}
	// can not be on top of an existing black hole
	var i,
		len = black_holes.length,
		total_checked = 0;

	for (i = 0; i < len; i += 1) {
		if (!((new_bh.x >= black_holes[i].center_x - 100)
					&& (new_bh.x <= black_holes[i].center_x + 100))
				&& !((new_bh.y >= black_holes[i].center_y - 100)
					&& (new_bh.y <= black_holes[i].center_y + 100))) {
			total_checked += 1;
		}
	}
	if (total_checked === len) {
		black_holes.push(new_bh);
	}
}

function generate_BH() {
	if (Math.random() < (0.05 * level)) {
		add_bh();
	}
}


// balck hole images
var bh_black = new Image();
var bh_blue = new Image();
var bh_purple = new Image();
bh_black.src = "./assets/images/black-hole-black.svg";
bh_blue.src = "./assets/images/black-hole-blue.svg";
bh_purple.src = "./assets/images/black-hole-purple.svg";


function render_game_page() {
	var j;
	draw_InfoBar();
    for (j = 0; j < planet_num; j++) {
        if (planets[j].eaten === false) {
            if ((j % 3) == 0) {
                draw_planet1(planets[j].start_x, planets[j].start_y);
            } else if ((j % 3) == 1) {
                draw_planet2(planets[j].start_x, planets[j].start_y);
            } else if ((j % 3) == 2) {
                draw_planet3(planets[j].start_x, planets[j].start_y);
            }
            planets[j].next_dir();
        }
    }

	var i,
		len = black_holes.length;
		

	for (i = 0; i < len; i += 1) {
		if (black_holes[i].planet_storage_current === black_holes[i].planet_storage_max) {
			black_holes.splice(i, 1);
		}
		var color = black_holes[i].color;
		if (color === "black") {
			ctx.drawImage(bh_black, black_holes[i].x, black_holes[i].y, 50, 50);
		} else if (color === "blue") {
			ctx.drawImage(bh_blue, black_holes[i].x, black_holes[i].y, 50, 50);
		} else if (color === "purple") {
			ctx.drawImage(bh_purple, black_holes[i].x, black_holes[i].y, 50, 50);
		}
		
	}
}


// click on black holes
$("#main-canvas").click(function (e) {
	var clickedX = e.pageX - this.offsetLeft;
	var clickedY = e.pageY - this.offsetTop - 40;
	var i;

	for (i = 0; i < black_holes.length; i += 1) {
        var bh = black_holes[i];
		if ((clickedX >= bh.center_x - 25) && (clickedX <= bh.center_x + 25)
                && (clickedY >= bh.center_y - 25) && (clickedY <= bh.center_y + 25)) {
			black_holes.splice(i, 1);
            if (bh.color === "black") {
                score += 20;
            } else if (bh.color === "purple") {
                score += 10;
            } else {
                score += 5;
            }
		}
	}
});




function draw_start_page() {
	// draw title
	ctx.font = "25px Arial Black";
	ctx.textAlign = "center";
	ctx.fillText("UNIVERSE SAVER", 500, 200);
	
	var highest_score = localStorage.getItem("highest score");
	ctx.fillText("HIGH SCORE: " + highest_score, 500, 300);
	
	ctx.lineWidth = "2";
	ctx.rect(300, 150, 400, 350);
	ctx.stroke();
}

function draw_transition_page() {
	// draw title
	ctx.font = "25px Arial Black";
	ctx.textAlign = "center";
	ctx.fillText("LEVEL# " + level, 500, 200);
	
	var highest_score = localStorage.getItem("highest score");
	ctx.fillText("SCORE: " + score, 500, 300);
	
	ctx.lineWidth = "2";
	ctx.rect(300, 150, 400, 350);
	ctx.stroke();
}

function draw_paused_page() {
	// draw title
	ctx.font = "25px Arial Black";
	ctx.textAlign = "center";
	ctx.fillText("PAUSED", 500, 200);
		
	ctx.lineWidth = "2";
	ctx.rect(300, 150, 400, 350);
	ctx.stroke();
}

function draw_finish_page() {
// draw title
	ctx.font = "25px Arial Black";
	ctx.textAlign = "center";
	ctx.fillText("GAME OVER", 500, 200);
    
    ctx.font = "25px Arial Black";
	ctx.textAlign = "center";
	ctx.fillText("FINAL SCORE: " + score, 500, 300);
		
	ctx.lineWidth = "2";
	ctx.rect(300, 150, 400, 350);
	ctx.stroke();
}

// determine which page to display
var start_page = true;
var game_page = false;
var transition_page = false;
var next_level_page = false;
var paused_page = false;
var finish_page = false;

var counter;

// click start button
$("#button-start").click(function () {
	start_page = false;
	game_page = true;
	$(this).hide();
    counter = new Counter_loop(function () {
		time_left -= 1;
	}, 1000);
});

// click next button
$("#button-next").click(function () {
	transition_page = false;
	game_page = true;
	$(this).hide();
    counter = new Counter_loop(function () {
		time_left -= 1;
	}, 1000);
});

// click pause button
$("#button-pause").click(function () {
	game_page = false;
    paused_page = true;
    $(this).css("background-color", "grey");
    counter.pause();
    $("#button-resume").show();
});

// click resume button
$("#button-resume").click(function () {
	game_page = true;
    paused_page = false;
    $("#button-pause").css("background-color", "white");
    counter.resume();
    $(this).hide();
});

// click finish button
$("#button-finish").click(function () {
    finish_page = false;
    start_page = true;
    $("#button-start").show();
    $(this).hide();
});

function setup_start() {
	$("#button-next").hide();
	$("#button-resume").hide();
	$("#button-finish").hide();
	score = 200;
	level = 1;
	draw_start_page();
	draw_InfoBar();
}

function setup_game() {
	generate_BH();
	render_game_page();
	window.alldone = true;
	var i;
	for (i = 0; i < planet_num; i++) {
		if(!window.planets[i].eaten) {
			window.alldone = false;
		}
	}
	if (window.alldone) {
		game_page = false;
		finish_page = true;
	}
}
function setup_transition() {
	transition_page = true;
	game_page = false;
	$("#button-next").show();
	counter.pause();
	time_left = game_length;
	level = 2;
	var j;
	for (j = 0; j < planet_num; j++) {
		window.planets[j] = new planet(j % 3);
	}
	// emory black hole list
	black_holes = [];

}
function setup_finish() {
	draw_InfoBar();
	draw_finish_page();
	$("#button-finish").show();
	for (var i = 0; i < planet_num; i++){
		window.planets[i] = new planet(i%4);
	}
}

function clean_and_update() {
	transition_page = false;
	game_page = false;
	finish_page = true;

	counter.pause();
	time_left = game_length;
	// emory black hole list
	black_holes = [];
	if (score > localStorage.getItem("highest score")) {
		localStorage.setItem("highest score", score);
	}

}

var move_on = false;
function check_left() {
	var j,
		left = 10;
	for (j = 0; j < planet_num; j++) {
		if (planets[j].eaten === true) {
			left -= 1;
		}
	}
	return left;
}

function main() {

	// clear before draw
	ctx.clearRect(0, 0, 1000, 640);
	draw_border();
	
	if (start_page) {
		setup_start();
	} else if (game_page && time_left !== 0) {
		setup_game();
	} else if ((check_left() === 0) && move_on === false) {
		clean_and_update();
		move_on = true;
	} else if (time_left === 0 && level === 1) {
		setup_transition();
	} else if (transition_page) {
		draw_transition_page();
		draw_InfoBar();
    } else if (paused_page) {
        draw_InfoBar();
        draw_paused_page();
    } else if (finish_page) {
		setup_finish();
    } else if (time_left === 0 && level === 2) {
		clean_and_update();
    }
	setTimeout(main, 33);
}

window.planets = new Array();
for (var i = 0; i < planet_num; i++){
    window.planets[i] = new planet(i%4);
}

window.onload = function() {
	main();
}
