Ani.Easings.Linear = function(easingMode){
    Ani.Easings.Easing.call(this, easingMode);
};

Ani.Easings.Linear.prototype = new Ani.Easings.Easing();
Ani.Easings.Linear.prototype.constructor = Ani.Easings.Linear;
Ani.Easings.Linear.prototype.easeIn = 
Ani.Easings.Linear.prototype.easeOut = 
Ani.Easings.Linear.prototype.easeInOut = 
Ani.Easings.Linear.prototype.easeNone = function(t, b, c, d){
    return c*t/d + b;
};