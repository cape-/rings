import Tag from './Tag.js';
import RingLog from './RingLog.js';
import config from './config.js';
import BaseClass from './BaseClass.js';
// import { v4 as uuidv4 } from 'uuid'; // BACKEND: Enable this
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'; // FRONTEND: Enable this

const crypto = { createHash: () => ({ update: (_h) => ({ digest: () => (_h + (new Date()).toISOString()).length }) }) } // TODO: Disable this in backend

export default class Task extends BaseClass {
    constructor() {
        const { defaultType, defaultTitle } = config.Task;
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
        super();
        // this.id = defaultType + ":" + crypto.createHash(idHashAlgorithm).update(title + this.creationDate.toISOString()).digest('base64');
        this.id = defaultType + ":" + uuidv4();
        this.creationDate = new Date();
        this.title = (title || defaultTitle).toString();
        this.tags = Array.from(tags || []).map(t => new Tag(t));
        this.metadata = metadata;
        this.ringLog = [];
        this.done = false;
        return this;
    }

    _propagateConnection(eventsThread) {
        this.tags.forEach(t => t.connectEventsThread(eventsThread));
        this.ringLog.forEach(l => l.connectEventsThread(eventsThread));
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