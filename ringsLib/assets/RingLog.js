import config from './config.js';
import BaseClass from './BaseClass.js';

export default class RingLog extends BaseClass {
    constructor(r) {
        const { defaultType } = config.RingLog;
        super();
        this.logTime = new Date();
        this.id = defaultType + ":" + this.logTime.getTime();
        this.ring = { id: r.id, name: r.name };
        return this;
    }

    _propagateConnection(eventsThread) {
        // Propagate
        // this.<childs>.forEach(ch => ch.connectEventsThread(this.eventsThread));
    }

    equals(t) { return this.id === t.id; }

    toString() { return `Ring ${this.ring.name} at ${this.logTime.toISOString()}`; }

    render(children) {
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
    }
};