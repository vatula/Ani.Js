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
    }
};