import Tag from './tag.js';
import RingLog from './ringlog.js';
import config from './config.js';
// import crypto from 'crypto'; // TODO: Enable this in backend
const crypto = { createHash: () => ({ update: (_h) => ({ digest: () => (_h + (new Date()).toISOString()).length }) }) } // TODO: Disable this in backend

export default function Task() {
    const { defaultType, defaultTitle, idHashAlgorithm } = config.task;
    switch (typeof arguments[0]) {
        case 'string':
            var title = arguments[0];
            break;
        case 'object':
            var { title, tags, metadata } = arguments[0];
            break;
        default:
            throw Error('Title expected')
            break;
    }
    this.creationDate = new Date();
    this.id = defaultType + ":" + crypto.createHash(idHashAlgorithm).update(title + this.creationDate.toISOString()).digest('base64');
    this.title = (title || defaultTitle).toString();
    this.tags = Array.from(tags || []).map(t => new Tag(t));
    this.metadata = metadata;
    this.ringLog = [];
    this.done = false;
    return this;
};
Task.prototype._getSelfNode = function() {
    if (!this.selfDomElement) {
        this.selfDomElement = document.createElement('div');
        this.selfDomElement.classList.add('rings-task');
    }
    return this.selfDomElement;
}
Task.prototype._updateSelfNode = function(newNode) {
    var self = this._getSelfNode();
    if (self.parentNode)
    // If mounted
        self.parentNode.replaceChild(newNode, self);
    else
        this.selfDomElement = newNode;
}
Task.prototype.render = function(children) {
    children = children || [...this.tags.map(t => t.render()),
        ...this.ringLog.map(l => l.render())
    ] || [];

    // H4
    var rtH4 = document.createElement('h4');
    rtH4.textContent = this.toString();

    // DIV ITEMS
    if (!(children instanceof Array))
        children = [children];

    var rtDivItems = document.createElement('div');
    rtDivItems.classList.add('rings-items', 'rings-task-items');
    children.forEach(ch => rtDivItems.appendChild(ch));

    // ROOT
    var rt = document.createElement('div');
    rt.classList.add('rings-task');
    rt.appendChild(rtH4);
    rt.appendChild(rtDivItems);

    this._updateSelfNode(rt);
    return this._getSelfNode();
};
Task.prototype.toString = function() { return `${this.title} (id:${this.id})${this.done ? ' [DONE]':''}` };
Task.prototype.equals = function(t) { return this.id === t.id };
/**
 * Set the task as done.
 * @returns self
 */
Task.prototype.setDone = function() {
    this.doneDate = new Date();
    this.done = true
    return this
};
Task.prototype.getTags = function() {
    return this.tags;
}
Task.prototype.logRing = function(r) {
    this.ringLog.push(new RingLog(r));
}