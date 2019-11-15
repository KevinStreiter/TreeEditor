module.exports = function toDOM(obj) {
    if (typeof obj == 'string') {
        obj = JSON.parse(obj);
    }
    var node, nodeType = obj.nodeType;
    console.log(nodeType);
    switch (nodeType) {
        case 1: //ELEMENT_NODE
            node = document.createElement(obj.tagName);
            var attributes = obj.attributes || [];
            for (var i = 0, len = attributes.length; i < len; i++) {
                var attr = attributes[i];
                node.setAttribute(attr[0], attr[1]);
            }
            break;
        case 3: //TEXT_NODE
            node = document.createTextNode(obj.nodeValue);
            break;
        case 8: //COMMENT_NODE
            node = document.createComment(obj.nodeValue);
            break;
        case 9: //DOCUMENT_NODE
            node = document.implementation.createDocument();
            break;
        case 10: //DOCUMENT_TYPE_NODE
            node = document.implementation.createDocumentType(obj.nodeName);
            break;
        case 11: //DOCUMENT_FRAGMENT_NODE
            node = document.createDocumentFragment();
            break;
        default:
            return node;
    }
    if (nodeType == 1 || nodeType == 11) {
        var childNodes = obj.childNodes || [];
        for (i = 0, len = childNodes.length; i < len; i++) {
            node.appendChild(toDOM(childNodes[i]));
        }
    }
    return node;
};