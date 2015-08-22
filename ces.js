function UUID() {
    function s(n) { return h((Math.random() * (1<<(n<<2)))^Date.now()).slice(-n); }
    function h(n) { return (n|0).toString(16); }
    return  [
        s(4) + s(4), s(4),
        '4' + s(3),                    // UUID version 4
        h(8|(Math.random()*4)) + s(3), // {8|9|A|B}xxx
        // s(4) + s(4) + s(4),
        Date.now().toString(16).slice(-10) + s(2) // Use timestamp to avoid collisions
    ].join('-');
}

function BIT(x) { return 1 << (x); }

function randomRange(min, max) {
  return Math.random() * (max - min + 1) + min;
}

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

// this is used for entity object hashes
function toArray(obj) {
    var array = [];
    for (var key in obj) {
        // we don't copy "private" variables either
        if (obj.hasOwnProperty(key) && key[0] !== '_') {
            array.push(obj[key]);
        }
    }
  
    return array;
}

var CES = {};

CES.Entity = function(components, name) {
    this.id = UUID();
    this.name = name || 'entity';

    this._components = clone(components);
};

CES.Entity.prototype = {
  hasComponent: function(component) {
    return !!this._components[component];
  },
  getComponent: function(name) {
    return this._components[name];
  },
  addComponent: function(name, data) {
    if (this.hasComponent(name)) {
      // already has!
      console.warn(this.name, 'already has a', name, 'component!');
      return;
    }
    
    this._components[name] = clone(data);
    window.dispatchEvent(new CustomEvent('entityOnComponentAdded', {detail: {entity: this, component: name}}));
  }
};
CES.Entity.prototype.constructor = CES.Entity;

CES.World = function() {
  this._systems = [];
  this._systemRegistry = {};
  this._entities = {};
  this._families = {};

  this._timing = {
    scale: 1.0,
    maxStep: 0.05,
    last: 0,
    startTime: new Date(),
    timestamp: window.performance.now(),
    frameTime: Number.MIN_VALUE,
    elapsed: Number.MIN_VALUE
  };
};

CES.World.prototype = {
  addSystem: function(System) {
    var instance = new System(this);
    this._systemRegistry[System.name] = instance;
    this._systems.push(instance);
  },
  getSystem: function(name) {
    return this._systemRegistry[name] || null;
  },
  addEntity: function(entity) {
    var world = this;
    
    window.addEventListener('entityOnComponentAdded', function(e) {
        world._joinFamilies(e.detail.entity);
    });
    
    this._entities[entity.id] = entity;
    // update families
    this._joinFamilies(entity);
    // fire callbacks
  },
  onComponentAdded: function(entity, componentName) {
    console.debug('component added at runtime: ', entity.id, componentName);
    this._joinFamilies(entity);
  },
  removeEntity: function(entity) {
    // remove from entities
    // remove from families
  },
  getEntities: function(/** components **/) {
    var components = Array.prototype.slice.call(arguments);

    return toArray(this._getFamily.apply(this, components));
  },
  onEntityAdded: function(/** components **/) {
    var components = Array.prototype.slice.call(arguments),
        familyName = components.join('+');
    var family = this._getFamily.apply(this, components);
    
    // handle events for a family addition
    return {
        add: function(callback) {
            window.addEventListener(familyName + '-onEntityAdded', function(e) {
                callback.call(null, e.detail.entity);
            });
        }
    };
  },
  _getFamily: function(/** components **/) {
    var components = Array.prototype.slice.call(arguments),
      familyName = components.join('+'),
      family = this._families[familyName];
      
    if (!family) {
      // build the family
      family = this._families[familyName] = {};
      toArray(this._entities).forEach(function(entity) {
          var match = components.every(function(component) {
              return entity.hasComponent(component);
          });

        if (match) {
            family[entity.id] = entity;
        }
      }, this);
    }
    return family;
  },
  _joinFamilies: function(entity) {
      var family;
      for (var familyName in this._families) {
          family = this._families[familyName];
          if (family[entity.id]) {
            // already has
            continue;
          }
          
          var components = familyName.split('+');
          var match = components.every(function(component) {
              return entity.hasComponent(component);
          });
    
          if (match) {
              family[entity.id] = entity;
              window.dispatchEvent(new CustomEvent(familyName + '-onEntityAdded', {detail: {entity: entity}}));
          }
      }
  },
  step: function() {
    var current = window.performance.now(),
        frame = (current - this._timing.last) / 1000.0;

    this._timing.timestamp = current;
    this._timing.frameTime = Math.min(frame, this._timing.maxStep) * this._timing.scale;
    this._timing.elapsed += this._timing.frameTime;
    this._timing.last = current;

    this.update(this._timing.frameTime, this._timing.elapsed, current);
  },
  update: function(delta, elapsed, timestamp) {
    this._systems.forEach(function(system) {
      if (system.update) {
        system.update(delta, elapsed, timestamp);
      }
    });
  }
};

CES.World.prototype.constructor = CES.World;
