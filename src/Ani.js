Ani.Animation = function(op){
    op = Ani.Util.merge(Ani.Animation.defaults, op);
    Ani.AniCore.call(this, op.autostart, op.target, op.duration, op.delay, op.fieldName, op.end, op.easing, op.timeMode, op.callback);
};
Ani.Animation.defaults = {
    autostart: Ani.defaultAutostartMode,
    reverse: false,
    target: null,
    duration: 0.0,
    delay: 0.0,
    fieldName: "",
    end: 0.0,
    easing: Ani.defaultEasing,
    timeMode: Ani.defaultTimeMode,
    callback: null
};
Ani.Animation.prototype = new Ani.AniCore();
Ani.Animation.prototype.constructor = Ani.Animation;
Ani.Animation.prototype.supr = Ani.AniCore.prototype;