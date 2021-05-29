import Tag from './tag.js';
import RingLog from './ringlog.js';
import config from './config.js';
// import crypto from 'crypto';
const crypto = { createHash: () => ({ update: (_h) => ({ digest: () => (_h + (new Date()).toISOString()).length }) }) }

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
Task.prototype.render = function(children = []) {
    var rt = document.createElement('div');
    rt.classList.add('rings-task');
    var rtH4 = document.createElement('h4');
    rtH4.textContent = this.toString();
    rt.appendChild(rtH4)
    if (children instanceof Array)
        children.forEach(c => rt.appendChild(c));
    else
        rt.appendChild(children)
    return rt;
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