import config from './config.js';

export default function RingLog(r) {
    const { defaultType } = config.ringLog;
    this.logTime = new Date();
    this.id = defaultType + ":" + this.logTime.getTime();
    this.ring = { id: r.id, name: r.name };
    return this;
}
RingLog.prototype.getSelfNode = function() {
    if (!this.htmlNode) {
        this.htmlNode = document.createElement('div');
        this.htmlNode.classList.add('rings-ringlog');
    }
    return this.htmlNode;
}
RingLog.prototype.updateSelfNode = function(newNode) {
    var self = this.getSelfNode();
    if (self.parentNode)
        self.parentNode.replaceChild(newNode, self);
    else
        this.htmlNode = newNode;
}
RingLog.prototype.render = function(children = []) {
    var rt = document.createElement('div');
    rt.classList.add('rings-ringlog');
    rt.textContent = this.toString();
    if (children instanceof Array)
        children.forEach(c => rt.appendChild(c));
    else
        rt.appendChild(children);

    this.updateSelfNode(rt);
    return this.getSelfNode();
};
RingLog.prototype.toString = function() { return `Ring ${this.ring.name} at ${this.logTime.toISOString()}` };
RingLog.prototype.equals = function(t) { return this.id === t.id };