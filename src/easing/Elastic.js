Ani.Easings.Elastic = function(easingMode){
    Ani.Easings.Easing.call(this, easingMode);

    this.easeIn = function(t, b, c, d){
        if (t == 0)
			return b;

		if ((t /= d) == 1)
			return b + c;

		var p = d * 0.3,
		    a = c,
		    s = p / 4;
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    };

    this.easeOut = function(t, b, c, d){
        if (t == 0)
			return b;

        if ((t /= d) == 1)
			return b + c;

        var p = d * 0.3,
		    a = c,
		    s = p / 4;
		return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
    };

    this.easeInOut = function(t, b, c, d){
        if (t == 0)
			return b;

		if ((t /= d / 2) == 2)
			return b + c;

		var p = d * (0.3 * 1.5),
		    a = c,
		    s = p / 4;
		return (t < 1) ?
            (-0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b) :
		    (a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b);
    };
};

Ani.Easings.Elastic.prototype = new Ani.Easings.Easing();
Ani.Easings.Elastic.prototype.constructor = Ani.Easings.Elastic;