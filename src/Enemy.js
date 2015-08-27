"use strict";

meta.class("Enemy", "Character", 
{
	createShadow: function()
	{
		var shadow = new Entity.Geometry("Shadow");
		shadow.pivot(0.5);
		shadow.anchor(0.5, 0.9)
		shadow.z = -0.1;
		this.attach(shadow);

		this.shadow = shadow;

		this.healthBar = new UI.ProgressBar("Lifebar-Small-Bg", "Lifebar-Small-2");
		this.healthBar.pivot(0.5);
		this.healthBar.anchor(0.5, -0.1);
		this.healthBar.z = 999999;
		this.attach(this.healthBar);
		this.healthBar.children[0].position(1, 0.5);

		this.dmgEffect = new Entity.Geometry("Ice-Impact");
		this.dmgEffect.pivot(0.5);
		this.dmgEffect.anchor(0.5);
		this.dmgEffect.visible = false;
		this.dmgEffect.anim.stop();
		this.dmgEffect.anim.onEnd = function() {
			this.visible = false;
		};
		this.attach(this.dmgEffect);
	},

	dmg: function(dmg, dirX, dirY)
	{
		dmg *= this.armor;

		if(dirX < 0) {
			this.dmgEffect.flipX = -1;
			this.dmgEffect.angle = 0;
		}
		else if(dirX > 0) {
			this.dmgEffect.flipX = 1;
			this.dmgEffect.angle = 0;
		}
		else if(dirY < 0) {
			this.dmgEffect.flipX = 1;
			this.dmgEffect.angle = 270;
		}	
		else if(dirY > 0) {
			this.dmgEffect.flipX = 1;
			this.dmgEffect.angle = 90;
		}		

		this.dmgEffect.anim.reset();
		this.dmgEffect.anim.play();
		this.dmgEffect.visible = true;

		this.staggerTime += 1;
		this.charging = false;

		this.healthBar.value -= dmg;
		if(this.healthBar.value === 0) {
			this.alpha = 0;
			Game.removeEnemy(this);
		}
	},

	jumpTo: function(cellX, cellY)
	{
		var game = Game;

		if(this.cellX !== cellX) {
			this.dir = 1;
		}
		else if(this.cellY !== cellY) {
			this.dir = 2;
		}
		else {
			console.log("unknown dir");
			return;
		}

		this.setCell(cellX, cellY);

		this.time = 0;
		this.prevX = this.x;
		this.prevY = this.y;
		this.targetX = (cellX * game.tileWidth) + game.halfTileWidth;
		this.targetY = (cellY * game.tileHeight) + game.halfTileHeight;
		this.haveTarget = true;

		this.texture = this.fullTexturePrefix + "-Jump";
	},

	update: function(tDelta)
	{
		tDelta *= 3.0;
		if(this.haveTarget)
		{
			var newX, newY;
			var offsetY;

			if(this.dir === 1) 
			{
				offsetY = Math.sin(this.time * Math.PI) * -50;
				newX = this.prevX + this.time * (this.targetX - this.prevX);
				newY = this.prevY + offsetY;
			}
			else 
			{
				offsetY = Math.sin(this.time * Math.PI) * -60;
				newX = this.prevX;
				newY = this.prevY + (this.time * (this.targetY - this.prevY)) + offsetY;
			}

			if(this.time < 0.5) {
				this.anim.frame = 0;
			}
			else {
				this.anim.frame = 1;
			}

			// 

			if(this.time > 1.0) 
			{
				this.position(this.targetX, this.targetY);
				this.shadow.position(0, 0);
				this.shadow.scale(1);
				this.haveTarget = false;
				this.texture = this.fullTexturePrefix;
			}
			else
			{
				this.position(newX, newY);
				this.shadow.position(0, -offsetY);

				if(this.time < 0.5) {
					this.shadow.scale(1.0 - this.time);
				}
				else {
					this.shadow.scale(0.5 + (this.time - 0.5));
				}

				this.time += tDelta;
			}
		}
	},

	//
	prevX: 0,
	prevY: 0,
	time: 0,
	dir: 0,
	sahdow: null,
	staggerTime: 0,

	armor: 1.0
});