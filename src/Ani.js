Ani.registrations = [];
Ani.register = function(obj){
    if (("pre" in obj) && (Ani.registrations.indexOf(obj) === -1)){
        Ani.registrations.push(obj);
    }
};

Ani.unregister = function(obj){
    var index = Ani.registrations.indexOf(obj);
    if (index != -1){
        Ani.registrations.splice(index, 1);
    }
};

Ani.update = function(){
    var i = 0;
    for (i; i < Ani.registrations.length; ++i){
        Ani.registrations[i].pre();
    }
};

Ani.Ani = function(op){
    var defaults = {
        autostart: Ani.Ani.defaultAutostartMode,
        reverse: false,
        target: null,
        duration: 0.0,
        delay: 0.0,
        fieldName: "",
        end: 0.0,
        easing: new Ani.Easings.Linear(),
        timeMode: Ani.Constants.SECONDS,
        callback: null
    },
    op = Ani.Util.merge(defaults, op);
    Ani.AniCore.call(this, op.autostart, op.target, op.duration, op.delay, op.fieldName, op.end, op.easing, op.timeMode, op.callback);
};

Ani.Ani.prototype = new Ani.AniCore();
Ani.Ani.prototype.constructor = Ani.Ani;
Ani.Ani.prototype.supr = Ani.AniCore.prototype;

Ani.Ani.anisLookup = {};
Ani.Ani.defaultAutostartMode = Ani.Constants.AUTOSTART;
Ani.Ani.defaultOverwriteMode = Ani.Constants.OVERWRITE;

// create a new Ani instance and add to lookup
// or overwrite an existing Ani with new parameters
Ani.Ani.to = function(op){
    var defaults = {
        autostart: Ani.Ani.defaultAutostartMode,
        reverse: false,
        target: null,
        duration: 0.0,
        delay: 0.0,
        targetFields: "",
        easing: new Ani.Easings.Linear(),
        timeMode: Ani.Constants.SECONDS,
        callback: null
    },
    op = Ani.Util.merge(defaults, op),
    aniOp = {
        autostart: op.autostart,
        reverse: op.reverse,
        target: op.target,
        duration: op.duration,
        delay: op.delay,
        fieldName: "",
        end: 0.0,
        easing: op.easing,
        timeMode: op.timeMode,
        callback: op.callback
    },
    p;

    var transformTargetFields = function(targetFields){
        var type = typeof targetFields,
            result = {}, kv, i=0;

        if (type === "string"){ // "x: a[, y: b]…"
            var coma = /\s*,\s*/,
                colon = /\s*:\s*/;
            targetFields = targetFields.split(coma);
            for(i; i<targetFields.length; ++i){
                kv = targetFields[i].split(colon);
                result[kv[0]] = parseFloat(kv[1]);
            }
        } else if (type === "object"){ // {x: a, y: b}
            result = targetFields;
        }
        return result;
    };

    var fields = transformTargetFields(op.targetFields),
        anis = [],
        ani;

    for(p in fields){
        aniOp.fieldName = p;
        aniOp.end = fields[p];

        Ani.Ani.cleanAnis();

        var ani_uid = aniOp.target.ani_uid+"_"+aniOp.fieldName;
        if ((Ani.Ani.defaultOverwriteMode === Ani.Constants.OVERWRITE) && (ani_uid in Ani.Ani.anisLookup)){
            ani = Ani.Ani.anisLookup[ani_uid];

            ani.setDuration(aniOp.duration);
            ani.setDelay(aniOp.delay);
            ani.setEasing(aniOp.easing);
            ani.timeMode = aniOp.timeMode;
            ani.setCallback(aniOp.callback);
            ani.setBegin();
            ani.setEnd(aniOp.end);
            ani.seek(0.0);
        } else {
            ani = new Ani.Ani(aniOp);
            Ani.Ani.anisLookup[ani_uid] = ani;
        }

        if (aniOp.reverse){
            ani.reverse();
        }
        anis.push(ani);
    }
    return anis;
};

// remove finished ani form lookup
// so that there will be no reference to the object and the garbage collector can delete it
Ani.Ani.cleanAnis = function(){
    var i, ani;
    for(i in Ani.Ani.anisLookup){
        ani = Ani.Ani.anisLookup[i];
        if (ani.isEnded){
            delete Ani.Ani.anisLookup[i];
        }
    }
};

/**
 * kills all anis of the lookup table in Ani
 */
Ani.Ani.killAll = function(){
    var p;
    for (p in Ani.Ani.anisLookup){
        if (Ani.Ani.anisLookup.hasOwnProperty(p)){
            var ani = Ani.Ani.anisLookup[p];
            ani.pause();
            Ani.unregister(ani);
            ani = null;
            delete Ani.Ani.anisLookup[p];
        }
    }
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