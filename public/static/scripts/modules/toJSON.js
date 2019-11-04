module.exports = function toJSON(node) {
    node = node || this;
    var obj = {
        nodeType: node.nodeType
    };
    if (node.tagName) {
        obj.tagName = node.tagName.toLowerCase();
    } else if (node.nodeName) {
        obj.nodeName = node.nodeName;
    }
    if (node.nodeValue) {
        obj.nodeValue = node.nodeValue;
    }
    var attrs = node.attributes;
    if (attrs) {
        var length = attrs.length;
        var arr = obj.attributes = new Array(length);
        for (var i = 0; i < length; i++) {
            var attr = attrs[i];
            arr[i] = [attr.nodeName, attr.nodeValue];
        }
    }
    var childNodes = node.childNodes;
    if (childNodes) {
        length = childNodes.length;
        arr = obj.childNodes = new Array(length);
        for (i = 0; i < length; i++) {
            arr[i] = toJSON(childNodes[i]);
        }
    }
    return obj;
};

