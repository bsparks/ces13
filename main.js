var world = new CES.World();

var Foo = function(world) {
  this.world = world;

  this.update = function(delta, elapsed, ts) {

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
