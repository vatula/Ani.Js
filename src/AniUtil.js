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
        for (var p1 in obj1) { result[p1] = obj1[p1]; }
        for (var p2 in obj2) { result[p2] = obj2[p2]; }
        return result;
    }
};