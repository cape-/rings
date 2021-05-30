import Task from './task.js';

function ConstellationSingleton(r) {
    this.rings = Array.from(r);
    return this;
};
ConstellationSingleton.prototype._getSelfNode = function() {
    if (!this.htmlNode) {
        this.htmlNode = document.createElement('div');
        this.htmlNode.classList.add('rings-constellation');
    }
    return this.htmlNode;
}
ConstellationSingleton.prototype._updateSelfNode = function(newNode) {
    var self = this._getSelfNode();
    if (self.parentNode)
    // If mounted
        self.parentNode.replaceChild(newNode, self);
    else
        this.htmlNode = newNode;
}
ConstellationSingleton.prototype.render = function(children) {
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
        const newTask = new Task(_title);
        var _ring = rtNewTaskRingSelect.value;
        this.ring(_ring).addTask(newTask);

        rtNewTaskTitleInput.value = "";
        this.ring(_ring).render();
        // TODO: IMPLEMENT
        // if (!rtNewTaskTitleInput.value)
        //     return;
        // this.addTask(newTask);
        // rt.getElementsByClassName('rings-ring-items')[0].innerHTML =
        //     this.render(children).getElementsByClassName('rings-ring-items')[0].innerHTML;
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
};
ConstellationSingleton.prototype.renderView = function() {
    var c = this;
    var ret =
        c.render(c.rings.map(r =>
            r.render(r.tasks.map(t =>
                t.render([
                    ...t.tags.map(u =>
                        u.render( /* Whatever should go inside Tags */ )),
                    ...t.ringLog.map(l =>
                        l.render( /* */ ))
                ])))));
    return ret;
};
ConstellationSingleton.prototype.toString = function() { return `The magnificent Constellation with ${this.rings.length} Rings` };
ConstellationSingleton.prototype.ring = function(ringNameOrId) { return this.rings.find(r => r.id === ringNameOrId || r.name === ringNameOrId) };
ConstellationSingleton.prototype.ringByTask = function(task) { return this.rings.find(r => r.tasks.findIndex(t => t.equals(task)) !== -1) };
ConstellationSingleton.prototype.moveTaskForward = function(task) {
    var rIdx = this.rings.findIndex(r => r.tasks.findIndex(t => t.equals(task)) !== -1);
    if (rIdx >= 1) {
        this.rings[rIdx].removeTask(t => t.equals(task));
        this.rings[rIdx - 1].addTask(task);
        return this.rings[rIdx - 1];
    } else if (rIdx === 0) {
        return this.rings[rIdx]
    }
    return rIdx;
};
ConstellationSingleton.prototype.moveTaskBackward = function(task) {
    var rIdx = this.rings.findIndex(r => r.tasks.findIndex(t => t.equals(task)) !== -1);
    if (rIdx < (this.rings.length - 1)) {
        this.rings[rIdx].removeTask(t => t.equals(task));
        this.rings[rIdx + 1].addTask(task);
        return this.rings[rIdx + 1];
    } else if (rIdx === 0) {
        return this.rings[rIdx]
    }
    return rIdx;
};

var _singleConstellation;

export default function Constellation(r) {
    if (!_singleConstellation)
        _singleConstellation = new ConstellationSingleton(r);
    return _singleConstellation;
};