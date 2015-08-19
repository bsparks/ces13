function PhysicsSystem(world) {
    this.world = world;
}

PhysicsSystem.prototype.update = function(dt) {
    var integration = this.world.getEntities('transform', 'body'),
        gravityBehavior = this.world.getEntities('body', 'gravity');
        
    gravityBehavior.forEach(function(entity) {
        var body = entity.getComponent('body'),
            gravity = entity.getComponent('gravity');
            
        if (!gravity.value && gravity.value !== 0) {
            gravity.value = 9.8;
        }
        
        body.a.y += gravity.value;
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

        // update position
        transform.x += body.v.x;
        transform.y += body.v.y;

        // reset accel
        body.a.x = body.a.y = 0;
    });
};