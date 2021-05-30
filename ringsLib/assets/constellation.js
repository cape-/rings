function ConstellationSingleton(r) {
    this.rings = Array.from(r);
    return this;
};
ConstellationSingleton.prototype.getSelfNode = function() {
    if (!this.htmlNode) {
        this.htmlNode = document.createElement('div');
        this.htmlNode.classList.add('rings-constellation');
    }
    return this.htmlNode;
}
ConstellationSingleton.prototype.updateSelfNode = function(newNode) {
    var self = this.getSelfNode();
    if (self.parentNode)
        self.parentNode.replaceChild(newNode, self);
    else
        this.htmlNode = newNode;
}
ConstellationSingleton.prototype.render = function(children = []) {
    var rt = document.createElement('div');
    rt.classList.add('rings-constellation');
    rt.textContent = this.toString();
    if (children instanceof Array)
        children.forEach(c => rt.appendChild(c));
    else
        rt.appendChild(children)

    this.updateSelfNode(rt);
    return this.getSelfNode();
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
ConstellationSingleton.prototype.ring = function(ringName) { return this.rings.find(r => r.name === ringName) };
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