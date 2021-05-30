import config from './config.js';
import Task from './task.js';

export default function Ring(name) {
    const { defaultType } = config.Ring;
    this.id = defaultType + ":" + name;
    this.name = name;
    this.tasks = [];
    return this;
};
Ring.prototype._getSelfNode = function() {
    if (!this.selfDomElement) {
        this.selfDomElement = document.createElement('div');
        this.selfDomElement.classList.add('rings-ring', this.toClassName());
    }
    return this.selfDomElement;
};
Ring.prototype._updateSelfNode = function(newNode) {
    var self = this._getSelfNode();
    if (self.parentNode)
    // If mounted replace it in the parent
        self.parentNode.replaceChild(newNode, self);
    this.selfDomElement = newNode;
};
Ring.prototype.emit = function(eventType, payload) {
    this.eventsThread.dispatchEvent(new CustomEvent(config.Events.dataDefault, {
        detail: {
            eventType,
            payload
        }
    }));
};
Ring.prototype.connectEventsThread = function(eventsThread) {
    this.eventsThread = eventsThread;
    // TODO: Remove dummy event listener
    this.eventsThread.addEventListener(config.Events.dataDefault, function(e) {
        console.log(`${this.toString()}: EVENT RECEIVED ${JSON.stringify(e.detail)}`);
    }.bind(this));
    // Propagate
    this.tasks.forEach(t => t.connectEventsThread(this.eventsThread));
};
Ring.prototype.render = function(children) {
    children = children || this.tasks.map(t => t.render()) || [];
    // DIV HEAD > SPAN (title)
    var rtSpanTitle = document.createElement('span');
    rtSpanTitle.textContent = this.toString();
    // // DIV HEAD > SPAN (divider)
    // var rtSpanDivider = document.createElement('span');
    // rtSpanDivider.innerHTML = "&nbsp;";
    // // DIV HEAD > INPUT
    // var rtNewTitleInput = document.createElement('input');
    // rtNewTitleInput.type = "text";
    // rtNewTitleInput.placeholder = "Nueva tarea...";
    // // DIV HEAD > BUTTON
    // var rtBtnAdd = document.createElement('button');
    // rtBtnAdd.innerText = "+";
    // rtBtnAdd.onclick = function handleAddTask() {
    //     if (!rtNewTitleInput.value)
    //         return;
    //     const newTask = new Task(rtNewTitleInput.value);
    //     rtNewTitleInput.value = "";
    //     this.addTask(newTask);
    //     children.push(newTask.render());
    //     rt.getElementsByClassName('rings-ring-items')[0].innerHTML =
    //         this.render(children).getElementsByClassName('rings-ring-items')[0].innerHTML;
    // }.bind(this);

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
    // rtDivHead.appendChild(rtSpanDivider);
    // rtDivHead.appendChild(rtNewTitleInput);
    // rtDivHead.appendChild(rtBtnAdd);
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
};
Ring.prototype.toString = function() { return `The ${this.name} Ring` };
Ring.prototype.toClassName = function() {
    return this.name
        .normalize("NFD")
        .toLowerCase()
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s/g, "-")
};
Ring.prototype.equals = function(r) { return this.id === r.id };
/**
 * Returns the Task from this ring.
 * @param {Task} taskId The Id of the Task to be retrieved
 * @returns {Task} The desired Task or Null
 */
Ring.prototype.task = function(tId) {
    const found = this.tasks.find(t => t.equals({ id: tId }));
    return found === -1 ? null : found;
};
/**
 * Adds a Task to this ring.
 * @param {Task} task A Task to be added
 * @returns self
 */
Ring.prototype.addTask = function(t) {
    if (!t instanceof Task)
        throw TypeError("Task expected.");
    // if (t.done)
    //     throw TypeError("Done task not expected.");
    this.tasks.push(t);
    t.logRing(this);
    return this;
};
/**
 * Removes a Task from this ring.
 * @param {Task} task The Task to be removed
 * @returns self
 */
Ring.prototype.removeTask = function(cb) {
    const tIdx = this.tasks.findIndex(cb);
    if (tIdx !== -1)
        this.tasks.splice(tIdx, 1);
    return this;
};