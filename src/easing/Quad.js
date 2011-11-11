Ani.Easings.Quad = function(easingMode){
    Ani.Easings.Easing.call(this, easingMode);

    this.easeIn = function(t, b, c, d){
        return c * (t /= d) * t + b;
    };

    this.easeOut = function(t, b, c, d){
        return -c * (t /= d) * (t - 2) + b;
    };

    this.easeInOut = function(t, b, c, d){
        return ((t /= d / 2) < 1) ?
			(c / 2 * t * t + b) :
		    (-c / 2 * ((--t) * (t - 2) - 1) + b);
    };
};

Ani.Easings.Quad.prototype = new Ani.Easings.Easing();
Ani.Easings.Quad.prototype.constructor = Ani.Easings.Quad;