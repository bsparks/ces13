var PlayerSystem = function(world) {
    this.world = world;
    
    this.update = function(dt) {
        var players = this.world.getEntities('player', 'transform');
        players.forEach(function(player) {
           var pc = player.getComponent('player'),
            transform = player.getComponent('transform');
            
            if (world.input.pressed('LEFT')) {
                transform.x -= player.speed * dt;
            }
            
            if (world.input.pressed('RIGHT')) {
                transform.x += player.speed * dt;
            }
        });
    };
};