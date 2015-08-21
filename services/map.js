// tilemap utils

function getMapIndex(x, y, width) {
    var i = ((y >> 0) * width + (x >> 0));
    
    return i;
}

// gets the cell value of a square map from 1d array
function getMapCell(x, y, sx, sy, map) {
    var cell,
        i = getMapIndex(x, y, sx);
        
    if (i > map.length) {
        console.warn('OOB!');
        return null;
    }
    
    cell = map[i];
    
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