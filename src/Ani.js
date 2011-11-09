var Ani = Ani || {};

Ani.Ani = function(autostart, targetObject, durationEasing, durationDelay, targetObjectFieldName, end, easing, timeMode, callback){
    Ani.AniCore.call(this, autostart, targetObject, durationEasing, durationDelay, targetObjectFieldName, end, easing, timeMode, callback);
};

Ani.Ani.prototype = new Ani.AniCore();
Ani.Ani.prototype.constructor = Ani.Ani;
Ani.Ani.prototype.supr = Ani.AniCore.prototype;

Ani.Ani.anisLookup = {};
Ani.Ani.defaultTimeMode = Ani.Constants.SECONDS;
Ani.Ani.defaultEasing = new Ani.Easings.Linear();
Ani.Ani.defaultAutostartMode = Ani.Constants.AUTOSTART;
Ani.Ani.defaultCallback = "";
Ani.Ani.defaultOverwriteMode = Ani.Constants.OVERWRITE;

// create a new Ani instance and add to lookup
// or overwrite an existing Ani with new parameters
Ani.Ani.to = function(theReverse, theTarget, theDuration, theDelay, theFieldName, theEnd, theEasing, theTimeMode, theCallback){
    var fields = theFieldName.split(/\s*,\s*/);
    if (fields.length === 1){
        Ani.Ani.cleanAnis();
        var id = theTarget.toString() + "_" + theFieldName;

        // get old Ani and overwrite (this is behavior is ignored if defaultAddMode is set to NO_OVERWRITE
        if (Ani.Ani.anisLookup.hasOwnProperty(id) && Ani.Ani.defaultOverwriteMode === Ani.Constants.OVERWRITE) {
            var existingAni = Ani.Ani.anisLookup[id];

            existingAni.setDuration(theDuration);
            existingAni.setDelay(theDelay);
            existingAni.setEasing(theEasing);
            existingAni.timeMode = theTimeMode;
            existingAni.setCallback(theCallback);
            existingAni.setBegin();
            existingAni.setEnd(theEnd);
            existingAni.seek(0.0);

            // Ani.to or Ani.from?
            if (theReverse) {
                existingAni.reverse();
            }
            return existingAni;
        } else { // create new Ani
            var newAni = new Ani.Ani(theTarget, theDuration, theDelay, theFieldName, theEnd, theEasing, theCallback);
            if (theReverse) {
                newAni.reverse();
            }
            Ani.Ani.anisLookup[id] = newAni;
            return newAni;
        }
    } else {
        var anis = [];
        for (var f in fields){
            var p = f.split(/\s*:\s*/);
            if (p.length === 2){
                var fieldName = p[0],
                    end = parseFloat(p[1]);
                anis.push(Ani.Ani.to(theReverse, theTarget, theDuration, theDelay, fieldName, end, theEasing, theTimeMode, theCallback));
            }
        }
        return anis;
    }
};

// remove finished ani form lookup
// so that there will be no reference to the object and the garbage collector can delete it
Ani.Ani.cleanAnis = function(){
    Ani.Ani.anisLookup = {};
};

/**
 * kills all anis of the lookup table in Ani
 */
Ani.Ani.killAll = function(){
    for (var p in Ani.Ani.anisLookup){
        if (Ani.Ani.anisLookup.hasOwnProperty(p)){
            var ani = Ani.Ani.anisLookup[p];
            ani.pause();
        }
    }
    Ani.Ani.cleanAnis();
};

/**
 * Sets the defaultAutostartMode of all new created Animations to: On
 */
Ani.Ani.autostart = function(){
    Ani.Ani.defaultAutostartMode = Ani.Constants.AUTOSTART;
};

/**
 * Sets the defaultAutostartMode of all new created Animations to: Off
 */
Ani.Ani.noAutostart = function(){
    Ani.Ani.defaultAutostartMode = Ani.Constants.NO_AUTOSTART;
};

/**
 * Sets the defaultOverwriteMode of all new created Animations to: On
 * Enable overwrite manager of all on going animations to avoid any possible conflicts
 */
Ani.Ani.overwrite = function(){
    Ani.Ani.defaultOverwriteMode = Ani.Constants.OVERWRITE;
};

/**
 * Sets the defaultOverwriteMode of all new created Animations to: Off
 * Disable overwrite manager of all on going animations
 * A new ani instance is always created even if there is a potential conflict for an already existing animation
 */
Ani.Ani.noOverwrite = function(){
    Ani.Ani.defaultOverwriteMode = Ani.Constants.NO_OVERWRITE;
};

/**
 * Size or count of all animations controlled by the overwrite features
 *
 * @return the size
 */
Ani.Ani.size = function(){
    return Ani.Util.ownSize(Ani.Ani.anisLookup);
};