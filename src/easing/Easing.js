var Ani = Ani || {};

Ani.Easings = Ani.Easings || {};

/**
 * Class Easing, which maps time to position.
 */
Ani.Easings.Easing = function(easingMode){
    this.easingMode = easingMode || Ani.Constants.OUT;
};

Ani.Easings.Easing.prototype = {
    constructor: Ani.Easings.Easing,

    /**
     * Calc easing: map time to position.
     *
	 * @param t the time
	 * @param b the begin
	 * @param c the change
	 * @param d the duration
	 * @return the float
	 */
    calcEasing: function(f, b, c, d){
        var out = 0.0,
            mode = Ani.Constants;

        switch(easingMode){
            case mode.IN:
                out = easeIn(t, b, c, d);
                break;
            case mode.IN_OUT:
                out = easeInOut(t, b, c, d);
                break;
            case mode.OUT:
                out = easeOut(t, b, c, d);
                break;
            default:
                out = easeOut(t, b, c, d);
                break;
        }
        return out;
    },

    /**
	 * Set the shape mode
	 * @param theEasingMode IN, OUT, IN_OUT
	 */
    setMode: function(easingMode){
        this.easingMode = easingMode;
    },

    /**
	 * All extensions of the Easing class should implement the following methods
	 */
    easeIn: function(t, b, c, d){},
    easeOut: function(t, b, c, d){},
    easeInOut: function(t, b, c, d){}
};