var Ani = Ani || (function(){ // define unique ani id for any object
    var id_counter = 1;
    Object.defineProperty(Object.prototype, "__ani_uid", {
        writable: true
    });
    Object.defineProperty(Object.prototype, "ani_uid", {
        get: function() {
            if (this.__ani_uid === undefined)
                this.__ani_uid = id_counter++;
            return this.__ani_uid;
        }
    });

    var registrations = [];

    return {

        anisLookup: {},
        defaultAutostartMode: null,
        defaultOverwriteMode: null,
        defaultTimeMode: null,
        defaultEasing: null,

        init: function(){
            this.autostart();
            this.overwrite();
            this.defaultTimeMode = Ani.Constants.SECONDS;
            this.defaultEasing = new Ani.Easings.Linear();
        },

        /**
         * Sets the defaultAutostartMode of all new created Animations to: On
         */
        autostart: function(){
            this.defaultAutostartMode = Ani.Constants.AUTOSTART;
        },

        /**
         * Sets the defaultAutostartMode of all new created Animations to: Off
         */
        noAutostart: function(){
            this.defaultAutostartMode = Ani.Constants.NO_AUTOSTART;
        },

        /**
         * Sets the defaultOverwriteMode of all new created Animations to: On
         * Enable overwrite manager of all on going animations to avoid any possible conflicts
         */
        overwrite: function(){
            this.defaultOverwriteMode = Ani.Constants.OVERWRITE;
        },

        /**
         * Sets the defaultOverwriteMode of all new created Animations to: Off
         * Disable overwrite manager of all on going animations
         * A new ani instance is always created even if there is a potential conflict for an already existing animation
         */
        noOverwrite: function(){
            this.defaultOverwriteMode = Ani.Constants.NO_OVERWRITE;
        },

        /**
         * remove finished ani form lookup
         * so that there will be no reference to the object and the garbage collector can delete it
         */
        cleanAnis: function(){
            var i, ani;
            for(i in this.anisLookup){
                ani = this.anisLookup[i];
                if (ani.isEnded){
                    delete this.anisLookup[i];
                }
            }
        },

        /**
         * kills all anis of the lookup table in Ani
         */
        killAll: function(){
            var i, ani;
            for (i in this.anisLookup){
                if (this.anisLookup.hasOwnProperty(i)){
                    ani = this.anisLookup[i];
                    ani.pause();
                    this.unregister(ani);
                    ani = null;
                    delete this.anisLookup[i];
                }
            }
        },

        /**
         * Size or count of all animations controlled by the overwrite features
         *
         * @return the size
         */
        size: function(){
            return Ani.Util.ownSize(this.anisLookup);
        },

        register: function(obj){
            if (("pre" in obj) && (registrations.indexOf(obj) === -1)){
                registrations.push(obj);
            }
        },

        unregister: function(obj){
            var index = registrations.indexOf(obj);
            if (index != -1){
                registrations.splice(index, 1);
            }
        },
        update: function(){
            var i;
            for (i = 0; i < registrations.length; ++i){
                registrations[i].pre();
            }
        },

        /**
         * create a new Ani instance and add to lookup
         * or overwrite an existing Ani with new parameters
         */
        to: function(op){
            op = Ani.Util.merge(Ani.Animation.defaults, op);

            var transformTargetFields = function(targetFields){
                var type = typeof targetFields,
                    result = {}, kv, i;

                if (type === "string"){ // "x: a[, y: b]…"
                    var coma = /\s*,\s*/,
                        colon = /\s*:\s*/;
                    targetFields = targetFields.split(coma);
                    for(i = 0; i<targetFields.length; ++i){
                        kv = targetFields[i].split(colon);
                        result[kv[0]] = parseFloat(kv[1]);
                    }
                } else if (type === "object"){ // {x: a, y: b}
                    result = targetFields;
                }
                return result;
            };

            var fields = transformTargetFields(op.targetFields),
                anis = [], ani, p;

            for(p in fields){
                op.fieldName = p;
                op.end = fields[p];

                this.cleanAnis();

                var ani_uid = op.target.ani_uid+"_"+op.fieldName;
                if ((this.defaultOverwriteMode === Ani.Constants.OVERWRITE) && (ani_uid in this.anisLookup)){
                    ani = this.anisLookup[ani_uid];

                    ani.setDuration(op.duration);
                    ani.setDelay(op.delay);
                    ani.setEasing(op.easing);
                    ani.timeMode = op.timeMode;
                    ani.setCallback(op.callback);
                    ani.setBegin();
                    ani.setEnd(op.end);
                    ani.seek(0.0);
                } else {
                    ani = new Ani.Animation(op);
                    this.anisLookup[ani_uid] = ani;
                }

                if (op.reverse){
                    ani.reverse();
                }
                anis.push(ani);
            }
            return anis;
        }
    };
})();