var world = new CES.World();

var Foo = function(world) {
  this.world = world;

  this.canvas = document.createElement('canvas');
  this.canvas.width = 300;
  this.canvas.height = 300;
  document.body.appendChild(this.canvas);

  this.ctx = this.canvas.getContext('2d');

  this.ctx.fillStyle = "green";
  this.ctx.fillRect(0, 0, 300, 300);

  this.update = function(delta, elapsed, ts) {
    // nil
  };
};

var heroPrefab = {
  transform: {
    position: [0, 0, 0],
    rotation: [0, 0, 0]
  }
};

world.addEntity(new CES.Entity(heroPrefab, 'bob'));
world.addEntity(new CES.Entity(heroPrefab, 'jim'));

world.addSystem(Foo);

function run() {
  world.step();
  requestAnimationFrame(run);
}

run();
