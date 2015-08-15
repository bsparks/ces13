function PlayerSystem(world) {
    this.world = world;

    this.update = function(dt) {
        var players = this.world.getEntities('player', 'transform');
        var input = this.world.getSystem('InputSystem');

        players.forEach(function(player) {
           var pc = player.getComponent('player'),
            transform = player.getComponent('transform');

            if (input.pressed('LEFT')) {
                //console.log('left: ', transform, player, dt);
                transform.x -= pc.speed * dt;
            }

            if (input.pressed('RIGHT')) {
                transform.x += pc.speed * dt;
            }

            if (input.pressed('UP')) {
                transform.y -= pc.speed * dt;
            }

            if (input.pressed('DOWN')) {
                transform.y += pc.speed * dt;
            }
        });
    };
};
