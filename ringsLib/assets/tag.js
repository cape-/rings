import config from './config.js';

export default class Tag {
    constructor(title) {
        const { defaultType } = config.Tag;
        this.id = defaultType + ":" + title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '_');
        this.title = title;
        return this;
    }
    _getSelfNode() {
        if (!this.selfDomElement) {
            this.selfDomElement = document.createElement('div');
            this.selfDomElement.classList.add('rings-tag');
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
        this.eventsThread.dispatchEvent(new CustomEvent(config.Events._baseEvent, {
            detail: {
                eventType,
                payload
            }
        }));
    }
    on(eventType, callback) {
        if (!this.eventsThread)
            throw new Error('.eventsThread not connected!');
        if (!this._eventsHandler) {
            this._eventsHandler = {
                handler: function(e) {
                    var { eventType: firedEventType, payload: firedPayload } = e.detail;
                    // TODO: Remove
                    console.log(`${this.toString()}: EVENT RECEIVED ${JSON.stringify(e.detail)}`);
                    this._eventsHandler
                        .callbackList
                        .filter(cb => cb.eventType === config.Events.all || cb.eventType === firedEventType)
                        .forEach(cb => cb.callback.apply(this, [firedPayload, firedEventType]));
                },
                callbackList: []
            };
            this.eventsThread.addEventListener(
                config.Events._baseEvent,
                this._eventsHandler.handler.bind(this)
            );
        }
        this._eventsHandler.callbackList.push({ eventType, callback });
    }
    connectEventsThread(eventsThread) {
        this.eventsThread = eventsThread;
        // Propagate
        // this.<childs>.forEach(ch => ch.connectEventsThread(this.eventsThread));
    }
    equals(t) { return this.id === t.id; }
    toString() { return `Tag:${this.title}`; }
    render(children) {
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
    }
};