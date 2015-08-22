function CanvasRenderer(world) {
  this.world = world;

  var canvas = this.canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 240;
  document.body.appendChild(canvas);

  var resize = function () {
  	var clientWidth = window.innerWidth;
  	var clientHeight = window.innerHeight;
  	var ratioX = clientWidth / canvas.width;
  	var ratioY = clientHeight / canvas.height;
  	var scale = Math.min(ratioX, ratioY);

  	var style = canvas.style;
  	style.position = 'absolute';
  	style.transformOrigin = '0 0';
  	style.transform = 'scale(' + scale + ',' + scale + ')';
  	style.left = Math.round(clientWidth / 2 - (canvas.width * scale) / 2) + 'px';
  	style.top = Math.round(clientHeight / 2 - (canvas.height * scale) / 2) + 'px';
  };

  this.ctx = this.canvas.getContext('2d');
  this.ctx.imageSmoothingEnabled = false;

  // hack for now, TODO: move canvas outside of this renderer
  world.canvas = canvas;
  world.context = this.ctx;

  resize();

  window.addEventListener('resize', resize, false);

  this.clear = function(color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  var renderers = {
  	rect: function (ctx, shape) {
      if (shape.size) {
        shape.width = shape.height = shape.size;
      }
  		var x = -Math.round(shape.width / 2);
  		var y = -Math.round(shape.height / 2);
  		ctx.fillRect(x, y, shape.width, shape.height);
  		if (shape.stroke) {
  		  ctx.strokeRect(x, y, shape.width, shape.height);
  		}
  	},
  	arc: function (ctx, shape) {
  		ctx.beginPath();
  		ctx.arc(0, 0, shape.radius, 0, Math.PI * 2);
  		ctx.fill();
  		ctx.stroke();
  	},
    sprite: function (ctx, sprite) {
      world.assets.images.load(sprite.image).then(function(image) {
        // have to dump a reference here, because async blows up the renderer below
        sprite.__image = image;
      });

      var image = sprite.__image;
      if (image) {
        var x = -Math.round(image.width / 2);
      	var y = -Math.round(image.height / 2);
      	ctx.globalAlpha = sprite.alpha;
      	ctx.drawImage(image, x, y);
      }
    }
  };

  this.drawShape = function(shape) {
  	this.ctx.fillStyle = shape.fill;
  	this.ctx.strokeStyle = shape.stroke;
  	this.ctx.lineWidth = shape.lineWidth || 1;
  	renderers[shape.type](this.ctx, shape);
  };

  this.update = function(delta, elapsed, ts) {
    var renderer = this;
    
    var gradient = this.ctx.createLinearGradient(0,0,this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, 'dodgerblue');
    gradient.addColorStop(1, 'white');
    this.clear(gradient);
    
    this.world.getEntities('transform', 'tilemap').forEach(function(entity) {
        var transform = entity.getComponent('transform'),
            tilemap = entity.getComponent('tilemap');
            
        loopMap(tilemap.map, tilemap.w, tilemap.h, function(x, y, cell, index, map) {
            if (cell === 1) {
                renderer.ctx.save();
              	renderer.ctx.translate(Math.round(x * tilemap.sx + (tilemap.sx / 2)), Math.round(y * tilemap.sy + (tilemap.sy / 2)));
                renderer.drawShape({
                    type: 'rect',
                    fill: 'green',
                    //stroke: 'black',
                    lineWidth: 1,
                    width: tilemap.sx,
                    height: tilemap.sy
                });
                renderer.ctx.restore();
            }
        });
    });

    this.world.getEntities('transform', 'sprite').forEach(function(entity) {
      var transform = entity.getComponent('transform'),
          sprite = entity.getComponent('sprite');

          renderer.ctx.save();
          var x = Math.round(transform.x);
        	var y = Math.round(transform.y);
        	renderer.ctx.translate(x, y);
        	renderer.ctx.rotate(transform.r);
        	renderer.ctx.scale(transform.sx, transform.sy);
          renderers.sprite(renderer.ctx, sprite);
          renderer.ctx.restore();
    });

    this.world.getEntities('transform', 'shape').forEach(function(entity) {
      var transform = entity.getComponent('transform'),
          shape = entity.getComponent('shape');

          renderer.ctx.save();
          var x = Math.round(transform.x);
        	var y = Math.round(transform.y);
        	renderer.ctx.translate(x, y);
        	renderer.ctx.rotate(transform.r);
        	renderer.ctx.scale(transform.sx, transform.sy);
          renderer.drawShape(shape);
          renderer.ctx.restore();
    });
  };
};
