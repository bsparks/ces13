var ImageLoader = function() {
  this._cache = {};
};

ImageLoader.prototype = {
  load: function(url) {
    var cache = this._cache;
    var promise = new Promise(function(resolve, reject) {
      if (cache[url]) {
        return resolve(cache[url]);
      }
      
      var img = new Image();
      img.src = url;

      img.onload = function() {
        cache[url] = img;
        resolve(img);
      };

      img.onerror = function() {
        reject('Error loading image: ' + url);
      };
    });

    return promise;
  }
};

ImageLoader.prototype.constructor = ImageLoader;
