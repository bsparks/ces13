// shared graphics utils
var Graphics = {
    drawPixel: function drawPixel(imageData, x, y, color) {
        //console.debug('drawPixel: ', x, y, color);
        var i = ((y >> 0) * imageData.width + (x >> 0)) * 4;
        
        imageData.data[i] = color.r;
        imageData.data[i + 1] = color.g;
        imageData.data[i + 2] = color.b;
        imageData.data[i + 3] = color.a * 255;
    }
};
