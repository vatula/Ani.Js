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
    return {};
})();