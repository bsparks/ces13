
var world = new CES.World();

world.assets = {};
world.assets.images = new ImageLoader();

var hero = {
  transform: {
    x: 200,
    y: 190,
    sx: 1,
    sy: 1,
    r: 0,
    dx: 1,
    dy: 1
  },
  character: {
    template: 'elf',
    head: 1
  },
  player: {
    speed: 200,
    jump: 20
  },
  body: {
    mass: 10,
    v: {x: 0, y: 0},
    a: {x: 0, y: 0}
  },
  collision: {
      shape: {
        type: 'box',
        sx: 8,
        sy: 8
      },
      group: PhysicsSystem.COLLISION_GROUPS.PLAYERS,
      mask: PhysicsSystem.COLLISION_GROUPS.NPCS | PhysicsSystem.COLLISION_GROUPS.GROUND
  },
  gravity: {value: 45},
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
    r: 0,
    dx: 1,
    dy: 1
  },
  character: {
    template: 'elf'
  },
  body: {
    mass: 1,
    v: {x: 0, y: 0},
    a: {x: 0, y: 0}
  },
  collision: {
      shape: {
        type: 'box',
        sx: 8,
        sy: 8
      },
      group: PhysicsSystem.COLLISION_GROUPS.NPCS,
      mask: PhysicsSystem.COLLISION_GROUPS.PLAYERS | PhysicsSystem.COLLISION_GROUPS.GROUND
  },
  gravity: {}
};

var level1 = {
    transform: {
        x: 0,
        y: 0,
        sx: 1,
        sy: 1,
        r: 0,
        dx: 1,
        dy: 1
    },
    tilemap: {
        w: 40,
        h: 30,
        sx: 8,
        sy: 8,
        map: []
    }
};

world.addSystem(InputSystem);
world.addSystem(PlayerSystem);
world.addSystem(TileMapSystem);
world.addSystem(PhysicsSystem);
world.addSystem(CharacterSystem);
world.addSystem(CanvasRenderer);
world.addSystem(ParticleSystem);

// until proper events added, entities have to be added AFTER systems
world.addEntity(new CES.Entity(hero, 'hero'));
world.addEntity(new CES.Entity(hero1, 'dynamic hero'));
world.addEntity(new CES.Entity(level1, 'level'));

function run() {
  world.step();
  requestAnimationFrame(run);
}

run();
