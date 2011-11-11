Ani.Easings.Expo = function(easingMode){
    Ani.Easings.Easing.call(this, easingMode);

    this.easeIn = function(t, b, c, d){
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    };

    this.easeOut = function(t, b, c, d){
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    };

    this.easeInOut = function(t, b, c, d){
        if (t == 0)
			return b;

		if (t == d)
			return b + c;

		return ((t /= d / 2) < 1) ?
			(c / 2 * Math.pow(2, 10 * (t - 1)) + b) :
		    (c / 2 * (-Math.pow(2, -10 * --t) + 2) + b);
    };
};

Ani.Easings.Expo.prototype = new Ani.Easings.Easing();
Ani.Easings.Expo.prototype.constructor = Ani.Easings.Expo;