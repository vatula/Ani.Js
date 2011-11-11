Ani.Easings.Bounce = function(easingMode){
    Ani.Easings.Easing.call(this, easingMode);

    this.easeIn = function(t, b, c, d){
        return c - this.easeOut(d - t, 0, c, d) + b;
    };

    this.easeOut = function(t, b, c, d){
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
        }
    };

    this.easeInOut = function(t, b, c, d){
        return (t < d / 2) ?
			(this.easeIn(t * 2, 0, c, d) * 0.5 + b) :
			(this.easeOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b);
    };
};

Ani.Easings.Bounce.prototype = new Ani.Easings.Easing();
Ani.Easings.Bounce.prototype.constructor = Ani.Easings.Bounce;