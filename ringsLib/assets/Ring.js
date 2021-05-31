import config from './config.js';
import BaseClass from './BaseClass.js';
import Task from './Task.js';

export default class Ring extends BaseClass {
    constructor(name) {
        const { defaultType } = config.Ring;
        super();
        this.id = defaultType + ":" + name;
        this.name = name;
        this.tasks = [];
        return this;
    }

    _propagateConnection(eventsThread) {
        this.tasks.forEach(t => t.connectEventsThread(eventsThread));
    }

    toClassName() {
        return this.name
            .normalize("NFD")
            .toLowerCase()
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s/g, "-");
    }

    /**
     * Returns the Task from this ring.
     * @param {Task} taskId The Id of the Task to be retrieved
     * @returns {Task} The desired Task or Null
     */
    task(tId) {
        const found = this.tasks.find(t => t.equals({ id: tId }));
        return found === -1 ? null : found;
    }

    /**
     * Adds a Task to this ring.
     * @param {Task} task A Task to be added
     * @returns self
     */
    addTask(t) {
        if (!t instanceof Task)
            throw TypeError("Task expected.");
        // TODO: Define
        // if (t.done)
        //     throw TypeError("Done task not expected.");
        this.tasks.push(t);
        t.logRing(this);
        return this;
    }

    /**
     * Removes a Task from this ring.
     * @param {Task} task The Task to be removed
     * @returns self
     */
    removeTask(cb) {
        const tIdx = this.tasks.findIndex(cb);
        if (tIdx !== -1)
            this.tasks.splice(tIdx, 1);
        return this;
    }

    equals(r) { return this.id === r.id; }

    toString() { return `The ${this.name} Ring`; }

    render(children) {
        children = children || this.tasks.map(t => t.render()) || [];

        // DIV HEAD > SPAN (title)
        var rtSpanTitle = document.createElement('span');
        rtSpanTitle.textContent = this.toString();

        // ITEM CONTAINERS
        if (!(children instanceof Array))
            children = [children];

        var itemContainers = children.map(ch => {
            var itemContainer = document.createElement('div');
            itemContainer.appendChild(ch);
            itemContainer.classList.add('rings-ring-item-container');
            return itemContainer;
        });

        // DIV HEAD
        var rtDivHead = document.createElement('div');
        rtDivHead.classList.add('rings-ring-head');
        rtDivHead.appendChild(rtSpanTitle);

        // DIV ITEMS
        var rtDivItems = document.createElement('div');
        rtDivItems.classList.add('rings-items', 'rings-ring-items');
        itemContainers.forEach(ic => rtDivItems.appendChild(ic));

        // ROOT
        var rt = document.createElement('div');
        rt.classList.add('rings-ring', this.toClassName());
        rt.appendChild(rtDivHead);
        rt.appendChild(rtDivItems);

        this._updateSelfNode(rt);
        return this._getSelfNode();
    }
};