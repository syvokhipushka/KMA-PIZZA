var basil = require("basil.js");
basil = new basil();
function set(key, value){
    basil.set(key, value);
}
function get(key){
    return basil.get(key);
}

exports.set = set;
exports.get = get;

