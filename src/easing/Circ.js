Ani.Easings.Circ = function(easingMode){
    Ani.Easings.Easing.call(this, easingMode);

    this.easeIn = function(t, b, c, d){
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    };

    this.easeOut = function(t, b, c, d){
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    };

    this.easeInOut = function(t, b, c, d){
        return ((t /= d / 2) < 1) ?
			(-c / 2 * (Math.sqrt(1 - t * t) - 1) + b) :
		    (c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b);
    };
};

Ani.Easings.Circ.prototype = new Ani.Easings.Easing();
Ani.Easings.Circ.prototype.constructor = Ani.Easings.Circ;