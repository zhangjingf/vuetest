module.exports = function(node) {
	if(node === undefined){
		node = document.body;
	}
    var list = Array.prototype.slice.call(node.querySelectorAll("[node-name]"), 0);
    var nodeList = {};

    list.forEach(function(el) {
        var name = el.getAttribute("node-name");

        if (name in nodeList) {
            nodeList[name] = [].concat(nodeList[name], el);
        } else {
            nodeList[name] = el;
        }
    });

    return nodeList;
}