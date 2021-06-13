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
        const { defaultType } = config.Constellation;
        this.id = defaultType + ":" + name;
        this.name = name.toString();
        this.rings = Array.from(rings);
        this.connectEventsThread(new EventTarget());
        this.on(Events.all, function(e, f) {
            // console.log("on() handler reached with payload: ", e, f);
            this.save()
        });
        this.on(Events.Task.created, function(e) { console.log("onTaskCreated() handler reached with payload: ", e) }); // TODO: Remove
        return this;
    }

    static fromJSON(str) {
        return JSON.parse(str, (key, val) => {
            if (val && val.id)
                switch (val.id.split(":")[0]) {
                    case config.Constellation.defaultType:
                        return Constellation.from(val);

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
            // Remove it from Ring N and add it to Ring (N-1)
            var removedTask = this.rings[rIdx].removeTask(t => t.equals(task));
            if (removedTask !== -1) {
                this.rings[rIdx - 1].addTask(removedTask);
                return this.rings[rIdx - 1];
            }
        } else if (rIdx === 0) {
            // If it is already in the first ring, leave it there
            return this.rings[rIdx];
        }
        // Not found?
        return rIdx;
    }

    moveTaskBackward(task) {
        var rIdx = this.rings.findIndex(r => r.tasks.findIndex(t => t.equals(task)) !== -1);
        if (rIdx >= 0 && rIdx < (this.rings.length - 1)) {
            // Remove it from Ring N and add it to Ring (N+1)
            var removedTask = this.rings[rIdx].removeTask(t => t.equals(task));
            if (removedTask !== -1) {
                this.rings[rIdx + 1].addTask(removedTask);
                return this.rings[rIdx + 1];
            }
        } else if (rIdx === (this.rings.length - 1)) {
            // If it is in the last ring, leave it there
            return this.rings[rIdx];
        }
        // Not found?
        return rIdx;
    }

    save() { // Could be perfectly extracted to BaseClass. Does it help somehow?
        console.log("save()d");
        localStorage.setItem(config.App.defaultStorageItem, JSON.stringify(this));
    }

    static load() {
        var storedConstellationJson = localStorage.getItem(config.App.defaultStorageItem);
        if (storedConstellationJson)
            return Constellation.fromJSON(storedConstellationJson);
        return null;
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