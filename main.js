
var world = new CES.World();

world.assets = {};
world.assets.images = new ImageLoader();

var heroPrefab = {
  transform: {
    x: 100,
    y: 100,
    sx: 1,
    sy: 1,
    r: 0
  },
  shape: {
    type: "rect",
		fill: "red",
		stroke: "darkred",
		lineWidth: 4,
		width: 40,
		height: 80
  }
};

var jimPrefab = {
  transform: {
    x: 200,
    y: 100,
    sx: 1,
    sy: 1,
    r: 0
  },
  sprite: {
    image: 'assets/images/hero.png',
    alpha: 1
  }
};

var bob = new CES.Entity(heroPrefab, 'bob');
bob.getComponent('transform').x += 50;
bob.getComponent('shape').fill = 'blue';

world.addEntity(bob);
world.addEntity(new CES.Entity(jimPrefab, 'jim'));

world.addSystem(CanvasRenderer);

function run() {
  world.step();
  requestAnimationFrame(run);
}

run();
