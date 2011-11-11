Ani.Easings.Sine = function(easingMode){
    Ani.Easings.Easing.call(this, easingMode);

    this.easeIn = function(t, b, c, d){
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    };

    this.easeOut = function(t, b, c, d){
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    };

    this.easeInOut = function(t, b, c, d){
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    };
};

Ani.Easings.Sine.prototype = new Ani.Easings.Easing();
Ani.Easings.Sine.prototype.constructor = Ani.Easings.Sine;