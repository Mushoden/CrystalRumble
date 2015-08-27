"use strict";

meta.controller("Game",
{
	onCreate: function()
	{
		this.astar = new AStar();

		// tilemap:
		this.tilemap = new Entity.Tilemap("assets/levels/Ship-Test.tmx");
		this.tilemap.pivot(0.5);
		this.tilemap.anchor(0.5);
		this.view.attach(this.tilemap);
	},

	onLoad: function() 
	{
		var bg = new Entity.Geometry("BG");
		bg.pivot(0.5);
		bg.anchor(0.5);
		bg.z = -1;
		this.view.attach(bg);

		var scoreBg = new Entity.Geometry("Score-Ring");
		scoreBg.pivot(0.5);
		scoreBg.anchor(0.5);
		scoreBg.z = 0.5;
		scoreBg.alpha = 0.4;
		this.view.attach(scoreBg);

		this.scoreTxt = new Entity.Text("0");
		this.scoreTxt.font = "Score-Font";
		this.scoreTxt.pivot(0.5);
		this.scoreTxt.anchor(0.5);
		this.scoreTxt.z = 0.5;
		this.scoreTxt.alpha = 0.4;
		this.view.attach(this.scoreTxt);
	},

	onUnload: function() {
		this.player.updating = false;
	},

	onReady: function()
	{
		var self = this;
		this.timer = meta.addTimer(function() {
			self.pathfindingTick();
		}, 1000);	
		this.timer.pause();

		this.spawnerTimer = meta.addTimer(function() {
			self.spawn();
		}, 2000);	
		this.spawnerTimer.pause();

		MutationScreen.load();
	},

	start: function()
	{
		var collisionLayer = this.tilemap.getLayer("Collision");
		var data = collisionLayer.data;
		this.numCells = data.length;
		this.collisionData = new Uint32Array(this.numCells);
		this.objData = new Array(this.numCells);
		for(var n = 0; n < this.numCells; n++)
		{
			if(!data[n]) {
				this.collisionData[n] = 1;
			}

			this.objData[n] = null;
		}

		var layer = this.tilemap.children[0];
		this.tilesX = layer.tilesX;
		this.tilesY = layer.tilesY;
		this.tileWidth = layer.tileWidth;
		this.tileHeight = layer.tileHeight;
		this.halfTileWidth = Math.floor(this.tileWidth * 0.5);
		this.halfTileHeight = Math.floor(this.tileHeight * 0.5);

		// tilemap debug:
		// var gridTexture = new Resource.SVG();
		// gridTexture.strokeStyle = "blue";
		// gridTexture.grid(this.tilesX, this.tilesY, this.tileWidth, this.tileHeight);
		// var grid = new Entity.Geometry(gridTexture);
		// layer.attach(grid);

		this.astar.setup(this.collisionData, this.tilesX, this.tilesY, [ 1, 3 ]);

		this.stopped = false;
		this.numToSpawn = 5;
		this.score = 0;
		this.scoreTxt.text = 0;
		this.enemies = [];
		
		// player:
		this.player = new Player("Bulky");
		this.player.z = 1;
		this.player.anim.onEnd = this.player.continueAttack;
		//this.player.debug = true;
		this.view.attach(this.player);
		this.player.moveToCell(4, 3);
		this.player.updating = true;

		meta.subscribe(this, Input.Event.DOWN, this.onKeyDown);	
		meta.subscribe(this, Input.Event.UP, this.onKeyUp);			

		this.timer.reset();		
		this.spawnerTimer.reset();
	},

	spawn: function()
	{
		if(this.numToSpawn <= 0) { return; }

		var x, y, index;
		for(;;)
		{
			x = meta.random.number(3, 16);
			y = meta.random.number(2, this.tilesY - 1);	
			index = x + (y * this.tilesX);
			if(this.collisionData[index] === 1) { break; }
		}

		if(meta.random.number(0, 2) === 0) {
			this.spawnRobotTall(x, y);
		}
		else {
			this.spawnRobotSmall(x, y);
		}	

		this.numToSpawn--;
	},

	stop: function()
	{
		this.player.needStartAttack = false;
		this.player.updating = false;
		
		this.timer.stop();		
		this.spawnerTimer.stop();

		this.stopped = true;
		meta.resources.getSound("Ice-Punch-1").stop();
		meta.resources.getSound("Ice-Punch-2").stop();
		meta.resources.getSound("Ice-Slam").stop();
		meta.resources.getSound("Laser-1").stop();
		meta.resources.getSound("Laser-2").stop();
		meta.resources.getSound("Laser-3").stop();
		meta.resources.getSound("Laser-Hit").stop();

		meta.unsubscribe(this, Input.Event.DOWN);	
		meta.unsubscribe(this, Input.Event.UP);	

		var num = this.enemies.length;
		for(var i = 0; i < num; i++) {
			var enemy = this.enemies[i];
			var index = enemy.cellX + (enemy.cellX * this.tilesX);
			enemy.updating = false;
			enemy.remove();
		}

		this.enemies = [];


		this.player.remove();
	},

	restart: function()
	{
		//Fix timer stuff
		this.stop();
		this.start();
	},

	onKeyDown: function(data, event)
	{
		if(data.keyCode !== Input.Key.BUTTON_LEFT) { return; }
 
		this.player.queueStartCombo();
	},

	onKeyUp: function(data, event)
	{
		if(data.keyCode !== Input.Key.BUTTON_LEFT) { return; }

		this.player.queueEndCombo();
	},

	spawnRobotSmall: function(cellX, cellY)
	{
		var enemy = new Enemy("RobotSmall");
		enemy.pivot(0.5, 0.7);
		enemy.armor = 1.3;
		enemy.z = 1;
		enemy.moveToCell(cellX, cellY);
		enemy.updating = true;
		enemy.alpha = 0;
		enemy.tween.to({ alpha: 1 }, 600).play();
		this.view.attach(enemy);
		this.enemies.push(enemy);
	},

	spawnRobotTall: function(cellX, cellY)
	{
		var enemy = new Enemy("RobotTall");
		enemy.pivot(0.5, 0.8);
		enemy.z = 1;
		enemy.moveToCell(cellX, cellY);
		enemy.armor = 0.85;
		enemy.updating = true;
		enemy.alpha = 0;
		enemy.tween.to({ alpha: 1 }, 600).play();
		this.view.attach(enemy);
		this.enemies.push(enemy);
	},

	doDmg: function(type)
	{
		if(type === 1)
		{
			var obj = this.getObjAt(
				this.player.cellX + this.player.dirX,
				this.player.cellY + this.player.dirY);
			if(!obj) { return; }

			obj.dmg(10, this.player.dirX * -1, this.player.dirY * -1);
		}
		else if(type === 2)
		{
			var startCellX, startCellY, endCellX, endCellY;

			if(this.player.dirX > 0)
			{
				startCellX = this.player.cellX + this.player.dirX;
				startCellY = this.player.cellY + this.player.dirY - 1;
				endCellX = this.player.cellX + (this.player.dirX * 2);
				endCellY = this.player.cellY + (this.player.dirY * 2) + 1;			
			}
			else if(this.player.dirX < 0)
			{
				endCellX = this.player.cellX + this.player.dirX;
				startCellY = this.player.cellY + this.player.dirY - 1;
				startCellX = this.player.cellX + (this.player.dirX * 2);
				endCellY = this.player.cellY + (this.player.dirY * 2) + 1;			
			}
			else if(this.player.dirY > 0)
			{
				startCellX = this.player.cellX + this.player.dirX - 1;
				startCellY = this.player.cellY + this.player.dirY;
				endCellX = this.player.cellX + (this.player.dirX * 2) + 1;
				endCellY = this.player.cellY + (this.player.dirY * 2);			
			}
			else if(this.player.dirY < 0)
			{
				startCellX = this.player.cellX + this.player.dirX - 1;
				startCellY = this.player.cellY + (this.player.dirY * 2);
				endCellX = this.player.cellX + (this.player.dirX * 2) + 1;
				endCellY = this.player.cellY + (this.player.dirY);		
			}

			for(var y = startCellY; y <= endCellY; y++)
			{
				for(var x = startCellX; x <= endCellX; x++)
				{
					var obj = this.getObjAt(x, y);
					if(!obj) { continue; }

					obj.dmg(20, this.player.dirX * -1, this.player.dirY * -1);
				}
			}
		}		
	},

	removeEnemy: function(enemy)
	{
		var id = enemy.cellX + (enemy.cellY * this.tilesX);
		this.collisionData[id] = 1;

		if(enemy.armor === 1.3) {
			this.score++;
		}
		else {
			this.score += 2;
		}
		
		this.scoreTxt.text = this.score;
		enemy.visible = false;

		var explosion = new Entity.Geometry("Explosion");
		explosion.pivot(0.5);
		explosion.position(enemy.x, enemy.y);
		explosion.z = 9999;
		explosion.anim.onEnd = function() {
			this.visible = false;
			this.remove();
		};
		this.view.attach(explosion);

		var blood = new Blood();
		blood.spawn();
		blood.pivot(0.5);
		blood.z = 0.6;
		blood.position(enemy.x, enemy.y);
		blood.tween.to({ alpha: 0 }, 4000 + meta.random.number(0, 4000)).onDone(function() {
			this.owner.remove();
		}).play();
		this.view.attach(blood);

		this.numToSpawn += 1.1;
	},

	getObjAt: function(cellX, cellY)
	{
		if(cellX < 0 || cellX >= this.tilesX) { return; }
		if(cellY < 0 || cellY >= this.tilesY) { return; }

		var index = cellX + (cellY * this.tilesX);
		var obj = this.objData[index];
		if(!obj || !obj.visible) {
			return null;
		}

		return obj; 
	},

	getGid: function(cellX, cellY)
	{
		if(cellX < 0 || cellX >= this.tilesX) { return 0; }
		if(cellY < 0 || cellY >= this.tilesY) { return 0; }

		var id = cellX + (cellY * this.tilesX);
		return this.collisionData[id];
	},

	pathfindingTick: function()
	{
		var numEnemies = this.enemies.length;
		for(var n = 0; n < numEnemies; n++)
		{
			var enemy = this.enemies[n];
			if(!enemy.visible) { continue; }

			if(enemy.staggerTime > 0) {
				enemy.staggerTime -= 1.0;
				continue;
			}

			if(this.tryShooting(enemy)) {
				continue;
			}

			var path = this.astar.search(enemy.cellX, enemy.cellY, this.player.cellX, this.player.cellY);
			if(!path || path.length < 2) { 
				continue; 
			}
			
			var node = path[0];

			if(!enemy.haveTarget) 
			{
				enemy.jumpTo(node.x, node.y);
			}		
		}
	},

	tryShooting: function(enemy)
	{
		var diffX = this.player.cellX - enemy.cellX;
		var diffY = this.player.cellY - enemy.cellY;

		if(diffX !== 0 && diffY !== 0) {
			return false;
		}

		if(!enemy.charging) {
			enemy.charging = true;

			if(diffX < 0) {
				enemy.dirX = -1;
				enemy.dirY = 0;
			}
			else if(diffX > 0) {
				enemy.dirX = 1;
				enemy.dirY = 0;
			}
			else if(diffY < 0) {
				enemy.dirX = 0;
				enemy.dirY = -1;
			}
			else if(diffY > 0) {
				enemy.dirX = 0;
				enemy.dirY = 1;
			}
			enemy.updateTextureFromDir();
			return true;
		}

		enemy.charging = false;

		var projectile = new Projectile("Robot-Laser");
		projectile.pivot(0.5);
		projectile.position(enemy.x, enemy.y - 20);
		projectile.z = enemy.totalZ - 0.4;
		projectile.updating = true;
		projectile.startCellX = enemy.cellX;
		projectile.startCellY = enemy.cellY;
		this.view.attach(projectile);

		if(diffX < 0) {
			enemy.dirX = -1;
			enemy.dirY = 0;
			projectile.speedX = -600;
		}
		else if(diffX > 0) {
			enemy.dirX = 1;
			enemy.dirY = 0;
			projectile.speedX = 600;
		}
		else if(diffY < 0) {
			enemy.dirX = 0;
			enemy.dirY = -1;
			projectile.speedY = -600;
			projectile.angle = 90;
		}
		else if(diffY > 0) {
			enemy.dirX = 0;
			enemy.dirY = 1;
			projectile.speedY = 600;
			projectile.angle = 90;
		}

		enemy.updateTextureFromDir();

		meta.resources.getSound("Laser-" + meta.random.number(1, 3)).play();

		return true;
	},

	dmgPlayer: function()
	{
		this.player.healthBar.value -= 5;

		if(this.player.healthBar.value === 0) {
			GameOver.load();
			this.stop();
		}
	},

	//
	astar: null,
	tilemap: null,

	collisionData: null,
	objData: null,
	numCells: 0,

	player: null,
	enemies: null,

	tilesX: 64,
	tilesY: 64,
	tileWidth: 32,
	tileHeight: 32,
	halfTileWidth: 0,
	halfTileHeight: 0,

	score: 0,
	numToSpawn: 0,

	textures: null
});
