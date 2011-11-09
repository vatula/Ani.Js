var Ani = Ani || {};

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
        callback: ""
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
        fieldName: "",
        end: 0.0,
        easing: new Ani.Easings.Linear(),
        timeMode: Ani.Constants.SECONDS,
        callback: ""
    },
    op = Ani.Util.merge(defaults, op);

    var fields = op.fieldName.split(/\s*,\s*/);
    if (fields.length === 1){

        // In case we defined single property in a multiproperty way (i.e. using “var:val” syntax)
        var p = fields[0].split(/\s*:\s*/);
        if (p.length === 2){
            op.fieldName = p[0];
            op.end = parseFloat(p[1]) || op.end;
        }

        Ani.Ani.cleanAnis();
        var id = Ani.Util.fnv1aHash(op.target.constructor.toString()) + "_" + op.fieldName;

        // get old Ani and overwrite (this is behavior is ignored if defaultAddMode is set to NO_OVERWRITE
        if (Ani.Ani.anisLookup.hasOwnProperty(id) && Ani.Ani.defaultOverwriteMode === Ani.Constants.OVERWRITE) {
            var existingAni = Ani.Ani.anisLookup[id];

            existingAni.setDuration(op.duration);
            existingAni.setDelay(op.delay);
            existingAni.setEasing(op.easing);
            existingAni.timeMode = op.timeMode;
            existingAni.setCallback(op.callback);
            existingAni.setBegin();
            existingAni.setEnd(op.end);
            existingAni.seek(0.0);

            // Ani.to or Ani.from?
            if (op.reverse) {
                existingAni.reverse();
            }
            return existingAni;
        } else { // create new Ani
            var newAni = new Ani.Ani(op);
            if (op.reverse) {
                newAni.reverse();
            }
            Ani.Ani.anisLookup[id] = newAni;
            return newAni;
        }
    } else {
        var anis = [];
        for (var f in fields){
            var p = fields[f].split(/\s*:\s*/);
            if (p.length === 2){
                var fieldName = p[0],
                    end = parseFloat(p[1]);
                op = Ani.Util.merge(op, {end: end, fieldName: fieldName})
                anis.push(Ani.Ani.to(op));
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