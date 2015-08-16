function ParticleSystem(world) {
  this.world = world;

  this._particles = {};
}

ParticleSystem.prototype.update = function (delta, elapsed) {
  var system = this;
  var emitters = this.world.getEntities('particleEmitter');

  this._imagedata = this.world.context.getImageData(0, 0, this.world.canvas.width, this.world.canvas.height);

  emitters.forEach(function(entity) {
    var emitter = entity.getComponent('particleEmitter'),
        transform = entity.getComponent('transform');

    // birth
    if (!emitter.age) {
      emitter.age = 0;
      emitter.alive = true;
    }
    emitter.age += delta;

    if (emitter.age >= emitter.duration || !emitter.alive) {
      emitter.alive = false;
      // TODO: remove component?
      return;
    }

    if (emitter._rateTimer) {
      emitter._rateTimer += delta;
    } else {
      emitter._rateTimer = delta;
    }

    // each emitter gets a pool of particles
    if (!system._particles[entity.id]) {
      system.createPool(entity.id, emitter.numParticles || 100, emitter.particles[0]);
    }

    if (emitter._rateTimer >= emitter.rate) {
      system.spawnParticle(entity.id, transform.x, transform.y);
      emitter._rateTimer = 0;
    }

    system._particles[entity.id].forEach(function(particle) {
        if (!particle.alive) {
          return;
        }

        particle.age += delta;

        if (particle.age >= particle.life) {
          particle.alive = false;
          return;
        }

        // update velocity
        particle.x += particle.v.x * delta;
        particle.y += particle.v.y * delta;

        system.drawPixel(particle.x, particle.y, particle.color);
    });
  });

  this.world.context.putImageData(this._imagedata, 0, 0);
};

ParticleSystem.prototype.createPool = function (id, size, particleData) {
  var particle = {
    alive: false,
    life: particleData.life,
    age: 0,
    x: 0,
    y: 0,
    v: clone(particleData.v),
    color: clone(particleData.color)
  };

  this._particles[id] = [];
  for (var i=0; i<size; i++) {
    this._particles[id].push(clone(particle));
  }
};

ParticleSystem.prototype.spawnParticle = function (poolId, x, y) {
  // find first dead one
  var pool = this._particles[poolId];
  var particle;
  for(var i=0;i<pool.length;i++) {
    if (!pool[i].alive) {
      particle = pool[i];
      break;
    }
  }

  if (particle) {
    particle.alive = true;
    particle.x = x;
    particle.y = y;
    particle.age = 0;
  }
};

ParticleSystem.prototype.drawPixel = function (x, y, color) {
  //console.debug('drawPixel: ', x, y, color);
  var imagedata = this._imagedata;
  var i = ((y >> 0) * imagedata.width + (x >> 0)) * 4;

  imagedata.data[i] = color.r;
  imagedata.data[i + 1] = color.g;
  imagedata.data[i + 2] = color.b;
  imagedata.data[i + 3] = color.a * 255;
};
