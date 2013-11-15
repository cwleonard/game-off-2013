(function(window, _undefined) {

    var UP = 0;
    var DOWN = 1;
    var RIGHT = 2;
    var LEFT = 3;

    var NONE = -1;

    var FROG_SPEED = 0.3333;
    var FOOD_SPEED = 0.15;
    var FISH_SPEED = 0.28;
    
    var HURT_TIME = 350; // milliseconds
    
    var LEVEL_UP = 200;
    
    var LEVEL_NAMES = [ "tadpole", "tadpole with legs", "froglet" ];
    
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

	// level 3
	var froglet_right = new Image();
	var froglet_left = new Image();
	froglet_right.src = "img/froglet_right.png";
	froglet_left.src = "img/froglet_left.png";

	var heroRightFrames = [ tadpole_right, tadpole2_right, froglet_right ];
	var heroLeftFrames = [ tadpole_left, tadpole2_left, froglet_left ];
	
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

	// level 3
	var bad_froglet_right = new Image();
	var bad_froglet_left = new Image();
	bad_froglet_right.src = "img/bad_froglet_right.png";
	bad_froglet_left.src = "img/bad_froglet_left.png";

	var badRightFrames = [ bad_tadpole_right, bad_tadpole2_right, bad_froglet_right ];
	var badLeftFrames = [ bad_tadpole_left, bad_tadpole2_left, bad_froglet_left ];
	
	// fish
	
	var fish_closed_left = new Image();
	var fish_closed_right = new Image();
	var fish_open_left = new Image();
	var fish_open_right = new Image();
	fish_closed_left.src = "img/fish_closed_left.png";
	fish_closed_right.src = "img/fish_closed_right.png";
	fish_open_left.src = "img/fish_open_left.png";
	fish_open_right.src = "img/fish_open_right.png";
	
	var fishRightFrames = [fish_closed_right, fish_open_right];
	var fishLeftFrames = [fish_closed_left, fish_open_left];

	// -------------------- food images
	
	var food_img = new Image();
	food_img.src = "img/food.png";
	
	// -------------------- messages
	
	var cts_img = new Image();
	var gameover_img = new Image();
	cts_img.src = "img/click_to_start.png";
	gameover_img.src = "img/game_over.png";
	
	
	// -----------------------------
	
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
	
	function Fish() {
		
		this.frameIndex = 0;
		this.radius = 12.5;
		this.value = -999; // game over!
		this.frameTimer = 0;
		this.frameLength = 300;
		this.direction = (Math.random() < 0.5 ? RIGHT : LEFT);
		if (this.direction == RIGHT) {
			this.frameSet = fishRightFrames;
		} else {
			this.frameSet = fishLeftFrames;
		}
		this.numFrames = this.frameSet.length;
		this.position = {
				x: (this.direction == RIGHT ? -150 : frogGame.canvas.width + 150),
				y: frogGame.frog.position.y
		};
		
		
		this.update = function(elapsed) {
			
			this.frameTimer += elapsed;
			if (this.frameTimer >= this.frameLength) {
				this.frameIndex++;
				this.frameTimer = 0;
				if (this.frameIndex == this.numFrames) {
					this.frameIndex = 0;
				}
			}
			
			var movement = elapsed * FISH_SPEED;
	        	
			var dx = 0;
			
			if (this.direction == RIGHT) {
				dx += movement;
			} else {
				dx -= movement;
			}
			
			this.position.x += dx;

		};
		
		this.draw = function(context) {

			var frame = this.frameSet[this.frameIndex];
			
			context.save();
			context.translate((this.position.x),(this.position.y));
			context.drawImage(frame,-(frame.width/2),-(frame.height/2));
			context.restore();
			
		};
		
	}
	
	function Frog(lvl, b) {
		
		this.level = lvl;
		this.bad = b;
		this.frame = (this.bad ? bad_tadpole_right : tadpole_right);
		if (this.level > 2) {
			this.frame = (this.bad ? bad_froglet_right : froglet_right);
		} else if (this.level > 1) {
			this.frame = (this.bad ? bad_tadpole2_right : tadpole2_right);
		}
		this.direction = NONE;
		this.lastDirection = RIGHT;
		this.radius = 25;
		this.points = 0;
		this.value = -10;
		this.hurting = false;
		this.hurtTimer = 0;
		
		this.slope = 0;
		if (this.bad) {
			var u = (Math.random() < 0.5 ? -1 : 1);
			this.slope = ((Math.random() * 7) / 10) * u;
		}
		
		this.position = {
			x: 0,
			y: 0
		};

		this.setDirection = function(dir) {

			var ffl = heroLeftFrames[this.level - 1];
			var ffr = heroRightFrames[this.level - 1];
			var bfl = badLeftFrames[this.level - 1];
			var bfr = badRightFrames[this.level - 1];
			
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
		
		this.levelUp = function() {
			
			this.level++;
			this.points = 0;
			if (this.lastDirection == RIGHT) {
				this.frame = heroRightFrames[this.level - 1];
			} else if (this.lastDirection == LEFT) {
				this.frame = heroLeftFrames[this.level - 1];
			}
			
		}
		
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
	        	
	            var dx = 0;
	            var dy = 0;
	        	if (this.direction == UP) {
	        		dy -= movement;
	        	} else if (this.direction == DOWN) {
	        		dy += movement;
	        	} else if (this.direction == LEFT) {
	        		dx -= movement;
	        	} else {
	        		dx += movement;
	        	}

	        	if (this.bad && this.level > 1) {
	        		dy = dx * this.slope;
	        	}

	        	this.position.x += dx;
	        	this.position.y += dy;

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
		this.running = false;
		
		this.level = 1;
		
		this.foodWait = 0;
		this.frogWait = 0;
		this.fishWait = 20000; // first fish won't show up for 20 seconds
		
		this.foodTimer = 0;
		this.frogTimer = 0;
		this.fishTimer = 0;
		
		this.canvas = null;
		this.ctx = null;
		
		this.frog = null;
		
		this.ignoreKeys = false;
		
		this.sprites = [];
		
		this.keyHandler = function(event) {
			
			if (event.type == "keyup") {
				
				frogGame.frog.setDirection(NONE);
				frogGame.ignoreKeys = false;
				
			} else if (event.type == "keydown") {

				if (frogGame.ignoreKeys) return;
				
				switch (event.keyCode) {
				case 37:
					// LEFT ARROW
					frogGame.frog.setDirection(LEFT);
					frogGame.ignoreKeys = true;
					break;
				case 38:
					// UP ARROW
					frogGame.frog.setDirection(UP);
					frogGame.ignoreKeys = true;
					break;
				case 39:
					// RIGHT ARROW
					frogGame.frog.setDirection(RIGHT);
					frogGame.ignoreKeys = true;
					break;
				case 40:
					// DOWN ARROW
					frogGame.frog.setDirection(DOWN);
					frogGame.ignoreKeys = true;
					break;
				}

			}
			
		};

		this.setup = function(options) {
			
			this.canvas = options.canvas;
			this.ctx = this.canvas.getContext("2d");

		};
		
		this.pregame = function() {

			this.frog = new Frog(this.level);
			this.frog.position.x = this.canvas.width / 2;
			this.frog.position.y = this.canvas.height / 2;
			
			this.sprites.push(this.frog);

			var me = this;
			window.requestAnimationFrame(function() { me.pregameDraw(); });

		};

		this.drawGameOver = function() {
			
			this.ctx.save();
			this.ctx.translate(this.canvas.width/2,this.canvas.height/3);
			this.ctx.drawImage(gameover_img,-(gameover_img.width/2),-(gameover_img.height/2));
			this.ctx.restore();
			
		};
		
		this.pregameDraw = function() {
			
			this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
			this.ctx.fillStyle="#58ACFA";
			this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)

			this.ctx.save();
			this.frog.draw(this.ctx);
			this.ctx.restore();
			
			this.ctx.save();
			this.ctx.translate(this.canvas.width/2,this.canvas.height/3);
			this.ctx.drawImage(cts_img,-(cts_img.width/2),-(cts_img.height/2));
			this.ctx.restore();
			
			if (!this.running) {
				var me = this;
				window.requestAnimationFrame(function() { me.pregameDraw(); });
			}

		}
		
		this.start = function() {
			
			if (this.running) return;
			
			this.canvas.onclick = null;
			
			soundManager.play('background');
			this.running = true;
			progressBar(0, $('#progressBar'));
			this.setStatus();
			
			var me = this;
			window.requestAnimationFrame(function(e) { me.run(e); });
			
		};
		
		this.run = function(timestamp) {
			
			var elapsed;
			if (this.startTime === null) this.startTime = timestamp;
			elapsed = timestamp - this.startTime;
			this.startTime = timestamp;
			
			
			this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
			this.ctx.fillStyle="#58ACFA";
			this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)

			
			this.ctx.save();
			
			// ======= update stuff
			
			for (var i = 0; i < this.sprites.length; i++) {
				this.sprites[i].update(elapsed);
				// this is a hack - won't let frogs hit each other - fix later
				if (this.sprites[i] !== this.frog) {
					if (!this.sprites[i].eaten && this.intersect(this.frog, this.sprites[i])) {
						if (this.sprites[i].deflect) {
							this.sprites[i].deflect();
							this.frog.hurt();
						} else {
							this.sprites[i].eaten = true;
						}
						this.addPoints(this.sprites[i].value);
					}
				}
			}
			
			this.addFood(elapsed);
			this.addFrog(elapsed);
			this.addFish(elapsed);
			
			// ======= draw
			
			this.draw();
			if (!this.running) {
				this.drawGameOver();
			}
			
			// ======= come back soon

			this.ctx.restore();
			
			if (this.running) {
				var me = this;
				window.requestAnimationFrame(function(e) { me.run(e); });
			}
			
		};
		
		this.draw = function() {
			
			for (var i = 0; i < this.sprites.length; i++) {
				this.sprites[i].draw(this.ctx);
			}
			
		}
		
		this.addFish = function(elapsed) {
			
			this.fishTimer += elapsed;
			if (this.fishTimer >= this.fishWait) {

				// time to add another fish
				
				var f = new Fish();
				this.sprites.push(f);
				
				// reset timer and wait time
				this.fishTimer = 0;
				this.fishWait = 15000 + Math.floor(Math.random()*5000);
				// new fish appears between 15.0 and 20.0 seconds
				
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
				this.frogWait = 1000 + Math.floor(Math.random()*400);
				this.frogWait -= 200 * (this.level - 1);
				// new frog appears between 1.2 and 1.6 seconds in level 1,
				//                  between 1.0 and 1.4 seconds in level 2,
				//                  between 0.8 and 1.2 seconds in level 3
				
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

			if (v == -999) {
				// game over!
				this.running = false;
				this.setStatus();
				soundManager.stop('background');
				soundManager.play('gameover');
				return;
			}
			
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
			
			if (this.frog.points == LEVEL_UP) {
				// go to next level!
				this.level++;
				this.frog.levelUp();
				this.setStatus();
				soundManager.play('levelup');
			}
			
			progressBar((this.frog.points / LEVEL_UP) * 100, $('#progressBar'));
			
		}
		
		this.setStatus = function() {

			if (this.running) {
				$('#status').text("Level: " + LEVEL_NAMES[this.level - 1]); 
			} else {
				$('#status').text("GAME OVER!!");
			}
			
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
    		soundManager.createSound({
    			id: 'gameover',
    			url: 'audio/43697__notchfilter__game-over02.wav',
    			autoLoad: true
    		});
    		soundManager.createSound({
    			id: 'levelup',
    			url: 'audio/90633__benboncan__level-up.wav',
    			autoLoad: true
    		});
			
		}
		
		
	} // FrogGame()
	
	frogGame = new FrogGame();
	
	window.frogGame = frogGame;
	
}(window));

