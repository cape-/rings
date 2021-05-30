import config from './config.js';

export default function Tag(title) {
    const { defaultType } = config.tag;
    this.id = defaultType + ":" + title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '_');
    this.title = title;
    return this;
}
Tag.prototype.getSelfNode = function() {
    if (!this.htmlNode) {
        this.htmlNode = document.createElement('div');
        this.htmlNode.classList.add('rings-tag');
    }
    return this.htmlNode;
}
Tag.prototype.updateSelfNode = function(newNode) {
    var self = this.getSelfNode();
    if (self.parentNode)
        self.parentNode.replaceChild(newNode, self);
    else
        this.htmlNode = newNode;
}
Tag.prototype.render = function(children = []) {
    var rt = document.createElement('div');
    rt.classList.add('rings-tag');
    rt.textContent = this.toString();
    if (children instanceof Array)
        children.forEach(c => rt.appendChild(c));
    else
        rt.appendChild(children)

    this.updateSelfNode(rt);
    return this.getSelfNode();
};
Tag.prototype.toString = function() { return `Tag:${this.title}` };
Tag.prototype.equals = function(t) { return this.id === t.id };