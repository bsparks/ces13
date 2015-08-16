var easing = {
    linear : function(value) {
			return value;
		},

		inQuad : function(value) {
			return Math.pow(value, 2);
		},

		outQuad : function(value) {
			return -(Math.pow((value - 1), 2) - 1);
		},

		inOutQuad : function(value) {
			if ((value /= 0.5) < 1)
				return 0.5 * Math.pow(value, 2);
			return -0.5 * ((value -= 2) * value - 2);
		},

		inCubic : function(value) {
			return Math.pow(value, 3);
		},

		outCubic : function(value) {
			return (Math.pow((value - 1), 3) + 1);
		},

		inOutCubic : function(value) {
			if ((value /= 0.5) < 1)
				return 0.5 * Math.pow(value, 3);
			return 0.5 * (Math.pow((value - 2), 3) + 2);
		},

		inQuart : function(value) {
			return Math.pow(value, 4);
		},

		outQuart : function(value) {
			return -(Math.pow((value - 1), 4) - 1);
		},

		inOutQuart : function(value) {
			if ((value /= 0.5) < 1)
				return 0.5 * Math.pow(value, 4);
			return -0.5 * ((value -= 2) * Math.pow(value, 3) - 2);
		},

		inSine : function(value) {
			return -Math.cos(value * (Math.PI / 2)) + 1;
		},

		outSine : function(value) {
			return Math.sin(value * (Math.PI / 2));
		},

		inOutSine : function(value) {
			return (-0.5 * (Math.cos(Math.PI * value) - 1));
		},

		inExpo : function(value) {
			return (value === 0) ? 0 : Math.pow(2, 10 * (value - 1));
		},

		outExpo : function(value) {
			return (value === 1) ? 1 : -Math.pow(2, -10 * value) + 1;
		},

		inOutExpo : function(value) {
			if (value === 0)
				return 0;
			if (value === 1)
				return 1;
			if ((value /= 0.5) < 1)
				return 0.5 * Math.pow(2, 10 * (value - 1));
			return 0.5 * (-Math.pow(2, -10 * --value) + 2);
		},

		inCirc : function(value) {
			return -(Math.sqrt(1 - (value * value)) - 1);
		},

		outCirc : function(value) {
			return Math.sqrt(1 - Math.pow((value - 1), 2));
		},

		inOutCirc : function(value) {
			if ((value /= 0.5) < 1)
				return -0.5 * (Math.sqrt(1 - value * value) - 1);
			return 0.5 * (Math.sqrt(1 - (value -= 2) * value) + 1);
		},

		inBack : function(value) {
			var s = 1.70158;
			return (value) * value * ((s + 1) * value - s);
		},

		outBack : function(value) {
			var s = 1.70158;
			return ( value = value - 1) * value * ((s + 1) * value + s) + 1;
		},

		inOutBack : function(value) {
			var s = 1.70158;
			if ((value /= 0.5) < 1)
				return 0.5 * (value * value * (((s *= (1.525)) + 1) * value - s));
			return 0.5 * ((value -= 2) * value * (((s *= (1.525)) + 1) * value + s) + 2);
		}
};
