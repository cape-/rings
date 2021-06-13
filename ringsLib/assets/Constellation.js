import Events from './events.js';
import config from './config.js';

import BaseClass from './BaseClass.js';
import Ring from './Ring.js';
import Task from './Task.js';
import Tag from './Tag.js';
import RingLog from './RingLog.js';

export default class Constellation extends BaseClass {
    constructor({ name, rings }) {
        super();
        this.name = name.toString();
        this.rings = Array.from(rings);
        this.connectEventsThread(new EventTarget());
        this.on(Events.all, function(e, f) { console.log("on() handler reached with payload: ", e, f) }); // TODO: Remove
        this.on(Events.Task.created, function(e) { console.log("onTaskCreated() handler reached with payload: ", e) }); // TODO: Remove
        return this;
    }

    static fromJSON(str) {
        return JSON.parse(str, (key, val) => {
            if (val && val.id)
                switch (val.id.split(":")[0]) {
                    case config.Ring.defaultType:
                        return Ring.from(val);

                    case config.Task.defaultType:
                        return Task.from(val);

                    case config.Tag.defaultType:
                        return Tag.from(val);

                    case config.RingLog.defaultType:
                        return RingLog.from(val);

                    default:
                        throw new Error(`in Reviver: detected unexpected object in JSON: ${JSON.stringify(val)}`);
                }
            else
                return val;
        })
    }

    _propagateConnection(eventsThread) {
        this.rings.forEach(r => r.connectEventsThread(eventsThread));
    }

    ring(ringNameOrId) {
        return this.rings.find(r => r.id === ringNameOrId || r.name === ringNameOrId);
    }

    ringByTask(task) {
        return this.rings.find(r => r.tasks.findIndex(t => t.equals(task)) !== -1);
    }

    moveTaskForward(task) {
        var rIdx = this.rings.findIndex(r => r.tasks.findIndex(t => t.equals(task)) !== -1);
        if (rIdx >= 1) {
            this.rings[rIdx].removeTask(t => t.equals(task));
            this.rings[rIdx - 1].addTask(task);
                return this.rings[rIdx - 1];
        } else if (rIdx === 0) {
            return this.rings[rIdx];
        }
        return rIdx;
    }

    moveTaskBackward(task) {
        var rIdx = this.rings.findIndex(r => r.tasks.findIndex(t => t.equals(task)) !== -1);
        if (rIdx < (this.rings.length - 1)) {
            this.rings[rIdx].removeTask(t => t.equals(task));
            this.rings[rIdx + 1].addTask(task);
                return this.rings[rIdx + 1];
        } else if (rIdx === 0) {
            return this.rings[rIdx];
        }
        return rIdx;
    }

    equals() { return false; }

    toString() { return `The ${this.name} Constellation with ${this.rings.length} Rings`; }

    render(children) {
        children = children || this.rings.map(r => r.render()) || [];

        if (!(children instanceof Array))
            children = [children];

        // H1 TITLE
        var rtH1Title = document.createElement('h1');
        rtH1Title.textContent = this.toString();

        // DIV ITEMS
        var rtDivItems = document.createElement('div');
        rtDivItems.classList.add('rings-items', 'rings-constellation-items');
        children.forEach(ch => rtDivItems.appendChild(ch));

        // ROOT
        var rt = document.createElement('div');
        rt.classList.add('rings-constellation');
        rt.appendChild(rtH1Title);
        rt.appendChild(rtDivItems);

        this._updateSelfNode(rt);
        return this._getSelfNode();
    }
};