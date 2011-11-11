Ani.Easings.Cubic = function(easingMode){
    Ani.Easings.Easing.call(this, easingMode);

    this.easeIn = function(t, b, c, d){
        return c * (t /= d) * t * t + b;
    };

    this.easeOut = function(t, b, c, d){
        return c * ((t = t / d - 1) * t * t + 1) + b;
    };

    this.easeInOut = function(t, b, c, d){
        return ((t /= d / 2) < 1) ?
            (c / 2 * t * t * t + b) :
            (c / 2 * ((t -= 2) * t * t + 2) + b);
    };
};

Ani.Easings.Cubic.prototype = new Ani.Easings.Easing();
Ani.Easings.Cubic.prototype.constructor = Ani.Easings.Cubic;