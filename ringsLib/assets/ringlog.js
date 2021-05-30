import config from './config.js';

export default class RingLog {
    constructor(r) {
        const { defaultType } = config.RingLog;
        this.logTime = new Date();
        this.id = defaultType + ":" + this.logTime.getTime();
        this.ring = { id: r.id, name: r.name };
        return this;
    }
    _getSelfNode() {
        if (!this.selfDomElement) {
            this.selfDomElement = document.createElement('div');
            this.selfDomElement.classList.add('rings-ringlog');
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