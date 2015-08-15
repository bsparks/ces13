var CanvasRenderer = function(world) {
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
  		ctx.strokeRect(x, y, shape.width, shape.height);
  	},
  	arc: function (ctx, shape) {
  		ctx.beginPath();
  		ctx.arc(0, 0, shape.radius, 0, Math.PI * 2);
  		ctx.fill();
  		ctx.stroke();
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

    this.clear('black');

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
