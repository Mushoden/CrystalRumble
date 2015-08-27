"use strict";

meta.class("Player", "Character", 
{
	createShadow: function()
	{
		var shadow = new Entity.Geometry("Shadow");
		shadow.pivot(0.5);
		shadow.anchor(0.5, 1.01);
		shadow.scale(0.85)
		shadow.z = -0.1;
		this.attach(shadow);
		this.shadow = shadow;

		//this.debug = true;

		this.healthBar = new UI.ProgressBar("Lifebar-Bg", "Lifebar");
		this.healthBar.pivot(0.5);
		this.healthBar.anchor(0.5, -0.05);
		this.healthBar.z = 999999;
		this.attach(this.healthBar);
		this.healthBar.children[0].position(1, 0);
	},

	queueStartCombo: function() 
	{
		this.needStartAttack = true;

		if(this.attackDelay > 0.4) {
			this.comboId = 0;
		}
	},

	queueEndCombo: function() {
		this.needStartAttack = false;
	},

	startAttack: function()
	{
		this.updateAttackPrefix();
		this.continueAttack();
	},

	updateAttackPrefix: function()
	{
		if(this.dirX === 1) {
			this.dirPrefix = "Bulky-";
		}
		else if(this.dirX === -1) {
			this.dirPrefix = "Bulky-";
		}
		else if(this.dirY === 1) {
			this.dirPrefix = "Bulky-Front-";
		}
		else if(this.dirY === -1) {
			this.dirPrefix = "Bulky-Back-";
		}		
	},

	updateTextureFromDir: function()
	{
		if(this.dirX === 1) {
			this.texture = this.texturePrefix;
			this.flipX = 1;
			this.pivot(0.5, 0.94)
		}
		else if(this.dirX === -1) {
			this.texture = this.texturePrefix;
			this.flipX = -1;
			this.pivot(0.5, 0.94)
		}
		else if(this.dirY === 1) {
			this.texture = this.texturePrefix + "-Front";
			this.flipX = 1;
			this.pivot(0.5, 0.98)
		}
		else if(this.dirY === -1) {
			this.texture = this.texturePrefix + "-Back";
			this.flipX = 1;
			this.pivot(0.5, 0.94)
		}
	},

	continueAttack: function() 
	{
		if(!this.needStartAttack) {
			this.attackDelay = 0;
			this.updateTextureFromDir();
			return;
		}

		if(this.needChangeDir) {
			this.updateTextureFromDir();
			this.updateAttackPrefix();
			this.needChangeDir = false;
		}

		switch(this.comboId) 
		{
			case 0:
				this.texture = this.dirPrefix + "Hit1";
				meta.resources.getSound("Ice-Punch-1").play();
				Game.doDmg(1);
				break;

			case 1:
				this.texture = this.dirPrefix + "Hit2";
				meta.resources.getSound("Ice-Punch-2").play();
				Game.doDmg(1);
				break;

			case 2:
				this.texture = this.dirPrefix + "Slam";
				meta.resources.getSound("Ice-Slam").play();
				Game.doDmg(2);
				break;
		}

		this.comboId++;
		if(this.comboId > 2) {
			this.comboId = 0;
		}
	},

	update: function(tDelta)
	{
		var pressed = meta.input.pressed;
		var game = Game;

		var pressedDirectionX = 0;
		var pressedDirectionY = 0;

		if(this.anim.__index !== -1) 
		{
			if(pressed.A || pressed.LEFT) {
				this.dirX = -1;
				this.dirY = 0;
				this.needChangeDir = true;
			}
			else if(pressed.D || pressed.RIGHT) {
				this.dirX = 1;
				this.dirY = 0;
				this.needChangeDir = true;
			}
			else if(pressed.W || pressed.UP) {
				this.dirX = 0;
				this.dirY = -1;
				this.needChangeDir = true;
			}
			else if(pressed.S || pressed.DOWN) {
				this.dirX = 0;
				this.dirY = 1;
				this.needChangeDir = true;
			}

			return;
		}
		else {
			this.attackDelay += tDelta;
		}

		if(this.needStartAttack && !this.haveTarget) {
			this.startAttack();
			return;
		}
		else if(pressed.A || pressed.LEFT) {
			pressedDirectionX = -1;
		}
		else if(pressed.D || pressed.RIGHT) {
			pressedDirectionX = 1;
		}
		else if(pressed.W || pressed.UP) {
			pressedDirectionY = -1;
		}
		else if(pressed.S || pressed.DOWN) {
			pressedDirectionY = 1;
		}

		if(!this.haveTarget) 
		{
			if(pressedDirectionX !== 0 || pressedDirectionY !== 0) 
			{
				var targetCellX = this.cellX + pressedDirectionX;
				var targetCellY = this.cellY + pressedDirectionY;
				var gid = game.getGid(targetCellX, targetCellY);
				if(gid !== 1) {
					this.dirX = pressedDirectionX;
					this.dirY = pressedDirectionY;
					this.updateTextureFromDir();
					return;
				}

				this.setCell(targetCellX, targetCellY);
				this.targetX = (this.cellX * game.tileWidth) + game.halfTileWidth;
				this.targetY = (this.cellY * game.tileHeight) + game.halfTileHeight;
				this.haveTarget = true;
			}
		}

		this.updateMovement(tDelta);
	},

	updateMovement: function(tDelta)
	{
		if(this.haveTarget) 
		{
			var speed = 330 * tDelta;

			var length = meta.math.length(this.x, this.y, this.targetX, this.targetY);
			if(length <= speed) {
				this.position(this.targetX, this.targetY);
				this.haveTarget = false;
			}
			else
			{
				this.velocity.x = this.targetX - this.x;
				this.velocity.y = this.targetY - this.y;
				this.velocity.normalize();

				var posX = this.x + (this.velocity.x * speed);
				var posY = this.y + (this.velocity.y * speed);
				this.position(posX, posY);
			}	
		}

		var offsetY = Math.sin(this.time * Math.PI) * -2;
		this.offset(0, offsetY);

		var scale = 0.65 + (((offsetY + 2) / 4) * 0.15);
		this.shadow.scale(scale);

		this.time += tDelta * 1;
	},

	//
	gid: 3,
	time: 0,
	shadow: null,
	comboId: 0,
	attackDelay: 0
});