import config from './config.js';

export default class BaseClass {
    constructor() {
        this.id = null;
        return this;
    }
    _getSelfNode() {
        if (!this.selfDomElement) {
            this.selfDomElement = document.createElement('div');
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

    /**
     * Emits an event over the EventsThread
     * @param {EventType} eventType Type of Event to emit
     * @param {Any} payload Payload to send
     */
    emit(eventType, payload) {
        this.eventsThread.dispatchEvent(new CustomEvent(config.Events._baseEvent, {
            detail: {
                eventType,
                payload
            }
        }));
    }

    /**
     * Subscribes a listener for an EventType
     * @param {EventType} eventType Type of Event to listen
     * @param {CallbackFunction} listener  
     */
    on(eventType, listener) {
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
                        .forEach(cb => cb.listener.apply(this, [firedPayload, firedEventType]));
                },
                callbackList: []
            };
            this.eventsThread.addEventListener(
                config.Events._baseEvent,
                this._eventsHandler.handler.bind(this)
            );
        }
        this._eventsHandler.callbackList.push({ eventType, listener });
    }

    /**
     * Connects the instance to the eventsThread 
     * @param {EventsThread} eventsThread 
     */
    connectEventsThread(eventsThread) {
        this.eventsThread = eventsThread;
        // Propagate
        this._propagateConnection(this.eventsThread);
    }

    // equals(t) { return this.id === t.id; }
    // toString() { return JSON.stringify(this); }
    // render(children) {}
};