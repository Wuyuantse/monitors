"use strict";
exports.__esModule = true;
var child_process = require("child_process");
var parsePosition = function (s) {
    var splitted = s.split(/[x+]/);
    return {
        width: Number(splitted[0]),
        height: Number(splitted[1]),
        offset_x: Number(splitted[2]),
        offset_y: Number(splitted[3])
    };
};
var parseSize = function (line) {
    var matched = line.match(/(\d+mm)/g);
    return {
        width: Number(matched[0]),
        height: Number(matched[1])
    };
};
var parseOutputLine = function (line) {
    var splitted = line.split(' ').filter(function (s) { return s != ''; });
    if (splitted.length >= 2) {
        var output = {
            name: splitted[0],
            connected: splitted[1] === 'connected'
        };
        if (output.connected) {
            output.position = parsePosition(splitted[2]);
            output.size = parseSize(line);
        }
    }
    else {
        return null;
    }
};
var getOutputs = function () {
    var result = child_process.execSync('xrandr').toString();
    var lines = result.split('\n');
    var outputs = lines.map(parseOutputLine);
    return outputs;
};
var outputs = getOutputs();
console.log(outputs);
