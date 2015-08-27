"use strict";

meta.controller("MutationScreen", 
{
	onLoad: function() {
		Game.load();
	},

	onFirstReady: function()
	{
		this.view.z = 99999999;

		var bgTexture = new Resource.SVG();
		bgTexture.fillRect(0, 0, meta.camera.width, meta.camera.height);
		var bg = new Entity.Geometry(bgTexture);
		bg.alpha = 0.8;
		this.view.attach(bg);

		var pickText = new Entity.Geometry("Text-Select-Mutation");
		pickText.pivot(0.5);
		pickText.anchor(0.5, 0.2);
		this.view.attach(pickText);

		var rangedMutIcon = new MutationCheckbox("Icon-Melee");
		rangedMutIcon.pivot(0.5);
		rangedMutIcon.anchor(0.5, 0.47);
		this.view.attach(rangedMutIcon);

		var rangedMutText = new Entity.Geometry("Text-Melee");
		rangedMutText.pivot(0.5);
		rangedMutText.anchor(0.5, 0.7);
		this.view.attach(rangedMutText);



		// var rangedMutIcon = new MutationCheckbox("Icon-Melee");
		// rangedMutIcon.pivot(0.5);
		// rangedMutIcon.anchor(0.39, 0.47);
		// this.view.attach(rangedMutIcon);

		// var meleeMutIcon = new MutationCheckbox("Icon-Ranged");
		// meleeMutIcon.pivot(0.5);
		// meleeMutIcon.anchor(0.61, 0.47);
		// this.view.attach(meleeMutIcon);

		// var rangedMutText = new Entity.Geometry("Text-Melee");
		// rangedMutText.pivot(0.5);
		// rangedMutText.anchor(0.39, 0.7);
		// this.view.attach(rangedMutText);

		// var meleeMutText = new Entity.Geometry("Text-Ranged");
		// meleeMutText.pivot(0.5);
		// meleeMutText.anchor(0.61, 0.7);
		// this.view.attach(meleeMutText);
	}
});

meta.class("MutationCheckbox", "Entity.Geometry", 
{
	onCreate: function() 
	{
		this.picking = true;

		var selection = new Entity.Geometry("Icon-Select"); 
		selection.pivot(0.5);
		selection.anchor(0.5);
		selection.visible = false;
		this.attach(selection);
	},

	onHoverEnter: function(data) 
	{
		meta.resources.getSound("UI-Hover-" + meta.random.number(1, 2)).play();

		this.children[0].visible = true;
		meta.engine.cursor = "pointer";
	},

	onHoverExit: function(data) {
		this.children[0].visible = false;
		meta.engine.cursor = "auto";
	},

	onClick: function() 
	{
		meta.resources.getSound("UI-Select-" + meta.random.number(1, 2)).play();

		MutationScreen.unload();
		Game.start();
	}
});