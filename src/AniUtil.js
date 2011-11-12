Ani.Util = {
    map: function(value, istart, istop, ostart, ostop){
        return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
    },
    ownSize: function(obj){
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size++;
            }
        }
        return size;
    },
    merge: function(obj1, obj2){
        var result = {};
        for (var p2 in obj2) {
            if (obj2.hasOwnProperty(p2)) {
                result[p2] = obj2[p2];
                if (obj1.hasOwnProperty(p2)) {
                    delete obj1[p2];
                }
            }
        }
        for (var p1 in obj1) { if (obj1.hasOwnProperty(p1)) {result[p1] = obj1[p1];} }
        return result;
    }
};