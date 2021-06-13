import config from './config.js';
import BaseClass from './BaseClass.js';

export default class RingLog extends BaseClass {
    constructor(arg) {
        super();
        const { defaultType } = config.RingLog;
        const ring = typeof arg !== "object" ? null : arg.ringId ? arg : arg.ring;
        if (!ring)
            throw new Error("Title expected by constructor")

        this.logTime = new Date();
        this.id = defaultType + ":" + this.logTime.getTime();
        this.ring = { ringId: ring.ringId, name: ring.name };
        return this;
    }

    // _propagateConnection(eventsThread) {
    //     // Propagate
    //     // this.<childs>.forEach(ch => ch.connectEventsThread(this._eventsThread));
    // }

    equals(t) { return this.id === t.id; }

    toString() { return `On Ring ${this.ring.name} since ${this.logTime.toLocaleDateString()}`; }

    render(children) {
        children = children || [];

        if (!(children instanceof Array))
            children = [children];

        // DIV ITEMS
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