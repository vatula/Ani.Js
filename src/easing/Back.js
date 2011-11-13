Ani.Easings.Back = function(easingMode){
    Ani.Easings.Easing.call(this, easingMode);
    this.s = 1.70158;
};

Ani.Easings.Back.prototype = new Ani.Easings.Easing();
Ani.Easings.Back.prototype.constructor = Ani.Easings.Back;
Ani.Easings.Back.prototype.easeIn = function(t, b, c ,d){
    return c * (t /= d) * t * ((this.s + 1) * t - this.s) + b;
};
Ani.Easings.Back.prototype.easeOut = function(t, b, c ,d){
    return c * ((t = t / d - 1) * t * ((this.s + 1) * t + this.s) + 1) + b;
};
Ani.Easings.Back.prototype.easeInOut = function(t, b, c ,d){
    var s = this.s;
    return ((t /= (d/2)) < 1) ?
        c/2 * (t*t * (((s *= 1.525) + 1) * t - s)) + b
        : c/2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
};