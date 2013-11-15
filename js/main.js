(function(window, _undefined) {

    var UP = 0;
    var DOWN = 1;
    var RIGHT = 2;
    var LEFT = 3;

    var NONE = -1;

    var FROG_SPEED = 0.3333;
    var FOOD_SPEED = 0.1;
    
    var HURT_TIME = 350; // milliseconds
    
    var LEVEL_UP = 200;
    
    
	var frogGame = null;
	
	// level 1
	var tadpole_right = new Image();
	var tadpole_left = new Image();
	tadpole_right.src = "img/tadpole_right.png";
	tadpole_left.src = "img/tadpole_left.png";

	// level 2
	var tadpole2_right = new Image();
	var tadpole2_left = new Image();
	tadpole2_right.src = "img/tadpole_legs_right.png";
	tadpole2_left.src = "img/tadpole_legs_left.png";

	// -------------------- "enemy" images
	
	// level 1
	var bad_tadpole_right = new Image();
	var bad_tadpole_left = new Image();
	bad_tadpole_right.src = "img/bad_tadpole_right.png";
	bad_tadpole_left.src = "img/bad_tadpole_left.png";

	// level 2
	var bad_tadpole2_right = new Image();
	var bad_tadpole2_left = new Image();
	bad_tadpole2_right.src = "img/bad_tadpole_legs_right.png";
	bad_tadpole2_left.src = "img/bad_tadpole_legs_left.png";

	// -------------------- food images
	
	var food_img = new Image();
	food_img.src = "img/food.png";
	
	function Food() {
		
		this.frame = food_img;
		this.radius = 12.5;
		this.eaten = false;
		this.value = 10;
		this.position = {
				x: 0,
				y: 0
		};
		
		this.update = function(elapsed) {
			
			if (this.eaten) return;
			
			var movement = elapsed * FOOD_SPEED;
	        	
			var nextPos = { 'x': this.position.x, 'y': this.position.y };
	            
			var dx = 0;
			var dy = 0;
			
			// food only falls
			nextPos.y += movement;
			dy += movement;
			
			this.position.x = nextPos.x;
			this.position.y = nextPos.y;

		};
		
		this.draw = function(context) {

			if (this.eaten) return;

			context.save();
			context.translate((this.position.x),(this.position.y));
			context.drawImage(this.frame,-(this.frame.width/2),-(this.frame.height/2));
			context.restore();
			
		};
		
	} // Food()
	
	function Frog(lvl, b) {
		
		this.level = lvl;
		this.bad = b;
		this.frame = (this.bad ? bad_tadpole_right : tadpole_right);
		if (this.level > 1) {
			this.frame = (this.bad ? bad_tadpole2_right : tadpole2_right);
		}
		this.direction = NONE;
		this.lastDirection = this.direction;
		this.radius = 25;
		this.points = 0;
		this.value = -10;
		this.hurting = false;
		this.hurtTimer = 0;
		
		this.slope = 0;
		if (this.bad) {
			this.slope = Math.random();
		}
		
		this.position = {
			x: 0,
			y: 0
		};

		this.setDirection = function(dir) {

			var ffl = null;
			var bfl = null;
			var ffr = null;
			var bfr = null;
			if (this.level > 1) {
				ffl = tadpole2_left;
				ffr = tadpole2_right;
				bfl = bad_tadpole2_left;
				bfr = bad_tadpole2_right;
			} else {
				ffl = tadpole_left;
				ffr = tadpole_right;
				bfl = bad_tadpole_left;
				bfr = bad_tadpole_right;
			}
			
			var r = (this.bad ? bfr : ffr);
			var l = (this.bad ? bfl : ffl);
			
			if (dir == RIGHT && this.lastDirection == LEFT) {
				this.frame = r;
			} else if (dir == LEFT && this.lastDirection == RIGHT) {
				this.frame = l;
			}
			if (this.direction == RIGHT || this.direction == LEFT) {
				this.lastDirection = this.direction;
			}
			this.direction = dir;
		};
		
		this.deflect = function() {
			
			if (this.direction == RIGHT) {
				this.lastDirection = RIGHT;
				this.setDirection(LEFT);
			} else {
				this.lastDirection = LEFT;
				this.setDirection(RIGHT);
			}
			
		};
		
		this.hurt = function() {
			
			this.hurting = true;
			this.hurtTimer = 0;
			
		}
		
		this.update = function(elapsed) {
			
			if (this.hurting) {
				this.hurtTimer += elapsed;
				if (this.hurtTimer >= HURT_TIME) {
					this.hurting = false;
				}
				return;
			}
			
	    	if (this.direction != NONE) {
	    		
	        	var movement = elapsed * FROG_SPEED;
	        	if (this.bad) {
	        		movement = movement * 1.1;
	        	}
	        	
	            var nextPos = { 'x': this.position.x, 'y': this.position.y };
	            
	            var dx = 0;
	            var dy = 0;
	        	if (this.direction == UP) {
	        		nextPos.y -= movement;
	        		dy -= movement;
	        	} else if (this.direction == DOWN) {
	        		nextPos.y += movement;
	        		dy += movement;
	        	} else if (this.direction == LEFT) {
	        		nextPos.x -= movement;
	        		dx -= movement;
	        	} else {
	        		nextPos.x += movement;
	        		dx += movement;
	        	}
	        	
	        	this.position.x = nextPos.x;
	        	this.position.y = nextPos.y;
	        	if (this.bad && this.level > 1) {
	        		this.position.y = this.position.x * this.slope;
	        	}

	    	}
			
		};
		
		this.draw = function(context) {
			
			context.save();
			context.translate((this.position.x),(this.position.y));

			if (this.hurting) {
				context.globalAlpha=0.5;
			}
			context.drawImage(this.frame,-(this.frame.width/2),-(this.frame.height/2));
			if (this.hurting) {
				context.globalAlpha=1.0;
			}

			context.restore();
			
		};
		
		
	} // Frog()
	
	function FrogGame() {
		
		this.startTime = null;
		
		this.fps = 50;
		
		this.sounds = true;
		
		this.level = 1;
		
		this.foodWait = 0;
		this.frogWait = 0;
		
		this.foodTimer = 0;
		this.frogTimer = 0;
		
		this.canvas = null;
		this.ctx = null;
		
		this.frog = null;
		
		this.sprites = [];
		
		this.keyHandler = function(event) {
			
			if (event.type == "keyup") {
				
				frogGame.frog.setDirection(NONE);
				
			} else if (event.type == "keydown") {

				switch (event.keyCode) {
				case 37:
					// LEFT ARROW
					frogGame.frog.setDirection(LEFT);
					break;
				case 38:
					// UP ARROW
					frogGame.frog.setDirection(UP);
					break;
				case 39:
					// RIGHT ARROW
					frogGame.frog.setDirection(RIGHT);
					break;
				case 40:
					// DOWN ARROW
					frogGame.frog.setDirection(DOWN);
					break;
				}

			}
			
		};

		this.setup = function(options) {
			
			this.canvas = options.canvas;
			this.ctx = this.canvas.getContext("2d");

		};
		
		this.start = function() {
			
			this.frog = new Frog(this.level);
			
			this.sprites.push(this.frog);
			
			progressBar(0, $('#progressBar'));
			
			window.requestAnimationFrame(this.run);
			
		};
		
		this.run = function(timestamp) {
			
			//console.log("running");
			
			var elapsed;
			if (frogGame.startTime === null) frogGame.startTime = timestamp;
			elapsed = timestamp - frogGame.startTime;
			frogGame.startTime = timestamp;
			
			
			frogGame.ctx.clearRect(0,0,frogGame.canvas.width,frogGame.canvas.height);
			frogGame.ctx.fillStyle="#58ACFA";
			frogGame.ctx.fillRect(0,0,frogGame.canvas.width,frogGame.canvas.height)

			
			frogGame.ctx.save();
			
			// ======= update stuff
			
			for (var i = 0; i < frogGame.sprites.length; i++) {
				frogGame.sprites[i].update(elapsed);
				// this is a hack - won't let frogs hit each other - fix later
				if (frogGame.sprites[i] !== frogGame.frog) {
					if (!frogGame.sprites[i].eaten && frogGame.intersect(frogGame.frog, frogGame.sprites[i])) {
						if (frogGame.sprites[i].deflect) {
							frogGame.sprites[i].deflect();
							frogGame.frog.hurt();
						} else {
							frogGame.sprites[i].eaten = true;
						}
						frogGame.addPoints(frogGame.sprites[i].value);
					}
				}
			}
			
			frogGame.addFood(elapsed);
			frogGame.addFrog(elapsed);
			
			// ======= draw
			
			frogGame.draw();
			
			// ======= come back soon

			frogGame.ctx.restore();
			window.requestAnimationFrame(frogGame.run);
			
		};
		
		this.draw = function() {
			
			for (var i = 0; i < this.sprites.length; i++) {
				this.sprites[i].draw(this.ctx);
			}
			
		}
		
		this.addFrog = function(elapsed) {
			
			this.frogTimer += elapsed;
			if (this.frogTimer >= this.frogWait) {

				// time to add another frog
				
				var f = new Frog(this.level, true);
				// from the left, or from the right?
				if (Math.random() < 0.5) {
					f.lastDirection = RIGHT;
					f.setDirection(LEFT);
					f.position.x = this.canvas.width;
				} else {
					f.lastDirection = LEFT;
					f.setDirection(RIGHT);
				}
				// frog should appear somewhere between 0 and the lower bound of the canvas
				var y = Math.floor(Math.random()*this.canvas.height);
				f.position.y = y;
				this.sprites.push(f);
				
				// reset timer and wait time
				this.frogTimer = 0;
				this.frogWait = 1200 + Math.floor(Math.random()*400);
				// new frog appears between 1.2 and 1.6 seconds
				
			}
			
		}
		
		this.addFood = function(elapsed) {
			
			this.foodTimer += elapsed;
			if (this.foodTimer >= this.foodWait) {
				// time to add more food
				var f = new Food();
				// food should appear somewhere between 0 and the right bound of the canvas
				var x = Math.floor(Math.random()*this.canvas.width);
				f.position.x = x;
				this.sprites.push(f);
				// reset timer and wait time
				this.foodTimer = 0;
				this.foodWait = 1700 + Math.floor(Math.random()*500);
				// new food appears between 1.7 and 2.2 seconds
			}
			
		}
		
		this.addPoints = function(v) {

			if (this.sounds) {
				if (v < 0) {
					soundManager.play('bad');
				} else if (v > 0) {
					soundManager.play('eat');
				}
			}
			this.frog.points += v;
			if (this.frog.points < 0) {
				this.frog.points = 0;
			}
			//document.getElementById("score").innerHTML = this.frog.points;
			
			if (this.frog.points == LEVEL_UP) {
				// go to next level!
				this.level++;
				this.frog.level++;
				this.frog.points = 0;
			}
			
			progressBar((this.frog.points / LEVEL_UP) * 100, $('#progressBar'));
			
		}
		
		this.intersect = function(sprite1, sprite2) {
			
			if (sprite1.hurting || sprite2.hurting) return false;
			
			var distX = sprite2.position.x - sprite1.position.x;
			var distY = sprite2.position.y - sprite1.position.y;
			var magSq = distX * distX + distY * distY;
			return magSq < (sprite1.radius + sprite2.radius) * (sprite1.radius + sprite2.radius);
			
		}
		
		this.createSounds = function() {
			
    		soundManager.createSound({
				id: 'background',
    			url: 'audio/River_Valley_Breakdown.mp3',
    			autoLoad: true,
    			volume: 40,
    			onload: function() {
    				this.play();
    			},
    			onfinish: function() {
    				this.play();
    			}
    		});
    		soundManager.createSound({
    			id: 'eat',
    			url: 'audio/124900__greencouch__beeps-18.wav',
    			autoLoad: true
    		});
    		soundManager.createSound({
    			id: 'bad',
    			url: 'audio/142608__autistic-lucario__error.wav',
    			autoLoad: true
    		});
			
		}
		
		
	} // FrogGame()
	
	frogGame = new FrogGame();
	
	window.frogGame = frogGame;
	
}(window));

