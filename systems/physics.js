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

function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
}

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
        
        collision.boundingBox.x1 = transform.x - (collision.shape.sx / 2);
        collision.boundingBox.y1 = transform.y - (collision.shape.sy / 2);
        collision.boundingBox.x2 = Math.round(collision.boundingBox.x1 + collision.shape.sx);
        collision.boundingBox.y2 = Math.round(collision.boundingBox.y1 + collision.shape.sy);
        collision.boundingBox.w = collision.shape.sx;
        collision.boundingBox.h = collision.shape.sy;
        
        var extent = collision.boundingBox;

        if (!body.grounded && (collision.mask & PhysicsSystem.COLLISION_GROUPS.GROUND)) {
            var maps = world.getEntities('tilemap');
            maps.forEach(function(mapEntity) {
                var tilemap = mapEntity.getComponent('tilemap');
                // get the 2 corners for where it *will* be
                var bottomLeft = getMapCellFromWorld(extent.x1 + body.v.x, extent.y2 + body.v.y, tilemap),
                    bottomRight = getMapCellFromWorld(extent.x2 + body.v.x, extent.y2 + body.v.y, tilemap);
                //console.debug('test: ', bottomLeft, extent.x1 + body.v.x, extent.y2 + body.v.y, getTileCoordsFromWorld(extent.x1 + body.v.x, extent.y2 + body.v.y, 8));
                // for now, just 1 will be colliding ground
                if (bottomLeft === 1 || bottomRight === 1) {
                    body.grounded = true;
                    console.debug('test collision: ', bottomLeft, bottomRight, extent, body.v);
                }
            });
        }
    });
    
    integration.forEach(function(entity) {
        var transform = entity.getComponent('transform'),
            body = entity.getComponent('body');

        if (!body.mass) {
            body.mass = 1;
        }
        
        var drag = 0.0055;
        var friction = 0.015;

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
            console.debug('capping v: ', body);
        }
        if (Math.abs(body.v.x) > MAX_VELOCITY) {
            body.v.x < 0 ? body.v.x = -MAX_VELOCITY : body.v.x = MAX_VELOCITY;
        }

        // update position
        transform.x += body.v.x;
        transform.y += body.v.y;
        
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

        // reset accel
        body.a.x = body.a.y = 0;
    });
};