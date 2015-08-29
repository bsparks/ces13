function PhysicsSystem(world) {
    this.world = world;
}

PhysicsSystem.COLLISION_GROUPS = {
    NONE: BIT(0),
    GROUND: BIT(1),
    PLAYERS: BIT(2),
    NPCS: BIT(3),
    PROJECTILES: BIT(4)
};

PhysicsSystem.prototype.update = function(dt) {
    var world = this.world,
        integration = this.world.getEntities('transform', 'body'),
        gravityBehavior = this.world.getEntities('body', 'gravity'),
        colliders = this.world.getEntities('transform', 'collision', 'body');
        
    var MAX_VELOCITY = 2;
        
    gravityBehavior.forEach(function(entity) {
        var body = entity.getComponent('body'),
            gravity = entity.getComponent('gravity');
            
        if (body.grounded) {
            return;
        }
            
        if (!gravity.value && gravity.value !== 0) {
            gravity.value = 9.8;
        }
        
        if (!body.mass) {
            body.mass = 1;
        }
        
        body.a.y += gravity.value * body.mass;
    });
    
    colliders.forEach(function(entity) {
        var transform = entity.getComponent('transform'),
            collision = entity.getComponent('collision'),
            body = entity.getComponent('body');
            
        collision.boundingBox = collision.boundingBox || {};
        collision.collisions = collision.collisions || {t: false, r: false, b: false, l: false};
        
        collision.boundingBox.x = transform.x - (collision.shape.sx / 2);
        collision.boundingBox.y = transform.y - (collision.shape.sy / 2);
        collision.boundingBox.x1 = Math.round(collision.boundingBox.x + collision.shape.sx);
        collision.boundingBox.y1 = Math.round(collision.boundingBox.y + collision.shape.sy);
        collision.boundingBox.width = collision.shape.sx;
        collision.boundingBox.height = collision.shape.sy;
        
        var extent = collision.boundingBox;

        if ((collision.mask & PhysicsSystem.COLLISION_GROUPS.GROUND)) {
            var maps = world.getEntities('tilemap');
            
            maps.forEach(function(mapEntity) {
                var tilemap = mapEntity.getComponent('tilemap');
                // get the 2 corners for where it *will* be
                var bottomLeft = getMapCellFromWorld(extent.x/* + body.v.x*/, extent.y1/* + body.v.y*/, tilemap),
                    bottomRight = getMapCellFromWorld(extent.x1/* + body.v.x*/, extent.y1/* + body.v.y*/, tilemap),
                    topLeft = getMapCellFromWorld(extent.x, extent.y, tilemap),
                    topRight = getMapCellFromWorld(extent.x1, extent.y, tilemap),
                    midTop = getMapCellFromWorld(extent.x + extent.width / 2, extent.y, tilemap),
                    midBottom = getMapCellFromWorld(extent.x + extent.width / 2, extent.y1, tilemap),
                    midLeft = getMapCellFromWorld(extent.x, extent.y + extent.height / 2, tilemap),
                    midRight = getMapCellFromWorld(extent.x1, extent.y + extent.height / 2, tilemap);
                    
                collision.collisions.t = (midTop === 1);
                collision.collisions.b = (midBottom === 1);
                collision.collisions.l = (midLeft === 1);
                collision.collisions.r = (midRight === 1);
            });
        }
    });
    
    integration.forEach(function(entity) {
        var transform = entity.getComponent('transform'),
            body = entity.getComponent('body'),
            collision = entity.getComponent('collision');

        if (!body.mass) {
            body.mass = 1;
        }
        
        var drag = 0.0055;
        var friction = 0.015;
        
        // reset grounded before the check
        body.grounded = false;

        // update velocity
        body.v.x += ((body.a.x / body.mass) * dt * dt);
        body.v.y += ((body.a.y / body.mass) * dt * dt);
        
        // air drag
        body.v.x -= body.v.x * drag;
        body.v.y -= body.v.y * drag;
        
        // terminal velocity
        //console.debug('foo', body.v);
        if (Math.abs(body.v.y) > MAX_VELOCITY) {
            body.v.y < 0 ? body.v.y = -MAX_VELOCITY : body.v.y = MAX_VELOCITY;
            //console.debug('capping v: ', body);
        }
        if (Math.abs(body.v.x) > MAX_VELOCITY) {
            body.v.x < 0 ? body.v.x = -MAX_VELOCITY : body.v.x = MAX_VELOCITY;
        }
        
        if (collision) {
            if (collision.collisions) {
                if (collision.collisions.l && body.v.x < 0) {
                    body.v.x = 0;
                }
                if (collision.collisions.r && body.v.x > 0) {
                    body.v.x = 0;
                }
                if (collision.collisions.b) {
                    body.grounded = true;
                }
            }
        }
        
        if (body.grounded) {
            // apply friction
            body.v.x -= body.v.x * friction;
            body.v.y = 0;
        }
        
        // fake ground for now
        if (transform.y > 230 && !body.grounded) {
           // body.v.y = 0;
           body.grounded = true;
        }
        
        // update position
        transform.x += body.v.x;
        transform.y += body.v.y;

        // reset accel
        body.a.x = body.a.y = 0;
    });
};