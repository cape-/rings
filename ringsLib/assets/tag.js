import config from './config.js';

export default function Tag(title) {
    const { defaultType } = config.Tag;
    this.id = defaultType + ":" + title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '_');
    this.title = title;
    return this;
};
Tag.prototype._getSelfNode = function() {
    if (!this.selfDomElement) {
        this.selfDomElement = document.createElement('div');
        this.selfDomElement.classList.add('rings-tag');
    }
    return this.selfDomElement;
};
Tag.prototype._updateSelfNode = function(newNode) {
    var self = this._getSelfNode();
    if (self.parentNode)
    // If mounted
        self.parentNode.replaceChild(newNode, self);
    else
        this.selfDomElement = newNode;
};
Tag.prototype.connectEventsThread = function(eventsThread) {
    this.eventsThread = eventsThread;
    // TODO: Remove dummy event listener
    this.eventsThread.addEventListener(config.Events.dataDefault, function(e) {
        console.log(`${this.toString()}: EVENT RECEIVED ${JSON.stringify(e.detail)}`);
    }.bind(this));
    // Propagate
    // this.<childs>.forEach(ch => ch.connectEventsThread(this.eventsThread));
};
Tag.prototype.render = function(children) {
    children = children || [];

    // DIV ITEMS
    if (!(children instanceof Array))
        children = [children];

    var rtDivItems = document.createElement('div');
    rtDivItems.classList.add('rings-items', 'rings-tag-items');
    children.forEach(ch => rtDivItems.appendChild(ch));

    // ROOT
    var rt = document.createElement('div');
    rt.classList.add('rings-tag');
    rt.textContent = this.toString();
    rt.appendChild(rtDivItems);

    this._updateSelfNode(rt);
    return this._getSelfNode();
};
Tag.prototype.toString = function() { return `Tag:${this.title}` };
Tag.prototype.equals = function(t) { return this.id === t.id };