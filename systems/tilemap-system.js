function TileMapSystem(world) {
    var system = this;
    
    this.world = world;
    
    world.onEntityAdded('tilemap').add(function(entity) {
        var tilemap = entity.getComponent('tilemap');

        // generate a map
        system.generate(tilemap);
    });
}

TileMapSystem.prototype.generate = function(tilemap) {
    var ground = Math.floor(tilemap.h * 0.90);
    
    loopMap(tilemap.map, tilemap.w, tilemap.h, function(x, y, cell, index, map) {
        map[index] = (y >= ground) || ((y === ground - 1) && (Math.random() > 0.5)) ? 1 : 0;
    });
};

TileMapSystem.prototype.update = function(dt) {
    
};