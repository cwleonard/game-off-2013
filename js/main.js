(function(window, _undefined) {

    var UP = 0;
    var DOWN = 1;
    var RIGHT = 2;
    var LEFT = 3;

    var NONE = -1;

    var FROG_SPEED = 0.3333;
    var FOOD_SPEED = 0.1;
    
	var frogGame = null;
	
	var tadpole_right = new Image();
	var tadpole_left = new Image();
	
	tadpole_right.src = "img/tadpole_right.png";
	tadpole_left.src = "img/tadpole_left.png";
	
	var food_img = new Image();
	food_img.src = "img/food.png";
	
	function Food() {
		
		this.frame = food_img;
		this.radius = 12.5;
		this.eaten = false;
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
	
	function Frog() {

		this.frame = tadpole_right;
		this.direction = NONE;
		this.lastDirection = this.direction;
		this.radius = 25;
		this.points = 0;
		
		this.position = {
			x: 0,
			y: 0
		};

		this.setDirection = function(dir) {
			if (dir == RIGHT && this.lastDirection == LEFT) {
				this.frame = tadpole_right;
			} else if (dir == LEFT && this.lastDirection == RIGHT) {
				this.frame = tadpole_left;
			}
			if (this.direction == RIGHT || this.direction == LEFT) {
				this.lastDirection = this.direction;
			}
			this.direction = dir;
		};
		
		this.update = function(elapsed) {
			
	    	if (this.direction != NONE) {
	    		
	        	var movement = elapsed * FROG_SPEED;
	        	
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

	    	}
			
		};
		
		this.draw = function(context) {
			
			context.save();
			context.translate((this.position.x),(this.position.y));

			context.drawImage(this.frame,-(this.frame.width/2),-(this.frame.height/2));

			context.restore();
			
		};
		
		
	} // Frog()
	
	function FrogGame() {
		
		this.startTime = null;
		
		this.fps = 50;
		
		
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
			
			this.frog = new Frog();
			
			this.sprites.push(this.frog);

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
						frogGame.sprites[i].eaten = true;
						frogGame.addPoints();
					}
				}
			}
			
			frogGame.addFood();
			
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
		
		this.addFood = function() {
			
			// odds of adding a new piece of food are 1 in 500
			var n = Math.floor((Math.random()*500)+1);
			if (n == 1) {
				var f = new Food();
				// food should appear somewhere between 0 and the right bound of the canvas
				var x = Math.floor(Math.random()*this.canvas.width);
				f.position.x = x;
				this.sprites.push(f);
			}
			
		}
		
		this.addPoints = function() {
			
			this.frog.points += 10;
			document.getElementById("score").innerHTML = this.frog.points;
			
		}
		
		this.intersect = function(sprite1, sprite2) {
			
			var distX = sprite2.position.x - sprite1.position.x;
			var distY = sprite2.position.y - sprite1.position.y;
			var magSq = distX * distX + distY * distY;
			return magSq < (sprite1.radius + sprite2.radius) * (sprite1.radius + sprite2.radius);
			
		}
		
		
	} // FrogGame()
	
	frogGame = new FrogGame();
	
	window.frogGame = frogGame;
	
}(window));
