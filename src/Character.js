"use strict";

meta.class("Character", "Entity.Geometry",
{
	onCreate: function()
	{
		this.velocity = new meta.math.Vector2(0, 0);
		this.createShadow();

		this.texturePrefix = this.texture.name;
	},

	updateCharTexture: function(cellX, cellY)
	{
		if(this.cellX < cellX) {
			this.dirX = 1;
			this.dirY = 0;
		}
		else if(this.cellX > cellX) {
			this.dirX = -1;
			this.dirY = 0;
		}
		else if(this.cellY < cellY) {
			this.dirX = 0;
			this.dirY = 1;
		}
		else if(this.cellY) {
			this.dirX = 0;
			this.dirY = -1;
		}

		this.updateTextureFromDir();
	},

	updateTextureFromDir: function()
	{
		if(this.dirX === 1) {
			this.fullTexturePrefix = this.texturePrefix;
			this.texture = this.texturePrefix;
			this.flipX = 1;
		}
		else if(this.dirX === -1) {
			this.fullTexturePrefix = this.texturePrefix;
			this.texture = this.texturePrefix;
			this.flipX = -1;
		}
		else if(this.dirY === 1) {
			this.fullTexturePrefix = this.texturePrefix + "-Front"
			this.texture = this.fullTexturePrefix;
			this.flipX = 1;
		}
		else if(this.dirY === -1) {
			this.fullTexturePrefix = this.texturePrefix + "-Back"
			this.texture = this.fullTexturePrefix;
			this.flipX = 1;
		}
	},

	moveToCell: function(cellX, cellY)
	{
		this.setCell(cellX, cellY);

		var game = Game;
		var posX = cellX * game.tileWidth + game.halfTileWidth;
		var posY = cellY * game.tileHeight + game.halfTileHeight;
		this.position(posX, posY);
	},

	setCell: function(cellX, cellY)
	{
		this.updateCharTexture(cellX, cellY);

		this.transferCell(this.cellX, this.cellY, cellX, cellY);
		this.cellX = cellX;
		this.cellY = cellY;

		if(this.gid === 2) {
			this.z = cellY + 0.5;
		}
		else {
			this.z = cellY;
		}
	},

	transferCell: function(currCellX, currCellY, endCellX, endCellY)
	{
		var game = Game;
		var startId = currCellX + (currCellY * game.tilesX);
		var endId = endCellX + (endCellY * game.tilesX);

		if(startId > 0 && startId < game.numCells) {
			game.objData[startId] = null;
			game.collisionData[startId] = 1;
		}

		game.objData[endId] = this;
		game.collisionData[endId] = this.gid;
	},

	//
	cellX: -1,
	cellY: -1,
	targetCellX: 0,
	targetCellY: 0,
	targetX: 0,
	targetY: 0,
	haveTarget: false,
	gid: 2,
	dirX: 1,
	dirY: 0,

	velocity: null,
	texturePrefix: ""
});
