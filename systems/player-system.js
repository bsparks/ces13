function PlayerSystem(world) {
    this.world = world;

    this.update = function(dt) {
        var players = this.world.getEntities('player', 'transform');
        var input = this.world.getSystem('InputSystem');

        players.forEach(function(player) {
           var pc = player.getComponent('player'),
            transform = player.getComponent('transform'),
            body = player.getComponent('body');

            if (input.down('LEFT')) {
                //console.log('left: ', transform, player, dt);
                body.a.x -= pc.speed;
                transform.dx = -1;
            }
            
            if (input.released('LEFT') || input.released('RIGHT')) {
                body.v.x *= 0.99;
            }

            if (input.down('RIGHT')) {
                body.a.x += pc.speed;
                transform.dx = 1;
            }

            if (input.pressed('UP')) {
                // only allow jump from ground
                if (body.grounded) {
                    // cheat on the xform so that we get unstuck from the ground
                    transform.y -= 1;
                    
                    body.a.y -= pc.jump * 1000 || 10000;
                    body.grounded = false;
                    tones.play('d');
                    tones.play('f');
                    tones.play('a');
                    tones.play('c', 2);
                }
            }

            if (input.pressed('DOWN')) {
                //transform.y += pc.speed;
            }
        });
    };
};
