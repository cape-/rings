import Tag from './tag.js';
import RingLog from './ringlog.js';
import config from './config.js';
// import crypto from 'crypto'; // TODO: Enable this in backend
const crypto = { createHash: () => ({ update: (_h) => ({ digest: () => (_h + (new Date()).toISOString()).length }) }) } // TODO: Disable this in backend

export default class Task {
    constructor() {
        const { defaultType, defaultTitle, idHashAlgorithm } = config.Task;
        switch (typeof arguments[0]) {
            case 'string':
                var title = arguments[0];
                break;
            case 'object':
                var { title, tags, metadata } = arguments[0];
                break;
            default:
                throw Error('Title expected');
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
    }
    _getSelfNode() {
        if (!this.selfDomElement) {
            this.selfDomElement = document.createElement('div');
            this.selfDomElement.classList.add('rings-task');
        }
        return this.selfDomElement;
    }
    _updateSelfNode(newNode) {
        var self = this._getSelfNode();
        if (self.parentNode)
        // If mounted replace it in the parent
            self.parentNode.replaceChild(newNode, self);
        this.selfDomElement = newNode;
    }
    emit(eventType, payload) {
        this.eventsThread.dispatchEvent(new CustomEvent(config.Events.dataDefault, {
            detail: {
                eventType,
                payload
            }
        }));
    }
    connectEventsThread(eventsThread) {
            this.eventsThread = eventsThread;
            // TODO: Remove dummy event listener
            this.eventsThread.addEventListener(config.Events.dataDefault, function(e) {
                console.log(`${this.toString()}: EVENT RECEIVED ${JSON.stringify(e.detail)}`);
            }.bind(this));
            // Propagate
            this.tags.forEach(t => t.connectEventsThread(this.eventsThread));
            this.ringLog.forEach(l => l.connectEventsThread(this.eventsThread));
        }
        /**
         * Set the task as done.
         * @returns self
         */
    setDone() {
        this.doneDate = new Date();
        this.done = true;
        return this;
    }
    getTags() {
        return this.tags;
    }
    logRing(r) {
        this.ringLog.push(new RingLog(r));
    }
    equals(t) { return this.id === t.id; }
    toString() { return `${this.title} (id:${this.id})${this.done ? ' [DONE]' : ''}`; }
    render(children) {
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
    }
};