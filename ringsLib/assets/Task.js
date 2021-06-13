import Tag from './Tag.js';
import RingLog from './RingLog.js';
import config from './config.js';
import BaseClass from './BaseClass.js';
import { limitText, uidGenerator } from './utils.js';

export default class Task extends BaseClass {
    constructor(arg) {
        super();
        const { defaultType, defaultTitle } = config.Task;
        switch (typeof arg) {
            case 'string':
                var title = arg;
                break;
            case 'object':
                var { id, title, metadata, tags, ringLog, creationDate } = arg;
                break;
            default:
                throw Error('Title expected');
                break;
        }
        this.creationDate = creationDate || new Date();
        this.title = (title || defaultTitle).toString();
        // TODO: Review HASH OPTION in Task.id
        // this.id = defaultType + ":" + hashGenerator(this.title, this.creationDate.toISOString())
        // UID OPTION
        this.id = id || defaultType + ":" + uidGenerator(config.Task.uidLength, this.creationDate);
        this.tags = Array.from(tags || []).map(t => new Tag(t));
        this.metadata = metadata || {};
        this.ringLog = Array.from(ringLog || []).map(l => new RingLog(l));
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
        this.ringLog.push(new RingLog({ ringId: r.id, name: r.name }));
    }

    equals(t) { return this.id === t.id; }

    toString() { return `${this.title} (id:${this.id})${this.done ? ' [DONE]' : ''}`; }

    render(children) {
        children = children || [...this.tags.map(t => t.render()),
            ...this.ringLog.map(l => l.render())
        ] || [];

        if (!(children instanceof Array))
            children = [children];

        // H3
        var rtH3Title = document.createElement('h3');
        rtH3Title.textContent = limitText(this.title, 60);

        // SPAN
        var rtSpanSubtitle = document.createElement('span');
        rtSpanSubtitle.textContent = this.id;

        // DIV HEAD
        var rtDivHead = document.createElement('div');
        rtDivHead.classList.add('rings-task-head');
        rtDivHead.appendChild(rtH3Title);
        rtDivHead.appendChild(rtSpanSubtitle);

        // DIV ITEMS
        var rtDivItems = document.createElement('div');
        rtDivItems.classList.add('rings-items', 'rings-task-items');
        children.forEach(ch => rtDivItems.appendChild(ch));

        // ROOT
        var rt = document.createElement('div');
        rt.classList.add('rings-task');
        rt.appendChild(rtDivHead);
        rt.appendChild(rtDivItems);

        this._updateSelfNode(rt);
        return this._getSelfNode();
    }
};