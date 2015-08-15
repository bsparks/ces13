function InputSystem() {
    this._keys = {};

    this.codes = {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
    };

    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
};

InputSystem.prototype.onKeyDown = function(event) {
    this._keys[event.keyCode] = this._keys[event.keyCode] || {};

    if (!this._keys[event.keyCode].down) {
      this._keys[event.keyCode].pressed = true;
    }
    this._keys[event.keyCode].down = true;
    console.debug('keydown', this._keys[event.keyCode]);
};

InputSystem.prototype.onKeyUp = function(event) {
    this._keys[event.keyCode] = this._keys[event.keyCode] || {};
    this._keys[event.keyCode].down = false;
};

InputSystem.prototype._getKey = function(which) {
    var key;

    if (typeof which === 'number') {
        key = this._keys[which];
    }

    if (typeof which === 'string') {
        key = this._keys[this.codes[which]];
    }

    return key;
};

InputSystem.prototype.pressed = function(which) {
    var key = this._getKey(which);
    if (!key) {
      return false;
    }

    if (key.pressed) {
      key.pressed = false;
      return true;
    }

    return false;
};

InputSystem.prototype.down = function(which) {
    var key = this._getKey(which);
    if (!key) {
      return false;
    }
    return key.down;
};
