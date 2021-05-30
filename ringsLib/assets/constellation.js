import config from './config.js';
import Task from './task.js';

class ConstellationSingleton {
    constructor(r) {
        this.rings = Array.from(r);
        this.connectEventsThread(new EventTarget());
        return this;
    }
    _getSelfNode() {
        if (!this.selfDomElement) {
            this.selfDomElement = document.createElement('div');
            this.selfDomElement.classList.add('rings-constellation');
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
        this.rings.forEach(r => r.connectEventsThread(this.eventsThread));
    }
    renderView() {
        var c = this;
        var ret = c.render(c.rings.map(r => r.render(r.tasks.map(t => t.render([
            ...t.tags.map(u => u.render( /* Whatever should go inside Tags */ )),
            ...t.ringLog.map(l => l.render( /* */ ))
        ])))));
        return ret;
    }
    ring(ringNameOrId) { return this.rings.find(r => r.id === ringNameOrId || r.name === ringNameOrId); }
    ringByTask(task) { return this.rings.find(r => r.tasks.findIndex(t => t.equals(task)) !== -1); }
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
    toString() { return `The magnificent Constellation with ${this.rings.length} Rings`; }
    render(children) {
        children = children || this.rings.map(r => r.render()) || [];

        // DIV ITEMS
        if (!(children instanceof Array))
            children = [children];

        var rtDivItems = document.createElement('div');
        rtDivItems.classList.add('rings-items', 'rings-constellation-items');
        children.forEach(ch => rtDivItems.appendChild(ch));

        // NEW TASK BAR INPUT
        var rtNewTaskTitleInput = document.createElement('input');
        rtNewTaskTitleInput.type = "text";
        rtNewTaskTitleInput.placeholder = "Nueva tarea...";

        // NEW TASK BAR RING SELECT OPTIONS
        var rtNewTaskRingSelectOpts = this.rings.map(r => {
            var rt = document.createElement('option');
            rt.value = r.id;
            rt.textContent = r.name;
            return rt;
        });

        // NEW TASK BAR RING SELECT
        var rtNewTaskRingSelect = document.createElement('select');
        rtNewTaskRingSelectOpts.forEach(op => rtNewTaskRingSelect.appendChild(op));

        // NEW TASK BAR BUTTON
        var rtNewTaskBtnAdd = document.createElement('button');
        rtNewTaskBtnAdd.innerText = "+";
        rtNewTaskBtnAdd.onclick = function handleAddTask() {
            var _title = rtNewTaskTitleInput.value;
            if (!_title)
                return;
            const newTask = new Task(_title);
            var _ring = rtNewTaskRingSelect.value;
            this.ring(_ring).addTask(newTask);

            rtNewTaskTitleInput.value = "";
            this.ring(_ring).render();
            this.emit(config.Events.Task.created, newTask);
        }.bind(this);

        // DIV NEW TASK BAR
        var rtDivNewTaskBar = document.createElement('div');
        rtDivNewTaskBar.classList.add('rings-constellation-bar');
        rtDivNewTaskBar.appendChild(rtNewTaskTitleInput);
        rtDivNewTaskBar.appendChild(rtNewTaskRingSelect);
        rtDivNewTaskBar.appendChild(rtNewTaskBtnAdd);

        // ROOT
        var rt = document.createElement('div');
        rt.classList.add('rings-constellation');
        rt.textContent = this.toString();
        rt.appendChild(rtDivNewTaskBar);
        rt.appendChild(rtDivItems);

        this._updateSelfNode(rt);
        return this._getSelfNode();
    }
};

var _constellationInstance;

export default function Constellation(r) {
    if (!_constellationInstance)
        _constellationInstance = new ConstellationSingleton(r);
    return _constellationInstance;
};