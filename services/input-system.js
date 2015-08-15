function InputSystem() {
    this._keys = {};
    
    this.codes = {
        LEFT: 37,
        RIGHT: 39
    };
    
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
};

InputSystem.prototype.onKeyDown = function(event) {
    this._keys[event.keyCode] = true;
};

InputSystem.prototype.onKeyUp = function(event) {
    this._keys[event.keyCode] = false;
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
    return !!key;
};

InputSystem.prototype.down = function(which) {
    var key = this._getKey(which);
    return !!key;
};