"use strict";

meta.class("AStar", 
{
	init: function(data, cellsX, cellsY, walkable) 
	{
		this.numOpenSize = 4;
		this.open = new Array(this.numOpenSize);

		this.neighbors = new Array(4);

		if(data) {
			this.setup(data, cellsX, cellsY, walkable);
		}
	},

	setup: function(data, cellsX, cellsY, walkable)
	{
		this.data = data;
		this.cellsX = cellsX;
		this.cellsY = cellsY;

		// init node buffer
		this.numNodes = data.length;

		if(!this.nodes) {
			this.nodes = new Array(this.numNodes);
		}
		else if(this.nodes.length !== this.numNodes) {
			this.nodes.length = this.numNodes;
		}

		// init walkable buffer
		this.walkableMap = {};

		var numWalkable = walkable.length;
		for(var n = 0; n < numWalkable; n++) {
			this.walkableMap[walkable[n]] = 1;
		}

		// load nodes:
		var x, gid, node;
		var id = 0;
		for(var y = 0; y < cellsY; y++)
		{
			for(x = 0; x < cellsX; x++) 
			{
				gid = data[id];
				if(!gid) {
					this.nodes[id] = null;
				}
				else 
				{
					node = this.nodes[id]
					if(!node) {
						this.nodes[id] = new this.Node(x, y);
					}
					else {
						node.x = x;
						node.y = y;
					}
				}
				
				id++;
			}
		}
	},

	search: function(startX, startY, endX, endY)
	{
		this.searchIndex++;

		var parentNode, node, n, g, i, tmp1, tmp2, num;
		var startNode = this.getNode(startX, startY);
		var endNode = this.getNode(endX, endY);

		if(!startNode) { return null; }
		if(!endNode) { return null; }

		this.numOpen = 1;
		this.open[0] = startNode;
		startNode.parent = null;
		startNode.searchIndex = this.searchIndex;
		startNode.depth = 0;
		startNode.g = 0;

		while(this.numOpen > 0)
		{
			parentNode = this.open[--this.numOpen];
			if(parentNode === endNode) {
				return this.generatePath(parentNode);
			}

			if(this.numOpen + 4 >= this.numOpenSize) {
				this.numOpenSize *= 2;
				this.open.length = this.numOpenSize;
			}

			g = parentNode.g + 1;

			// neighbors:
			this.loadNeighbors(parentNode.x, parentNode.y);
			for(n = 0; n < this.numNeighbors; n++) 
			{
				node = this.neighbors[n];

				if(!node.visited || g < node.g) 
				{					
					node.parent = parentNode;
					node.h = node.h || this.heuristic(node, endNode, 0);
					node.g = g;
					node.f = node.g + node.h;
					node.searchIndex = this.searchIndex;
					node.depth = parentNode.depth + 1;
					node.visited = 1;
					this.open[this.numOpen++] = node;
				}
			}

			// sort:
			for(i = 0; i < this.numOpen; i++) 
			{
				for(n = i; n > 0; n--) 
				{
					tmp1 = this.open[n];
					tmp2 = this.open[n - 1];
					if(tmp1.f > tmp2.f) {
						this.open[n] = tmp2;
						this.open[n - 1] = tmp1;
					}
				}
			}
		}

		return null;
	},

	loadNeighbors: function(x, y)
	{
		var node, id;

		this.numNeighbors = 0;

		// left:
		if((x - 1) !== -1) 
		{
			id = (x - 1) + (y * this.cellsX);
			node = this.nodes[id];
			if(node && node.searchIndex !== this.searchIndex && this.walkableMap[this.data[id]]) {
				node.h = 0;
				node.g = 0;
				node.visited = false;
				this.neighbors[this.numNeighbors++] = node;
			} 
		}

		// right:
		if((x + 1) !== this.cellsX) 
		{
			id = (x + 1) + (y * this.cellsX);
			node = this.nodes[id];
			if(node && node.searchIndex !== this.searchIndex && this.walkableMap[this.data[id]]) {
				node.h = 0;
				node.g = 0;
				node.visited = false;
				this.neighbors[this.numNeighbors++] = node;
			} 
		}

		// top:
		if((y - 1) !== -1) 
		{
			id = x + ((y - 1) * this.cellsX);
			node = this.nodes[id];
			if(node && node.searchIndex !== this.searchIndex && this.walkableMap[this.data[id]]) {
				node.h = 0;
				node.g = 0;
				node.visited = false;
				this.neighbors[this.numNeighbors++] = node;
			} 
		}

		// bottom:
		if((y + 1) !== this.cellsY) 
		{
			id = x + ((y + 1) * this.cellsX);
			node = this.nodes[id];
			if(node && node.searchIndex !== this.searchIndex && this.walkableMap[this.data[id]]) {
				node.h = 0;
				node.g = 0;
				node.visited = false;
				this.neighbors[this.numNeighbors++] = node;
			}
		}
	},

	getNode: function(x, y)
	{
		var id = x + (y * this.cellsX);

		if(id < 0) {
			return null;
		}
		if(id >= this.numNodes) {
			return null;
		}

		return this.nodes[id];
	},

	generatePath: function(node) 
	{
		var depth = node.depth;
		var index = depth - 1;
		var buffer = new Array(depth);

		for(var n = 0; n < depth; n++) {
			buffer[index--] = node;
			node = node.parent;
		}

		return buffer;
	},

	Node: function(x, y) 
	{
		this.parent = null;
		this.searchIndex = 0;
		this.depth = 0;
		this.x = x;
		this.y = y;
		this.h = 0;
		this.g = 0;
		this.f = 0;
		this.visited = 0;
	},

	Heuristic: 
	{
		manhattan: function(node, destNode, cost) 
		{
			var dx = Math.abs(node.x - destNode.x);
			var dy = Math.abs(node.y - destNode.y);

			return dx + dy;
		},

		euclidian: function(node, destNode, cost)
		{
			var dx = node.x - destNode.x;
			var dy = node.y - destNode.y;

			return Math.sqrt(dx * dx + dy * dy);
		},

		diagonal: function(node, destNode, cost, diagonalCost)
		{
			var dx = Math.abs(node.x - destNode.x);
			var dy = Math.abs(node.y - destNode.y);

			var diagonal = Math.min(dx, dy);
			var straight = dx + dy;

			return (diagonalCost * diagonal) + (cost * (straight - 2 * diagonal));
		}
	},

	//
	heuristic: null,
	open: null,
	numOpen: 0,
	numOpenSize: 0,
	searchIndex: 0,

	data: null,
	cellsX: 0,
	cellsY: 0,
	walkableMap: null,

	nodes: null,
	numNodes: 0,

	neighbors: null,
	numNeighbors: 0	
});

AStar.prototype.heuristic = AStar.prototype.Heuristic.euclidian;
