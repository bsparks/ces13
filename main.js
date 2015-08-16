
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
    type: 'rect',
		fill: 'dodgerblue',
		stroke: 'blue',
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
  },
  player: {
    speed: 8
  },
  particleEmitter: {
    duration: Infinity,
    rate: 0.1,
    numParticles: 300,
    particles: [{
      life: 5,
      color: {r: 255, g: 0, b: 0, a: 1},
      v: {x: 0, y: -10},
      a: {x: 0, y: -3}
    }]
  }
};

var bob = new CES.Entity(heroPrefab, 'bob');

world.addEntity(bob);
world.addEntity(new CES.Entity(jimPrefab, 'jim'));

world.addSystem(InputSystem);
world.addSystem(PlayerSystem);
world.addSystem(CanvasRenderer);
world.addSystem(ParticleSystem);

function run() {
  world.step();
  requestAnimationFrame(run);
}

run();
