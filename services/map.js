// tilemap utils

function getMapIndex(x, y, width) {
    if (x < 0 || y < 0) {
        // outside the array!
        return -1;
    }
    
    var i = ((y >> 0) * width + (x >> 0));
    
    return i;
}

// take world coords (screen) and get tilemap coords
function getTileCoordsFromWorld(x, y, sx, sy) {
    sy = sy || sx;
    
    x = Math.floor(x / sx);
    y = Math.floor(y / sy);
    
    // uglify can't handle the es6 (well nodejs)
    //return {x, y};
    return {x: x, y: y};
}

// gets the cell value of a square map from 1d array
function getMapCell(x, y, sx, sy, map) {
    var cell,
        i = getMapIndex(x, y, sx);
        
    if (i > map.length || i < 0) {
        console.warn('OOB!');
        return null;
    }
    
    cell = map[i];
    
    return cell;
}

function getMapCellFromWorld(x, y, tilemap) {
    var coords = getTileCoordsFromWorld(x, y, tilemap.sx, tilemap.sy);
    
    var cell = getMapCell(coords.x, coords.y, tilemap.w, tilemap.h, tilemap.map);

    return cell;
}

// loops through a 1d array as a square map
function loopMap(map, sx, sy, callback) {
    for (var y=0; y<sy; y++) {
        for (var x=0; x<sx; x++) {
            var cell = getMapCell(x, y, sx, sy, map),
                index = getMapIndex(x, y, sx);
            callback.call(null, x, y, cell, index, map);
        }
    }
}