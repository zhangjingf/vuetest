var reg = /[^\x00-\xff]/g;

module.exports = function(str) {
    return (str || "").replace(reg, "aa").length;
}