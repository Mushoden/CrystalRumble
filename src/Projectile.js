"use strict";

meta.class("Projectile", "Entity.Geometry", 
{
	update: function(tDelta)
	{
		var game = Game;
		if(game.stopped) {
			this.remove();
			return;
		}

		this.move(this.speedX * tDelta, this.speedY * tDelta);

		var cellX = Math.floor(this.x / game.tileWidth);
		var cellY = Math.floor(this.y / game.tileHeight);
		if(cellX === this.startCellX && cellY === this.startCellY) { return; }

		var index = cellX + (cellY * game.tilesX);
		var gid = game.collisionData[index];
		if(gid !== 1) 
		{
			if(gid === 3) {
				game.dmgPlayer();
			}

			this.texture = "Robot-Laser-Hit";
			this.anim.onEnd = this.onAnimEnd;
			this.updating = false;

			meta.resources.getSound("Laser-Hit").play();
		}
	},

	onAnimEnd: function() {
		this.visible = false;
		this.remove();
	},

	//
	speedX: 0,
	speedY: 0
});
