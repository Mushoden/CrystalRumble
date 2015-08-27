"use strict";

meta.onLoad = function()
{
	meta.engine.resize(1280, 720);
	meta.engine.center = true
	meta.camera.bounds(1280, 720);

	meta.loadFont("Score-Font", "assets/fonts/");
	meta.loadFont("Score-Font-Shadow", "assets/fonts/");

	meta.loadTexture([ "BG", "Shadow" ], "assets/img/");
	meta.loadTexture([ 
		"Bulky-Back", 
		{
			path: "Bulky-Back-Hit1",
			framesX: 2,
			fps: 6
		},
		{ 
			path: "Bulky-Back-Hit2",
			framesX: 2,
			fps: 6
		},
		{ 
			path: "Bulky-Back-Slam",
			framesX: 4,
			fps: 7
		} ], "assets/img/bulky/Back");
	meta.loadTexture([ 
		{ 
			path: "Bulky-Front", 
			offsetY: 40
		},
		{
			path: "Bulky-Front-Hit1",
			framesX: 2,
			fps: 6
		}, 
		{
			path: "Bulky-Front-Hit2",
			framesX: 2,
			fps: 6
		}, 
		{
			path: "Bulky-Front-Slam",
			framesX: 4,
			fps: 7
		} ], "assets/img/bulky/Front");
	meta.loadTexture([ 
		"Bulky", 
		{ 
			path: "Bulky-Hit1",
			framesX: 2,
			fps: 6
		}, 
		{
			path: "Bulky-Hit2",
			framesX: 2,
			fps: 6
		}, 
		{
			path: "Bulky-Slam",
			framesX: 4,
			fps: 7
		} ], "assets/img/bulky/Side");

	meta.loadTexture([ "RobotTall", "RobotTall-Back", "RobotTall-Front",
		{
			path: "RobotTall-Back-Jump",
			framesX: 2,
			fps: 0
		},
		{
			path: "RobotTall-Front-Jump",
			framesX: 2,
			fps: 0
		},
		{
			path: "RobotTall-Jump",
			framesX: 2,
			fps: 0
		}], "assets/img/");

	meta.loadTexture([ "RobotSmall", "RobotSmall-Back", "RobotSmall-Front",
		{
			path: "RobotSmall-Back-Jump",
			framesX: 2,
			fps: 0
		},
		{
			path: "RobotSmall-Front-Jump",
			framesX: 2,
			fps: 0
		},
		{
			path: "RobotSmall-Jump",
			framesX: 2,
			fps: 0
		}], "assets/img/");

	meta.loadTexture([ 
		"Icon-Melee", "Icon-Ranged", "Icon-Select", 
		"Text-Melee", "Text-Ranged", "Text-Select-Mutation",
		"Score-Ring",
		"Title-Full",
		"Lifebar", "Lifebar-Bg", "Lifebar-Small", "Lifebar-Small-2", "Lifebar-Small-Bg" ], "assets/img/ui/");

	meta.loadTexture([ "Text-Game-Over", "Text-Restart", "Text-Score" ], "assets/img/ui/gameover");

	meta.loadTexture([ 
		{
			path: "Ice-Impact",
			framesX: 5,
			fps: 15
		}, 
		{
			path: "Ice-Punch",
			framesX: 5,
			fps: 15
		},
		{
			path: "Explosion",
			framesX: 4,
			fps: 9
		},
		{
			path: "Robot-Laser-Hit",
			framesX: 3,
			fps: 9
		},
		"Projectile-Crystal-1", "Projectile-Crystal-2", 
		"Robot-Blood-1", "Robot-Blood-2", "Robot-Blood-3", "Robot-Blood-4", "Robot-Laser" ], "assets/img/FX");

	meta.loadSound(
		[ "The-Ship.mp3", 
		"Ice-Punch-1.mp3", "Ice-Punch-2.mp3", "Ice-Slam.mp3", 
		"Ice-Throw-1.mp3", "Ice-Throw-2.mp3", "Ice-Throw-3.mp3",
		"Laser-1.mp3", "Laser-2.mp3", "Laser-3.mp3", "Laser-Hit.mp3", 
		"UI-Hover-1.mp3", "UI-Hover-2.mp3", "UI-Select-1.mp3", "UI-Select-2.mp3" ],
		"assets/sound/");
	//Game.load();
}

meta.onReady = function()
{
	//meta.resources.getSound("The-Ship").play(true);

	Title.load();	
}
