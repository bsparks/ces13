(function(Graphics) {
    'use strict';

    var TEMPLATES = {
        elf: {
            head: [
                [
                    1,1,1,1,1,0,
                    0,1,1,1,1,1,
                    0,2,3,2,3,2,
                    0,2,2,2,2,2
                ],
                [
                    1,1,1,1,1,0,
                    0,1,1,1,1,1,
                    0,1,3,2,3,1,
                    0,1,2,2,2,1
                ]
            ],
            body: [
                [
                    1,1,1,1,1,1,
                    2,3,3,4,3,3
                ]    
            ],
            legs: [
                [
                    0,1,1,1,1,1,
                    0,2,2,0,2,2
                ]    
            ],
            weapon: [
                [
                    0,0,
                    0,3,
                    0,3,
                    0,3,
                    1,2,
                    0,0,
                    0,0,
                    0,0
                ]    
            ]
        }
    }; 
    
    // gets the cell value of a square map from 1d array
    function getMapCell(x, y, sx, sy, map) {
        var cell,
            i = ((y >> 0) * sx + (x >> 0));
            
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
                var cell = getMapCell(x, y, sx, sy, map);
                callback.call(null, x, y, cell, map);
            }
        }
    }
    
    function getTemplateImageData(ctx, template, sw, sh, palette) {
        var imageData = ctx.createImageData(sw, sh);
        
        loopMap(template, sw, sh, function(x, y, cell, template) {
            Graphics.drawPixel(imageData, x, y, palette[cell]);
        });
        
        return imageData;
    }
    
    function getHead(ctx, template) {
        // our set of pixel tiles
        var palette = [
            {r: 0,   g: 0,   b: 0,   a: 0},
            {r: 86,  g: 115, b: 26,  a: 1}, // hat
            {r: 227, g: 208, b: 100, a: 1}, // face
            {r: 0,   g: 0,   b: 0,   a: 1}  // eyes
        ];
         
        return getTemplateImageData(ctx, template, 6, 4, palette);
    }
    
    function getBody(ctx, template) {
        var palette = [
            {r: 0,   g: 0,   b: 0,   a: 0},
            {r: 86,  g: 115, b: 26,  a: 1}, // shirt
            {r: 227, g: 208, b: 100, a: 1}, // hand
            {r: 85,  g: 43,  b: 21,  a: 1}, // belt
            {r: 180, g: 180, b: 172, a: 1}  // buckle
        ];
         
        return getTemplateImageData(ctx, template, 6, 2, palette);
    }
    
    function getLegs(ctx, template) {
        var palette = [
            {r: 0,   g: 0,   b: 0,   a: 0},
            {r: 86,  g: 115, b: 26,  a: 1}, // pants
            {r: 72,  g: 72,  b: 80,  a: 1}  // shoes
        ];
         
        return getTemplateImageData(ctx, template, 6, 2, palette);
    }
    
    function getWeapon(ctx, template) {
        var palette = [
            {r: 0,   g: 0,   b: 0,   a: 0},
            {r: 86,  g: 115, b: 26,  a: 1}, // shirt
            {r: 227, g: 208, b: 100, a: 1}, // hand
            {r: 180, g: 180, b: 172, a: 1}  // sword
        ];
         
        return getTemplateImageData(ctx, template, 2, 8, palette);
    }
    
    function buildChar(charData) {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            size = 8,
            imageData;
            
        canvas.width = canvas.height = size;
        context.imageSmoothingEnabled = false;
        
        var templateBank = TEMPLATES[charData.template];
        var headImageData = getHead(context, templateBank.head[charData.head || 0]);
        var bodyImageData = getBody(context, templateBank.body[charData.body || 0]);
        var legsImageData = getLegs(context, templateBank.legs[charData.legs || 0]);
        var weapImageData = getWeapon(context, templateBank.weapon[charData.weapon || 0]);
        
        context.putImageData(headImageData, 0, 0);
        context.putImageData(bodyImageData, 0, 4);
        context.putImageData(legsImageData, 0, 6);
        context.putImageData(weapImageData, 6, 0);
        
        return canvas.toDataURL();
    }
    
    function CharacterSystem(world) {
        this.world = world;
        
        world.onEntityAdded('character').add(function(entity) {
            var character = entity.getComponent('character'),
                imageUrl = buildChar(character);
               
            entity.addComponent('sprite', {image: imageUrl});
        });
    }
    
    window.CharacterSystem = CharacterSystem;
    
})(window.Graphics);