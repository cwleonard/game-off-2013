(function(window, _undefined) {

    var UP = 0;
    var DOWN = 1;
    var RIGHT = 2;
    var LEFT = 3;

    var NONE = -1;

    var FROG_SPEED = 0.3333;
    var FOOD_SPEED = 0.15;
    var FISH_SPEED = 0.28;
    var LP_SPEED = 0.22;
    
    var MIN_JUMP = 100;
    
    var HURT_TIME = 350; // milliseconds
    
    var LEVEL_UP = 200;
    
    var LEVEL_NAMES = [ "tadpole", "tadpole with legs", "froglet" ];
    
	var frogGame = null;
	
	var PREGAME_MODE = 0;
	var GAME_MODE = 1;
	var PREBONUS_MODE = 2;
	var BONUS_MODE = 3;
	var GAME_OVER_MODE = 9999;
	
	var REGULAR_LP_POINTS = 10;
	var FAST_LP_POINTS = 20;
	
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
	
	// -------------------- decorations
	
	var bubbles_img = new Image();
	bubbles_img.src = "img/bubbles.png";
	
	var plant1 = new Image();
	var plant2 = new Image();
	var plant3 = new Image();
	var plant4 = new Image();
	plant1.src = "img/wplant1.png";
	plant2.src = "img/wplant2.png";
	plant3.src = "img/wplant3.png";
	plant4.src = "img/wplant4.png";
	
	// -------------------- bonus round images
	
	var lily_pad = new Image();
	var flower = new Image();
	var grown_frog = new Image();
	var jumping_frog = new Image();
	var df1 = new Image();
	var df2 = new Image();
	var blue_grown_frog = new Image();
	var blue_jumping_frog = new Image();
	var pond_edge = new Image();
	var open_mouth = new Image();
	var instructions = new Image();
	var instructions2 = new Image();
	var points_img = new Image();
	var pakts = new Image();
	lily_pad.src = "img/lp.png";
	flower.src = "img/lilypad_flower.png";
	grown_frog.src = "img/frog1.png";
	jumping_frog.src = "img/jumping.png";
	df1.src = "img/dragonfly1.png";
	df2.src = "img/dragonfly2.png";
	blue_grown_frog.src = "img/blue_frog.png";
	blue_jumping_frog.src = "img/blue_frog_jumping.png";
	pond_edge.src = "img/pond_edge.png";
	open_mouth.src = "img/open_mouth.png";
	instructions.src = "img/round2_description.png";
	instructions2.src = "img/round2_instructions.png";
	points_img.src = "img/round2_points.png";
	pakts.src = "img/pakts.png";
	
	// -------------------- messages
	
	var desc_img = new Image();
	var how_to = new Image();
	var gameover_img = new Image();
	var greatjob_img = new Image();
	var loading_img = new Image();
	var frog_word_img = new Image();
	desc_img.src = "img/game_description.png";
	how_to.src = "img/how_to_play.png";
	gameover_img.src = "img/game_over.png";
	greatjob_img.src = "img/great_job.png";
	loading_img.src = "img/loading.png";
	frog_word_img.src = "img/round2_frog.png";
	
	// --------------------- sounds
	
	var soundsToLoad = [
			{
				name : 'background',
				url : 'audio/River_Valley_Breakdown.mp3',
				volume : 40,
				loop : true
			},
			{
				name : 'eat',
				url : 'audio/124900__greencouch__beeps-18.mp3',
				loop : false
			},
			{
				name : 'bad',
				url : 'audio/142608__autistic-lucario__error.mp3',
				loop : false
			},
			{
				name : 'gameover',
				url : 'audio/43698__notchfilter__game-over03.mp3',
				loop : false
			},
			{
				name : 'levelup',
				url : 'audio/90633__benboncan__level-up.mp3',
				loop : false
			},
			{
				name : 'splash',
				url : 'audio/110393__soundscalpel-com__water-splash.mp3',
				loop : false
			},
			{
				name : 'complete',
				url : 'audio/177120__rdholder__2dogsound-tadaa1-3s-2013jan31-cc-by-30-us.mp3',
				loop : false
			}, {
				name : 'buzz',
				url : 'audio/95817__dobroide__20100424-bee.mp3',
				loop : false,
				volume : 40
			} ];
	var soundsLoaded = 0;
	
	// -----------------------------
	
	function Dragonfly() {
		
		this.done = false;
		this.frameIndex = 0;
		this.frameTimer = 0;
		this.radius = 10;
		this.value = 5;
		this.frameLength = 50;
		this.frameSet = [ df1, df2 ];
		this.numFrames = this.frameSet.length;
		this.type = (Math.random() < 0.5 ? LEFT : RIGHT);
		this.position = {
				x: (this.type == LEFT ? 0 : frogGame.canvas.width),
				y: 250
		};
		this.rotation = (this.type == LEFT ? 90 : -90);
		
		this.update = function(elapsed) {
			
			if (this.done) return;
			
			this.frameTimer += elapsed;
			if (this.frameTimer >= this.frameLength) {
				this.frameIndex++;
				this.frameTimer = 0;
				if (this.frameIndex == this.numFrames) {
					this.frameIndex = 0;
				}
			}
			
			var movement = elapsed * FROG_SPEED * 1.1; // not quite as fast as frogs jump
        	
			// dragonflies move from the side to center, then up
			if (this.type == UP) {
				this.position.y -= movement;
			} else if (this.type == LEFT) {
				this.position.x += movement;
				if (this.position.x >= (frogGame.canvas.width / 2)) {
					this.type = UP;
					this.rotation = 0;
				}
			} else {
				this.position.x -= movement;
				if (this.position.x <= (frogGame.canvas.width / 2)) {
					this.type = UP;
					this.rotation = 0;
				}
			}
			
			if (this.position.y < -50) {
				this.done = true;
			}

		};
		
		this.draw = function(context) {
			
			if (this.done) return;

			var frame = this.frameSet[this.frameIndex];
			
			context.save();
			context.translate((this.position.x),(this.position.y));
			context.rotate(this.rotation * (Math.PI / 180));
			context.drawImage(frame,-(frame.width/2),-(frame.height/2));
			context.restore();
			
		};
		
	} // Dragonfly()

	function LilyPad() {
		
		this.done = false;
		this.radius = 12;
		this.withFrog = false;
		this.frame = lily_pad;
		this.frogRotation = 0;
		this.frogImage = null;
		this.direction = ( Math.random() < 0.5 ? LEFT : RIGHT );
		this.position = { 
			x: (this.direction == LEFT ? frogGame.canvas.width - 30 : 30),
			y: 225
		};
		this.value = ( Math.random() < 0.8 ? REGULAR_LP_POINTS : FAST_LP_POINTS );
		this.speed = ( this.value == REGULAR_LP_POINTS ? 0.0005 : 0.0007 );

		this.addFrog = function(r, i) {
			this.withFrog = true;
			this.frogRotation = r;
			this.frogImage = i;
		}

		this.update = function(elapsed) {

			if (this.done) return;

			var rads = -elapsed * this.speed;
			
			var x1 = this.position.x;
			var y1 = this.position.y;
			
			if (this.direction == LEFT) {
				x1 -= (frogGame.canvas.width - 30);
				rads = -rads;
			} else {
				x1 -= 30;
			}
			
			this.position.x = (x1 * Math.cos(rads)) - (y1 * Math.sin(rads));
			this.position.y = (x1 * Math.sin(rads)) + (y1 * Math.cos(rads));

			if (this.direction == LEFT) {
				this.position.x += (frogGame.canvas.width - 30);
			} else {
				this.position.x += 30;
			}
			
			if (this.position.y < -100) {
				this.done = true;
			}
			
		};

		this.draw = function(context) {
			
			if (this.done) return;
			
			context.save();
			context.translate((this.position.x),(this.position.y));
			context.drawImage(this.frame,-(this.frame.width/2),-(this.frame.height/2));
			if (this.value == FAST_LP_POINTS) {
				// draw a flower on these
				context.save();
				context.translate(20,-20);
				context.drawImage(flower,-(flower.width/2),-(flower.height/2));
				context.restore();
			}
			if (this.withFrog) {
				context.rotate(this.frogRotation);
				context.drawImage(this.frogImage,-(this.frogImage.width/2),-(this.frogImage.height/2));
			}
			context.restore();
			
		};

		
	} // LilyPad()
	
	function Frog() {
		
		this.radius = 15;
		this.movement = NONE;
		this.poweringUp = false;
		this.angle = 0;
		this.position = { x: frogGame.canvas.width / 2, y: frogGame.canvas.height - 50 };
		this.slope = 1;
		this.jumpDistance = MIN_JUMP;
		this.alreadyJumped = 0;
		this.landed = false;
		this.points = 0;
		this.level = 0;
		
		this.levelUp = function() {
			this.level++;
			this.points = 0;
		}
		
		this.getImage = function(forLilypad) {
			if (this.level > 0) {
				if (forLilypad) {
					return blue_grown_frog;
				} else {
					return (this.movement == UP ? blue_jumping_frog : blue_grown_frog);
				}
			} else {
				if (forLilypad) {
					return grown_frog;
				} else {
					return (this.movement == UP ? jumping_frog : grown_frog);
				}
			}
		}
		
		this.reset = function() {
			this.movement = NONE;
			this.alreadyJumped = 0;
			this.jumpDistance = MIN_JUMP;
			this.landed = false;
			this.angle = 0;
			this.position.x = frogGame.canvas.width / 2;
			this.position.y = frogGame.canvas.height - 50;
		}
		
		this.getRotation = function() {
			return this.angle * (Math.PI / 180);
		}
		
		this.update = function(elapsed) {
		
			if (this.landed) return;
			
	    	if (this.movement != NONE) {
	    		
	    		var deltaA = elapsed * FROG_SPEED * 1.05;
	        	var delta = elapsed * FROG_SPEED * 1.3;
	        	
	        	if (this.movement == LEFT) {
	        		this.angle -= deltaA;
	        		if (this.angle < -60) {
	        			this.angle = -60;
	        		}
	        	} else if (this.movement == RIGHT) {
	        		this.angle += deltaA;
	        		if (this.angle > 60) {
	        			this.angle = 60;
	        		}
	        	} else if (this.movement == UP) {

	        		var xp = 0;
	        		var yp = 0;
	        		if (this.slope < 0) {
	        			xp = -(delta / Math.sqrt((1 + Math.pow(this.slope, 2))));
	        		} else {
	        			xp = (delta / Math.sqrt((1 + Math.pow(this.slope, 2))));
	        		}
	        		yp = this.slope * xp;
	        		
	        		this.position.x += xp;
	        		this.position.y -= yp;
	        		
	        		this.alreadyJumped += delta;
	        		if (this.alreadyJumped >= this.jumpDistance) {
	        			// do this stuff after we've jumped the whole way
	        			this.movement = NONE;
	        			this.jumpDistance = MIN_JUMP;
	        			this.alreadyJumped = 0;
	        			this.landed = true;
	        		}
	        		
	        	}

	    	} else if (this.poweringUp) {
	    		
	    		var d = elapsed * 0.25;
	    		this.jumpDistance += d;
	    		if (this.jumpDistance > 400) {
	    			this.jumpDistance = 400;
	    		}
	    		
	    	}

			
		}
		
		this.setDirection = function(dir) {
			
			if (this.movement == UP) return;

			if (dir == UP) {
					
				this.jumpDistance = 550;
				this.poweringUp = false;
				this.movement = UP;
	    		this.slope = Math.tan((90 - this.angle) * (Math.PI / 180));
				
			} else if (dir == NONE) {
				this.movement = dir;
			} else if (dir == RIGHT || dir == LEFT) {
				this.movement = dir;
			}
			
		};

		this.draw = function(context) {

			if (this.landed) return;

			var i = this.getImage(false);
			context.save();
			context.translate((this.position.x),(this.position.y));
			context.rotate(this.angle * (Math.PI / 180));
			context.drawImage(i,-(i.width/2),-(i.height/2));
			context.restore();
			
		};

	} // Frog()
	
	function Bubbles() {
		
		this.frame = bubbles_img;
		this.position = {
				x: Math.floor(Math.random()*frogGame.canvas.width),
				y: frogGame.canvas.height + (this.frame.height/2) 
		};
		
		this.update = function(elapsed) {
			
			var movement = elapsed * FOOD_SPEED;
	        	
			// bubbles only rise
			this.position.y -= movement;

		};
		
		this.draw = function(context) {

			context.save();
			context.translate((this.position.x),(this.position.y));
			context.drawImage(this.frame,-(this.frame.width/2),-(this.frame.height/2));
			context.restore();
			
		};
		
	} // Bubbles()
	
	function Food() {
		
		this.frame = food_img;
		this.radius = 12.5;
		this.rotation = Math.floor(Math.random()*360),
		this.eaten = false;
		this.value = 10;
		this.position = {
				x: 0,
				y: 0
		};
		
		this.update = function(elapsed) {
			
			if (this.eaten) return;
			
			var movement = elapsed * FOOD_SPEED;
	        	
			// food only falls
			this.position.y += movement;

		};
		
		this.draw = function(context) {

			if (this.eaten) return;

			context.save();
			context.translate((this.position.x),(this.position.y));
			context.rotate(this.rotation * Math.PI/180);
			context.drawImage(this.frame,-(this.frame.width/2),-(this.frame.height/2));
			context.restore();
			
		};
		
	} // Food()

	function Fish() {
		
		this.frameIndex = 0;
		this.radius = 15; //42;
		this.intOffsetX = 20; //108;
		this.value = -999; // game over!
		this.frameTimer = 0;
		this.frameLength = 300;
		this.direction = (Math.random() < 0.5 ? RIGHT : LEFT);
		if (this.direction == RIGHT) {
			this.frameSet = fishRightFrames;
		} else {
			this.frameSet = fishLeftFrames;
			this.intOffsetX = -this.intOffsetX; // reverse for fish facing the other way
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
		
	} // Fish()

	function Plant() {
		
		this.frameIndex = 0;
		this.frameTimer = 0;
		this.frameLength = 200;
		this.frameSet = [ plant1, plant2, plant3, plant4 ];
		this.numFrames = this.frameSet.length;
		this.position = {
				x: Math.floor(Math.random()*frogGame.canvas.width),
				y: frogGame.canvas.height - Math.floor(Math.random()*200)
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

		};
		
		this.draw = function(context) {

			var frame = this.frameSet[this.frameIndex];
			
			context.save();
			context.translate((this.position.x),(this.position.y));
			context.drawImage(frame,-(frame.width/2),-(frame.height/2));
			context.restore();
			
		};
		
	} // Plant()

	function Tadpole(lvl, b) {
		
		this.level = lvl;
		this.bad = b;
		this.frame = null;
		this.direction = NONE;
		this.lastDirection = RIGHT;
		this.radius = 25;
		this.points = 0;
		this.value = -10;
		this.hurting = false;
		this.hurtTimer = 0;
		this.slope = 0;
		this.position = { x: 0, y: 0 };
		this.distX = 0;
		
		if (this.bad) {
			
			// from the left, or from the right?
			if (Math.random() < 0.5) {
				this.lastDirection = RIGHT;
				this.direction = LEFT;
				this.position.x = frogGame.canvas.width;
			} else {
				this.lastDirection = LEFT;
				this.direction = RIGHT;
			}
			
			// frog should appear somewhere between 0 and the lower bound of the canvas
			var y = Math.floor(Math.random()*frogGame.canvas.height);
			this.position.y = y;
			
			// if frog is on the top half, it should trend down. bottom half? trend up!
			var u = ((this.position.y > (frogGame.canvas.height / 2)) ? 1 : -1);
			this.slope = ((Math.random() * 7) / 10) * u;
			
		}

		var hFrames = (this.bad ? (this.direction == LEFT ? badLeftFrames : badRightFrames) : (this.direction == LEFT ? heroLeftFrames : heroRightFrames));
		this.frame = hFrames[this.level - 1];

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
	        	
	        	if (this.bad && this.level > 2) {
	        		// flip the slope every 200 units moved along the x axis
	        		this.distX += Math.abs(dx);
	        		if (this.distX > 300) {
	        			this.slope = -this.slope;
	        			this.distX = 0;
	        		}
	        	}

	        	this.position.x += dx;
	        	this.position.y += dy;
	        	
	        	// check bounds
	        	if (!this.bad) {
	        		if (this.position.x < 0) {
	        			this.position.x = 0;
	        		} else if (this.position.x > frogGame.canvas.width) {
	        			this.position.x = frogGame.canvas.width;
	        		} else if (this.position.y < 0) {
	        			this.position.y = 0;
	        		} else if (this.position.y > frogGame.canvas.height) {
	        			this.position.y = frogGame.canvas.height;
	        		}
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
		
		
	} // Tadpole()
	
	function FrogGame() {
		
		this.fps = 50;
		this.mode = PREGAME_MODE;
		this.lastMode = PREGAME_MODE;
		this.level = 1;
		this.allowKeypress = true;
		
		this.lastTime = null;
		this.gameStart = null;
		this.paused = false;
		this.pauseTime = 0;
		
		this.countdownTimer = 60; // length of bonus round in seconds
		this.secondTimer = 0;
		
		this.sounds = true;
		
		this.foodWait = 0;
		this.frogWait = 0;
		this.fishWait = 20000; // first fish won't show up for 20 seconds
		this.lpWait = 0;
		this.bWait = 1500; // first bubbles show up after 1.5 seconds
		this.dfWait = 2000;
		
		this.foodTimer = 0;
		this.frogTimer = 0;
		this.fishTimer = 0;
		this.lpTimer = 0;
		this.bTimer = 0;
		this.dfTimer = 0;
		
		this.canvas = null;
		this.ctx = null;
		
		this.frog = null;
		
		this.lastKey = 0;
		
		this.sprites = [];
		this.bsprites = [];
		this.plant = null;
		
		// counters for score
		this.totalTime = 0;
		this.frogsJumped = 0;
		this.lilypadHit = 0;
		
		this.reset = function() {
			
			this.hideStatsDiv();
			
			this.level = 1;
			this.lastTime = null;
			this.gameStart = null;
			this.pauseTime = 0;
			this.countdownTimer = 60; // length of bonus round in seconds
			this.secondTimer = 0;
			this.paused = false;
			$('#pauseButton').removeClass('down');
			this.allowKeypress = true;

			this.foodWait = 0;
			this.frogWait = 0;
			this.fishWait = 20000; // first fish won't show up for 20 seconds
			this.lpWait = 0;
			this.bWait = 1500; // first bubbles show up after 1.5 seconds
			this.dfWait = 2000;
			
			this.foodTimer = 0;
			this.frogTimer = 0;
			this.fishTimer = 0;
			this.lpTimer = 0;
			this.bTimer = 0;
			this.dfTimer = 0;
			
			this.frog = null;
			
			this.lastKey = 0;
			
			this.sprites = [];
			this.bsprites = [];
			this.plant = null;

			this.totalTime = 0;
			this.frogsJumped = 0;
			this.lilypadHit = 0;

			this.changeMode(PREGAME_MODE);

			var me = this;
			window.requestAnimationFrame(function(e) { me.run(e); });
			
		}
		
		
		this.keyHandler = function(event) {
			
			if (this.mode == PREGAME_MODE) {
				
				this.changeMode(GAME_MODE);
				
			} else if (this.mode == PREBONUS_MODE) {
				
				if (this.allowKeypress && event.type == "keyup") {
					this.changeMode(BONUS_MODE);
					this.lastKey = 0;
				}
				event.preventDefault();
				return;
				
			}
			
			if (event.type == "keyup") {
				
				if (event.keyCode == this.lastKey) {
					this.frog.setDirection(NONE);
					this.lastKey = 0;
				}
				
			} else if (event.type == "keydown") {

				// see if we're just holding the same key down
				if (event.keyCode == this.lastKey) {
					event.preventDefault();
					return;
				}
				
				switch (event.keyCode) {
				case 37:
				case 65:
				case 97:
					// LEFT ARROW or A
					this.frog.setDirection(LEFT);
					event.preventDefault();
					break;
				case 38:
				case 87:
				case 119:
					// UP ARROW or W
					this.frog.setDirection(UP);
					event.preventDefault();
					break;
				case 39:
				case 68:
				case 100:
					// RIGHT ARROW or D
					this.frog.setDirection(RIGHT);
					event.preventDefault();
					break;
				case 40:
				case 83:
				case 115:
					// DOWN ARROW or S
					this.frog.setDirection(DOWN);
					event.preventDefault();
					break;
				}
				this.lastKey = event.keyCode;

			}
			
		};
		
		this.pause = function(e) {
			
			if (this.mode == PREGAME_MODE || this.mode == PREBONUS_MODE || this.mode == GAME_OVER_MODE) {
				// can't pause these modes
				return;
			}
			
			if (this.paused) {
				$(e).removeClass('down');
			} else {
				$(e).addClass('down');
			}
			this.paused = !this.paused;
			
		};

		this.setup = function(options) {
			
			this.canvas = options.canvas;
			this.ctx = this.canvas.getContext("2d");

			this.changeMode(PREGAME_MODE);

			var me = this;
			window.requestAnimationFrame(function(e) { me.run(e); });

		};
		
		this.pregameLoop = function() {
			this.pregameDraw();
		};

		this.pregameDraw = function() {
			
			this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
			this.ctx.fillStyle="#58ACFA";
			this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
			
			if (this.sounds && (soundsLoaded < soundsToLoad.length)) {
				
				this.ctx.save();
				this.ctx.translate(this.canvas.width/2,this.canvas.height/2);
				this.ctx.drawImage(loading_img,-(loading_img.width/2),-(loading_img.height/2));
				this.ctx.restore();
				
			} else {
			
				this.ctx.save();
				this.plant.draw(this.ctx);
				this.ctx.restore();

				this.ctx.save();
				this.frog.draw(this.ctx);
				this.ctx.restore();

				this.ctx.save();
				this.ctx.translate(this.canvas.width/2,100);
				this.ctx.drawImage(desc_img,-(desc_img.width/2),-(desc_img.height/2));
				this.ctx.restore();

				this.ctx.save();
				this.ctx.translate(this.canvas.width/2,this.canvas.height-100);
				this.ctx.drawImage(how_to,-(how_to.width/2),-(how_to.height/2));
				this.ctx.restore();

			}

		};

		this.preBonusLoop = function(elapsed) {
			
			this.secondTimer += elapsed;
			if (this.secondTimer >= 1000) {
				this.secondTimer = 0;
				this.countdownTimer--;
			}
			
			if (this.countdownTimer == 0) {
				this.allowKeypress = true;
			}

			this.preBonusDraw();
			
		};

		this.preBonusDraw = function() {
			
			this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
			this.ctx.fillStyle="#86B404";
			this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)

			this.ctx.save();
			this.ctx.translate(135,60);
			this.ctx.drawImage(frog_word_img,-(frog_word_img.width/2),-(frog_word_img.height/2));
			this.ctx.restore();
			
			this.ctx.save();
			this.ctx.translate(240,150);
			this.ctx.drawImage(instructions,-(instructions.width/2),-(instructions.height/2));
			this.ctx.restore();
			
			this.ctx.save();
			this.ctx.translate(240,240);
			this.ctx.drawImage(instructions2,-(instructions2.width/2),-(instructions2.height/2));
			this.ctx.restore();
			
			this.ctx.save();
			this.ctx.translate(235,335);
			this.ctx.drawImage(points_img,-(points_img.width/2),-(points_img.height/2));
			this.ctx.restore();

			if (this.allowKeypress) {
				this.ctx.save();
				this.ctx.translate(235,400);
				this.ctx.drawImage(pakts,-(pakts.width/2),-(pakts.height/2));
				this.ctx.restore();
			}

			this.ctx.save();
			this.ctx.translate(this.canvas.width*5/6,this.canvas.height*2/3);
			this.ctx.drawImage(open_mouth,-(open_mouth.width/2),-(open_mouth.height/2));
			this.ctx.restore();

		};
		
		this.run = function(timestamp) {

			var elapsed;
			if (this.lastTime === null) this.lastTime = timestamp;
			elapsed = timestamp - this.lastTime;
			this.lastTime = timestamp;

			if (!this.paused) {
				if (this.mode == PREGAME_MODE) {
					this.pregameLoop(elapsed);
				} else if (this.mode == GAME_MODE) {
					this.gameLoop(elapsed)
				} else if (this.mode == PREBONUS_MODE) {
					this.preBonusLoop(elapsed);
				} else if (this.mode == BONUS_MODE) {
					this.bonusLoop(elapsed);
				} else if (this.mode == GAME_OVER_MODE) {
					this.gameOverLoop(elapsed);
					return; // don't loop back here again
				}
			} else {
				this.pauseTime += elapsed;
			}
			
			var me = this;
			window.requestAnimationFrame(function(e) { me.run(e); });
			
		};
		
		this.gameOverLoop = function(elapsed) {
			
			// no separate draw function is needed for this one...
			
			this.ctx.save();
			this.ctx.translate(this.canvas.width/2,this.canvas.height/3);
			if (this.lastMode == BONUS_MODE) {
				this.ctx.drawImage(greatjob_img,-(greatjob_img.width/2),-(greatjob_img.height/2));
			} else {
				this.ctx.drawImage(gameover_img,-(gameover_img.width/2),-(gameover_img.height/2));
			}
			this.ctx.restore();

		};
		
		this.gameLoop = function(elapsed) {
			
			// ======= update stuff
			
			this.plant.update(elapsed);
			
			for (var i = 0; i < this.sprites.length; i++) {
				this.sprites[i].update(elapsed);
				// this is a hack - won't let frogs hit each other - fix later
				if (this.sprites[i] !== this.frog) {
					if (!this.sprites[i].eaten && this.intersect(this.frog, this.sprites[i])) {
						if (this.sprites[i].deflect) {
							// "bad" tadpole
							this.sprites[i].deflect();
							this.frog.hurt();
						} else {
							// food
							this.sprites[i].eaten = true;
						}
						this.addPoints(this.sprites[i].value);
					}
				}
			}

			for (var i = 0; i < this.bsprites.length; i++) {
				this.bsprites[i].update(elapsed);
			}			
			
			this.addFood(elapsed);
			this.addFrog(elapsed);
			this.addFish(elapsed);
			this.addBubbles(elapsed);
			
			// ======= draw
			
			this.gameDraw();
			

		};
		
		this.gameDraw = function() {
			
			this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
			this.ctx.fillStyle="#58ACFA";
			this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)

			
			this.ctx.save();
			
			// draw background (plant)
			this.plant.draw(this.ctx);
			
			// draw normal stuff
			for (var i = 0; i < this.sprites.length; i++) {
				this.sprites[i].draw(this.ctx);
			}
			
			// always draw bubbles on top
			for (var i = 0; i < this.bsprites.length; i++) {
				this.bsprites[i].draw(this.ctx);
			}
			
			
			this.ctx.restore();
			
		};

		this.bonusLoop = function(elapsed) {
			
			// ======= update stuff

			var onLilypad = false;
			for (var i = 0; i < this.sprites.length; i++) {
				this.sprites[i].update(elapsed);
				if (this.sprites[i] !== this.frog) {
					if (!this.sprites[i].done && this.intersect(this.frog, this.sprites[i])) {
						if (this.sprites[i].addFrog) {
							// lilypad
							this.sprites[i].addFrog(this.frog.getRotation(), this.frog.getImage(true));
							this.frog.landed = true;
							onLilypad = true;
							this.lilypadHit++;
							this.addPoints(this.sprites[i].value);
						} else {
							// dragonfly
							this.addTime(this.sprites[i].value);
							this.sprites[i].done = true;
							soundManager.stop("buzz");
						}
					}
				}
			}

			if (this.frog.landed) {
				if (!onLilypad && this.sounds) {
					soundManager.play("splash");
				}
				this.frog.reset();
				this.frogsJumped++;
			}

			this.addPad(elapsed);
			this.addFly(elapsed);
			this.subtractTime(elapsed);
			
			// ======= draw
			
			this.bonusDraw();
			

		};
		
		this.bonusDraw = function() {
			
			this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
			this.ctx.fillStyle="#58ACFA";
			this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
			
			this.ctx.save();

			// draw edge of pond
			for (var p = 0; p < (this.canvas.width / 100); p++) {
				this.ctx.save();
				this.ctx.translate((p*100) + 50, this.canvas.height - 40);
				this.ctx.drawImage(pond_edge,-(pond_edge.width/2),-(pond_edge.height/2));
				this.ctx.restore();
			}

			// draw everything but frog
			for (var i = 0; i < this.sprites.length; i++) {
				if (this.sprites[i] !== this.frog) {
					this.sprites[i].draw(this.ctx);
				}
			}

			// draw frog last
			this.frog.draw(this.ctx);

			
			this.ctx.restore();
			
		};

		
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
			
		};
		
		this.addFrog = function(elapsed) {
			
			this.frogTimer += elapsed;
			if (this.frogTimer >= this.frogWait) {

				// time to add another frog
				
				var f = new Tadpole(this.level, true);
				this.sprites.push(f);
				
				// reset timer and wait time
				this.frogTimer = 0;
				this.frogWait = 1000 + Math.floor(Math.random()*400);
				this.frogWait -= 200 * (this.level - 1);
				// new frog appears between 1.2 and 1.6 seconds in level 1,
				//                  between 1.0 and 1.4 seconds in level 2,
				//                  between 0.8 and 1.2 seconds in level 3
				
			}
			
		};
		
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
			
		};

		this.addBubbles = function(elapsed) {
			
			this.bTimer += elapsed;
			if (this.bTimer >= this.bWait) {
				// time to add more bubbles
				var b = new Bubbles();
				this.bsprites.push(b);
				// reset timer and wait time
				this.bTimer = 0;
				this.bWait = 5500 + Math.floor(Math.random()*3300);
				// new bubbles appear between 5.5 and 8.8 seconds
			}
			
		};

		this.addPad = function(elapsed) {
			
			this.lpTimer += elapsed;
			if (this.lpTimer >= this.lpWait) {

				// time to add another lilypad
				
				var f = new LilyPad();
				this.sprites.push(f);

				// reset timer and wait time
				this.lpTimer = 0;
				this.lpWait = 2300;
				
			}
			
		};

		this.addFly = function(elapsed) {
			
			this.dfTimer += elapsed;
			if (this.dfTimer >= this.dfWait) {

				// time to add another dragonfly
				
				soundManager.play('buzz');
				
				var f = new Dragonfly();
				this.sprites.push(f);

				// reset timer and wait time
				this.dfTimer = 0;
				this.dfWait = 4300;
				
			}
			
		};

		this.addTime = function(v) {

			if (this.sounds) {
				soundManager.play('eat');
			}
			this.countdownTimer += v;
			this.setStatus();
			
		};
		
		this.addPoints = function(v) {

			if (v == -999) {
				// game over!
				this.changeMode(GAME_OVER_MODE);
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
				if (this.sounds) soundManager.play('levelup');
			}
			
			progressBar((this.frog.points / LEVEL_UP) * 100, $('#progressBar'));
			
		};
		
		this.subtractTime = function(elapsed) {
			
			this.secondTimer += elapsed;
			if (this.secondTimer >= 1000) {
				this.secondTimer = 0;
				this.countdownTimer--;
				this.setStatus();
			}
			
			if (this.countdownTimer == 0) {
				// time's up!
				this.changeMode(GAME_OVER_MODE);
			}
			
		};
		
		this.setStatus = function() {

			if (this.mode == PREGAME_MODE) {
				
				$('#status').html("&nbsp;");

			} else if (this.mode == GAME_MODE) {

				if (this.level > LEVEL_NAMES.length) {

					this.changeMode(PREBONUS_MODE);

				} else {
					$('#status').text("Level: " + LEVEL_NAMES[this.level - 1]);
				}

			} else if (this.mode == PREBONUS_MODE) {

				// made it to the end!
				var endTime = (new Date()).getTime();
				var elapsed = Math.floor((endTime - this.gameStart - this.pauseTime) / 1000);
				this.totalTime = elapsed;
				
				var stats = "<p>You became a frog in " + elapsed + " seconds!</p>";
				this.showStatsDiv(stats, false);
				$('#status').text("You made it!");

			} else if (this.mode == BONUS_MODE) {

				$('#status').text("Time Remaining: " + this.countdownTimer + " seconds");

			} else if (this.mode == GAME_OVER_MODE) {

				if (this.lastMode == GAME_MODE) {

					var endTime = (new Date()).getTime();
					var elapsed = (endTime - this.gameStart) / 1000;
					var totalTime = elapsed;
					
					$('#status').text("Try again with another tadpole!");
					
				} else if (this.lastMode == BONUS_MODE) {
					
					var accuracy = (this.frogsJumped > 0 ? Math.floor((this.lilypadHit / this.frogsJumped) * 100) : 0);
					var bonusPoints = this.frog.points + (this.level * 200);

					this.showStatsDiv("<p>Final Stats:<br/>Became a Frog in " + this.totalTime + " seconds!</br>Lilypad Points: " + bonusPoints + "!<br/>Lilypad Accuracy: " + accuracy + "%</p>", true);
					
					$('#status').text("Time's up!");
					
				} else {
					
					$('#status').text("GAME OVER!!");
					
				}

			}
			
		};
		
		this.hideStatsDiv = function() {
			
			$('#finalStats').text("");
			$('#finalStats').css({
				'display': 'none'
			});
			
		}
		
		this.showStatsDiv = function(html, box) {
			
			var coff = $(this.canvas).offset();
			var t = coff.top;
			var l = coff.left;
			
			if (box) {
				$('#finalStats').addClass("box");
			} else {
				$('#finalStats').removeClass("box");
			}

			$('#finalStats').html(html);
			var fsw = $('#finalStats').width();

			if (box) {
				t = t + 190;
				l = l + (this.canvas.width / 2) - (fsw / 2) - 20;
			} else {
				t = t + 40;
				l = l + 290;
			}
			
			$('#finalStats').css({
				'top': t + "px",
				'left': l + "px",
				'display': 'block'
			});
			
		}
		
		this.changeMode = function(newMode) {

			this.lastMode = this.mode;
			this.mode = newMode;

			if (newMode == PREGAME_MODE) {
				
				soundManager.stop('background');

				this.frog = new Tadpole(this.level);
				this.frog.position.x = this.canvas.width / 2;
				this.frog.position.y = this.canvas.height / 2;
				
				this.sprites = [];
				this.sprites.push(this.frog);
				
				this.plant = new Plant();

				progressBar(0, $('#progressBar'));

			} else if (newMode == GAME_MODE) {
				
				this.gameStart = (new Date()).getTime();
				progressBar(0, $('#progressBar'));
				
				if (this.sounds) soundManager.play('background');
				
			} else if (newMode == PREBONUS_MODE) {

				this.countdownTimer = 3;
				this.allowKeypress = false;
				this.sprites = [];
				progressBar(0, $('#progressBar'));
				
			} else if (newMode == BONUS_MODE) {
				
				this.countdownTimer = 60;
				this.hideStatsDiv();
				this.level = 0;
				this.sprites = [];
				this.frog = new Frog();
				this.frog.position.x = this.canvas.width / 2;
				this.frog.position.y = this.canvas.height - 50;
				this.sprites.push(this.frog);

			} else if (newMode == GAME_OVER_MODE) {
				
				soundManager.stop('background');
				if (this.sounds) {
					if (this.lastMode == BONUS_MODE) {
						soundManager.play('complete'); 
					} else {
						soundManager.play('gameover');
					}
				}
				
			}
			
			this.setStatus();
			
		} 
		
		this.intersect = function(sprite1, sprite2) {
			
			if (sprite1.hurting || sprite2.hurting) return false;
			
			var ox1 = 0;
			var ox2 = 0;
			if (sprite1.intOffsetX) {
				ox1 = sprite1.intOffsetX;
			}
			if (sprite2.intOffsetX) {
				ox2 = sprite2.intOffsetX;
			}
			
			var distX = (sprite2.position.x + ox2) - (sprite1.position.x + ox1);
			var distY = sprite2.position.y - sprite1.position.y;
			var magSq = distX * distX + distY * distY;
			return magSq < (sprite1.radius + sprite2.radius) * (sprite1.radius + sprite2.radius);
			
		}
		
		this.createSounds = function() {
			
			for (var i = 0; i < soundsToLoad.length; i++) {
				
				var p = {
					id: soundsToLoad[i].name,
					url: soundsToLoad[i].url,
					autoLoad: true,
					onload: function() {
	    				soundsLoaded++;
	    			}
				};
				
				if (soundsToLoad[i].loop) {
					p.onfinish = function() {
						this.play();
					};
				}
				
				if (soundsToLoad[i].volume) {
					p.volume = soundsToLoad[i].volume;
				}
				
				soundManager.createSound(p);
				
			}
			
		}
		
		
	} // FrogGame()
	
	frogGame = new FrogGame();
	
	window.frogGame = frogGame;
	
}(window));

