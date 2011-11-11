Ani.Easings.Quart = function(easingMode){
    Ani.Easings.Easing.call(this, easingMode);

    this.easeIn = function(t, b, c, d){
        return c * (t /= d) * t * t * t + b;
    };

    this.easeOut = function(t, b, c, d){
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    };

    this.easeInOut = function(t, b, c, d){
        return ((t /= d / 2) < 1) ?
			(c / 2 * t * t * t * t + b) :
            (-c / 2 * ((t -= 2) * t * t * t - 2) + b);
    };
};

Ani.Easings.Quart.prototype = new Ani.Easings.Easing();
Ani.Easings.Quart.prototype.constructor = Ani.Easings.Quart;