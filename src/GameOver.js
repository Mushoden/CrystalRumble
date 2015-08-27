"use strict";

meta.controller("GameOver",
{
	onLoad: function() 
	{
		meta.subscribe(this, [ Input.Event.KEY_DOWN, Input.Event.DOWN ], this.onDown);
	},

	onUnload: function() {
		meta.unsubscribe(this, [ Input.Event.KEY_DOWN, Input.Event.DOWN ]);
	},

	onFirstReady: function()
	{
		this.view.z = 99999999;

		var bgTexture = new Resource.SVG();
		bgTexture.fillRect(0, 0, meta.camera.width, meta.camera.height);
		var bg = new Entity.Geometry(bgTexture);
		bg.alpha = 0.8;
		this.view.attach(bg);

		var gameOverText = new Entity.Geometry("Text-Game-Over");
		gameOverText.pivot(0.5);
		gameOverText.anchor(0.5, 0.15);
		this.view.attach(gameOverText);

		var scoreText = new Entity.Geometry("Text-Score");
		scoreText.pivot(0.5);
		scoreText.anchor(0.5, 0.25);
		this.view.attach(scoreText);

		var scoreText = new Entity.Geometry("Score-Ring");
		scoreText.pivot(0.5);
		scoreText.anchor(0.5);
		this.view.attach(scoreText);

		this.restartText = new Entity.Geometry("Text-Restart");
		this.restartText.pivot(0.5);
		this.restartText.anchor(0.5, 0.8);
		this.view.attach(this.restartText);

		this.score = new Entity.Text();
		this.score.font = "Score-Font-Shadow";
		this.score.pivot(0.5);
		this.score.anchor(0.5);
		this.view.attach(this.score);

		var self = this;
		meta.addTimer(function() {
			self.restartText.visible = true;
		}, 1000, 1);		
	},

	onReady: function()
	{
		this.restartText.visible = false;
		this.score.text = Game.score;
	},

	onDown: function()
	{
		if(!this.restartText.visible) { return; }

		this.unload();
		MutationScreen.load();
	}
});
