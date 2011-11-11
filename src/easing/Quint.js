Ani.Easings.Quint = function(easingMode){
    Ani.Easings.Easing.call(this, easingMode);

    this.easeIn = function(t, b, c, d){
        return c * (t /= d) * t * t * t * t + b;
    };

    this.easeOut = function(t, b, c, d){
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    };

    this.easeInOut = function(t, b, c, d){
        return ((t /= d / 2) < 1) ?
			(c / 2 * t * t * t * t * t + b) :
		    (c / 2 * ((t -= 2) * t * t * t * t + 2) + b);
    };
};

Ani.Easings.Quint.prototype = new Ani.Easings.Easing();
Ani.Easings.Quint.prototype.constructor = Ani.Easings.Quint;