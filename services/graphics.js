// shared graphics utils
var Graphics = {
    drawPixel: function drawPixel(imageData, x, y, color) {
        //console.debug('drawPixel: ', x, y, color);
        var i = ((y >> 0) * imageData.width + (x >> 0)) * 4;
        
        imageData.data[i] = color.r;
        imageData.data[i + 1] = color.g;
        imageData.data[i + 2] = color.b;
        imageData.data[i + 3] = color.a * 255;
    },
    getRandomColor: function() {
        var c = Math.random() * 0xffffff|0,
            color = {};

		color.a = 1;
	    color.r = ((c >> 16) & 0xff);
		color.g = ((c >>  8) & 0xff);
		color.b = ((c      ) & 0xff);
		
		return color;
    },
    colors: {
        transparent: {r: 0, g: 0, b: 0, a: 0},
        black: {r: 0, g: 0, b: 0, a: 1}
    }
};
