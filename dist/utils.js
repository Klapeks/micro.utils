"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mstime = require('jsonwebtoken/node_modules/ms/index');
exports.default = {
    replaceLast: function (str, from, to) {
        var lastIndex = str.lastIndexOf(from);
        if (lastIndex < 0)
            return str;
        return str.substring(0, lastIndex) + to +
            str.substring(lastIndex + from.length);
    },
    mstime: function (time) {
        if (typeof time === "number")
            return time;
        return mstime(time);
    }
};
