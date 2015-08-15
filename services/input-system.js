var InputSystem = function() {
    this._keys = {};
    
    this.codes = {
        LEFT: 37,
        RIGHT: 39
    };
    
    window.addEventListener('keyup', this.onKeyUp.bind(this));
    window.addEventListener('keydown', this.onKeyDown.bind(this));
};

InputSystem.prototype.onKeyDown = function(event) {
    this._keys[event.keyCode] = {down: true, repeat: event.repeat};
};

InputSystem.prototype.onKeyUp = function(event) {
    this._keys[event.keyCode] = {down: false, repeat: false};
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
    return key && key.down && !key.repeat;
};

InputSystem.prototype.down = function(which) {
    var key = this._getKey(which);
    return key && key.down;
};