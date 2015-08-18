
var world = new CES.World();

world.assets = {};
world.assets.images = new ImageLoader();

var hero = {
  transform: {
    x: 200,
    y: 100,
    sx: 1,
    sy: 1,
    r: 0
  },
  character: {
    template: 'elf',
    head: 1
  },
  player: {
    speed: 8
  },
  particleEmitter: {
    duration: 10,
    rate: 0.01,
    numParticles: 300,
    particles: [{
      life: 5,
      color: {r: 255, g: 0, b: 0, a: 1},
      v: {x: 0, y: -15},
      vspread: {x: [-15, 15], y: 0},
      a: {x: 0, y: 9.8}
    }]
  }
};

var hero1 = {
  transform: {
    x: 100,
    y: 100,
    sx: 1,
    sy: 1,
    r: 0
  },
  character: {
    template: 'elf'
  }
};

world.addSystem(InputSystem);
world.addSystem(PlayerSystem);
world.addSystem(CharacterSystem);
world.addSystem(CanvasRenderer);
world.addSystem(ParticleSystem);

// until proper events added, entities have to be added AFTER systems
world.addEntity(new CES.Entity(hero, 'hero'));
world.addEntity(new CES.Entity(hero1, 'dynamic hero'));

function run() {
  world.step();
  requestAnimationFrame(run);
}

run();
