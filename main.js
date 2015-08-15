var world = new CES.World();

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

var bob = new CES.Entity(heroPrefab, 'bob');
bob.getComponent('transform').x += 50;
bob.getComponent('shape').fill = 'blue';

world.addEntity(bob);
world.addEntity(new CES.Entity(heroPrefab, 'jim'));

world.addSystem(CanvasRenderer);

function run() {
  world.step();
  requestAnimationFrame(run);
}

run();
