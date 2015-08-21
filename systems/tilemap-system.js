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
    loopMap(tilemap.map, tilemap.w, tilemap.h, function(x, y, cell, index, map) {
        map[index] = Math.floor(randomRange(0, 1));
    });
};

TileMapSystem.prototype.update = function(dt) {
    
};