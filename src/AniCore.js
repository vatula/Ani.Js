var Ani = Ani || {};

Ani.AniCore = function(autostart, targetObject, durationEasing, durationDelay, targetObjectFieldName, end, easing, timeMode, callback){

    this.targetName = targetObject ? targetObject.toString() : "";
    this.fieldName = targetObjectFieldName || "";
    this.id = this.targetName+"_"+this.fieldName;

    this.isRegistered = false;
    this.targetObject = targetObject || null;
    this.targetField = "";

    this.position = 0.0;
    this.begin = 0.0;
    this.change = 0.0;
    this.end = end || 0.0;

    this.beginTime = 0.0;
    this.time = 0.0;
    this.durationEasing = durationEasing || 0.0;
    this.durationDelay = durationDelay || 0.0;

    // durationEasing + durationDelay = durationTotal
    this.durationTotal = this.durationEasing + this.durationDelay;
    this.timeMode = timeMode || "";

    // stopwatch timer for pause and resume
    this.pauseTime = 0.0;

    this.easing = easing || new Ani.Easings.Linear();

    this.callbackStartMethod = "";
    this.callbackFinishMethod = "";

    this.playMode = Ani.Constants.FORWARD;
    this.playDirection = Ani.Constants.FORWARD;
    this.repeatNumber = 0;
    this.repeatCount = 1;

    this.isRepeating = false;
    this.isDelaying = false;
    this.isPlaying = false;
    this.isEnded = false;

    /**
	 * Sets the begin of the animation to the current value of the target.
     * or Sets the begin of the animation to a new value if value provided
	 *
	 * @return true, if successful
	 */
    this.setBegin = function(theBegin){
        if (typeof theBegin != "undefined"){
            this.begin = theBegin;
            this.change = this.end - this.begin;
            return true;
        } else {
            var f = false, t = false;

            if ((this.fieldName && this.targetObject)&&(this.fieldName in this.targetObject)){
                f = true;
                var n = this.targetObject[this.fieldName];
                t = !isNaN(n);
                this.begin = t ? parseFloat(n) : this.begin;
                this.change = this.end - this.begin;
            }

            return f && t;
        }
    };

    this.setEasing = function(easing){
        this.easing = easing || new Ani.Easings.Linear();
    };
    this.setCallback = function(callback){
        // ignore empty strings
        if (callback){
            var rec = /\s*,\s*/,
                red = /\s*:\s*/;
            var propertyList = callback.split(rec);
            for(var prop in propertyList){
                var p = prop.split(red);
                if (p.length === 2){
                    if (p[0] === Ani.Constants.ON_START || p[0] === Ani.Constants.ON_END){
                        var targetMethod = p[1];
                        if (targetMethod in this.targetObject){
                            if (p[0] === Ani.Constants.ON_START){
                                this.callbackStartMethod = targetMethod;
                            } else if (p[0] === Ani.Constants.ON_END){
                                this.callbackFinishMethod = targetMethod;
                            }
                        }
                    }
                }
            }
        }
    };

    var dispatchOnStart = function(){
        if (this.callbackStartMethod){
            this.targetObject[this.callbackStartMethod]();
        }
    };

    var dispatchOnEnd = function(){
        this.targetObject[this.callbackFinishMethod]();
    };

    /**
	 * No need to call ever this method. Only public to use the registerPre() mechanism
	 */
    this.pre = function(){
        if (this.isPlaying){
            update();
        }
    };

    /**
	 * Start the animation.
	 */
    this.start = function(){
        if (!this.isRegistered){
            this.repeatNumber = 1;
            this.isRegistered = true;
            dispatchOnStart();
        }
        this.seek(0.0);
        this.isPlaying = true;
        this.isEnded = false;
    };

    this.end = function(){
        this.isDelaying = false;
        this.seek(1.0);
        this.isPlaying = false;
        this.isEnded = true;
        if (this.isRegistered){
            this.isRegistered = false;
        }
        dispatchOnEnd();
    };

    var update = function(){
        setTime(getTime());

        // delay or easing?
        if (this.time < this.durationDelay){
            this.position = this.begin;
            this.isDelaying = true;
        } else {
            this.isDelaying = false;
            if (this.time >= this.durationTotal){
                if (this.isRepeating){
                    if (this.repeatCount === 1 || this.repeatNumber <= this.repeatCount-1 || this.repeatCount === -1){
                        if (this.playMode === Ani.Constants.YOYO) {
                            this.reverse();
                        }
                        this.start();
                        this.repeatNumber++;
                    } else {
                        this.isRepeating = false;
                    }
                } else {
                    end();
                }
            } else {
                updatePosition();
            }
        }
        updateTargetObjectField();
    };

    var updatePosition = function(){
        this.position = this.easing.calcEasing(this.time - this.durationDelay, this.begin, this.change, this.durationEasing);
    };

    var updateTargetObjectField = function(){
        this.targetObject[this.targetField] = this.position;
    };

    var date = new Date();

    var getTime = function(){
        return (this.timeMode === Ani.Constants.SECONDS) ?
            ((date.getTime() - this.beginTime) / 1000) :
            ((date.getTime() - this.beginTime) / 1000); // TODO: (papplet.frameCount - beginTime);
    };

    var setTime = function(theTime){
        this.time = theTime;
        this.beginTime = (this.timeMode === Ani.Constants.SECONDS) ?
            (date.getTime() - this.time*1000) :
            (date.getTime() - this.time*1000); // TODO: (papplet.frameCount - time);
    };

    /**
     * Pause the animation at the current position in time.
	 */
     this.pause = function(){
        this.isPlaying = false;
        this.pauseTime = getTime();
     };

    /**
     * Resume the animation from the current position in time (adjustable with seek).
	 */
     this.resume = function(){
        if (!this.isRegistered){
            this.isRegistered = true;
        }
        if (!this.isPlaying && !this.isEnded){
            this.isPlaying = true;
            // remember the pause time, seek to last time
            this.seek(this.pauseTime / this.durationTotal);
        }
     };

     /**
     * Seek the Animation to any position: start = 0.0 end = 1.0
	 *
	 * @param theValue seek value
	 */
     this.seek = function(theValue){
        // clamp between 0 and 1
        theValue = Math.min(1.0, Math.max(0.0, theValue));
        setTime(theValue*this.durationTotal);
        this.pauseTime = this.time; // overwrite old pause time
        this.isEnded = false;
        // only use easing function to calc position if time > durationDelay
        if (this.time < this.durationDelay){
            this.position = this.begin;
        } else {
            updatePosition();
        }
        updateTargetObjectField();
     };

     /**
     * Gets the current seek value (start = 0.0 end = 1.0)
	 *
	 * @return theValue seek value
	 */
     this.getSeek = function(){
        return Math.min(1.0, Math.max(0.0, this.time/this.durationTotal));
     };

     /**
     * Swap begin end of the animation.
	 */
     this.reverse = function(){
        var beginTemp = this.begin,
            endTemp = this.end;

        this.begin = endTemp;
        this.end = beginTemp;
        this.change = this.end - this.begin;

        if (this.playDirection === Ani.Constants.FORWARD){
            this.playDirection = Ani.Constants.BACKWARD;
        } else if (this.playDirection === Ani.Constants.BACKWARD){
            this.playDirection = Ani.Constants.FORWARD;
        }
     };

     this.playMode = function(thePlayMode){
        var oldDirection = this.playDirection;

        if (thePlayMode === Ani.Constants.FORWARD){
            if (oldDirection === Ani.Constants.BACKWARD){
                this.reverse();
            }
            this.playMode = this.playDirection = Ani.Constants.FORWARD;
        } else if (thePlayMode === Ani.Constants.BACKWARD){
            if (oldDirection === Ani.Constants.FORWARD){
                this.reverse();
            }
            this.playMode = this.playDirection = Ani.Constants.BACKWARD;
        } else if (thePlayMode === Ani.Constants.YOYO){
            this.playMode = Ani.Constants.YOYO;
        }
     };

     /**
     * Repeat the animation.
	 */
     this.repeat = function(theRepeatCount){
        if (theRepeatCount)
        {
            if (theRepeatCount > 1){
                this.isRepeating = true;
                this.repeatCount = theRepeatCount;
            } else {
                this.isRepeating = false;
                this.repeatCount = 1;
            }
        } else { // repeat forever
            this.isRepeating = true;
            this.repeatCount = -1;
        }
     };

     /**
     * Stop any repeating.
	 */
     this.noRepeat = function(){
        this.isRepeating = false;
        this.repeatCount = 1;
     };

     /**
     * Sets the end.
	 *
	 * @param theEnd the new end
	 */
     this.setEnd = function(theEnd){
        this.end = theEnd;
        this.change = this.end - this.begin;
     };

     /**
     * Sets the delay duration.
	 *
	 * @param theDurationDelay the new delay duration
	 */
     this.setDelay = function(theDurationDelay){
        this.durationDelay = theDurationDelay;
        this.durationTotal = this.durationEasing + this.durationDelay;
     };

    /**
     * Sets the duration.
	 *
	 * @param theDurationEasing the new duration
	 */
     this.setDuration = function(theDurationEasing){
        this.durationEasing = theDurationEasing;
        this.durationTotal = this.durationEasing + this.durationDelay;
     };

     this.setCallback(callback);
     var setBeginSuccess = this.setBegin();
     if (setBeginSuccess && autostart === Ani.Constants.AUTOSTART){
        this.start();
     }
};

Ani.AniCore.prototype = {
    constructor: Ani.AniCore
};