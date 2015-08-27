"use strict";

meta.class("Blood", "Entity.Geometry", 
{
	spawn: function() {
		this.texture = "Robot-Blood-" + meta.random.number(1, 4);
	}
});
