function PhysicsSystem(world) {
    this.world = world;
}

PhysicsSystem.prototype.update = function(dt) {
    var integration = this.world.getEntities('transform', 'body'),
        gravityBehavior = this.world.getEntities('body', 'gravity');
        
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
    
    integration.forEach(function(entity) {
        var transform = entity.getComponent('transform'),
            body = entity.getComponent('body');

        if (!body.mass) {
            body.mass = 1;
        }

        // update velocity
        body.v.x += ((body.a.x / body.mass) * dt * dt);
        body.v.y += ((body.a.y / body.mass) * dt * dt);
        
        // terminal velocity
        //console.debug('foo', body.v);
        if (Math.abs(body.v.y) > MAX_VELOCITY) {
            body.v.y < 0 ? body.v.y = -MAX_VELOCITY : body.v.y = MAX_VELOCITY;
            console.debug('capping v: ', body);
        }
        if (Math.abs(body.v.x) > MAX_VELOCITY) {
            body.v.x < 0 ? body.v.x = -MAX_VELOCITY : body.v.x = MAX_VELOCITY;
        }
        
        // fake ground for now
        if (transform.y > 200 && !body.grounded) {
            body.v.y = 0;
            body.grounded = true;
        }

        // update position
        transform.x += body.v.x;
        transform.y += body.v.y;

        // reset accel
        body.a.x = body.a.y = 0;
    });
};