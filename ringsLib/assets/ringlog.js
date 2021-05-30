import config from './config.js';

export default function RingLog(r) {
    const { defaultType } = config.RingLog;
    this.logTime = new Date();
    this.id = defaultType + ":" + this.logTime.getTime();
    this.ring = { id: r.id, name: r.name };
    return this;
};
RingLog.prototype._getSelfNode = function() {
    if (!this.selfDomElement) {
        this.selfDomElement = document.createElement('div');
        this.selfDomElement.classList.add('rings-ringlog');
    }
    return this.selfDomElement;
};
RingLog.prototype._updateSelfNode = function(newNode) {
    var self = this._getSelfNode();
    if (self.parentNode)
    // If mounted replace it in the parent
        self.parentNode.replaceChild(newNode, self);
    this.selfDomElement = newNode;
};
RingLog.prototype.connectEventsThread = function(eventsThread) {
    this.eventsThread = eventsThread;
    // TODO: Remove dummy event listener
    this.eventsThread.addEventListener(config.Events.dataDefault, function(e) {
        console.log(`${this.toString()}: EVENT RECEIVED ${JSON.stringify(e.detail)}`);
    }.bind(this));
    // Propagate
    // this.<childs>.forEach(ch => ch.connectEventsThread(this.eventsThread));
};
RingLog.prototype.render = function(children) {
    children = children || [];

    // DIV ITEMS
    if (!(children instanceof Array))
        children = [children];

    var rtDivItems = document.createElement('div');
    rtDivItems.classList.add('rings-items', 'rings-ringlog-items');
    children.forEach(ch => rtDivItems.appendChild(ch));

    // ROOT
    var rt = document.createElement('div');
    rt.classList.add('rings-ringlog');
    rt.textContent = this.toString();

    this._updateSelfNode(rt);
    return this._getSelfNode();
};
RingLog.prototype.toString = function() { return `Ring ${this.ring.name} at ${this.logTime.toISOString()}` };
RingLog.prototype.equals = function(t) { return this.id === t.id };