"use strict";

meta.controller("Title",
{
	onFirstLoad: function()
	{
		this.view.z = 999999999999999;

		var bgTexture = new Resource.SVG();
		bgTexture.fillRect(0, 0, meta.camera.width, meta.camera.height);
		this.bg = new Entity.Geometry(bgTexture);
		this.view.attach(this.bg);

		var title = new Entity.Geometry("Title-Full");
		title.pivot(0.5);
		title.anchor(0.5);
		this.view.attach(title);
	},

	onLoad: function() 
	{
		meta.renderer.bgColor = "black";
		meta.subscribe(this, [ Input.Event.KEY_DOWN, Input.Event.DOWN ], this.onDown);
	},

	onUnload: function() {
		meta.unsubscribe(this, [ Input.Event.KEY_DOWN, Input.Event.DOWN ]);
	},

	onDown: function()
	{
		this.unload();		
		MutationScreen.load();
		//Game.load();
	}
});
