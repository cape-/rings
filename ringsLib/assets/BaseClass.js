import Events from './events.js';

export default class BaseClass {
    constructor() {
        this.id = null;
        return this;
    }

    /**
     * Factory method to be used after JSON.parse to instantiate the class
     * @param {Object} obj The object containing raw data
     * @returns 
     */
    static from(obj) {
        var rt = new this(obj);
        var rtKeys = Object.keys(rt).sort();
        var objKeys = Object.keys(obj).sort();
        if (rtKeys.length !== objKeys.length ||
            rtKeys.join() !== objKeys.join())
            throw new Error('Unacceptable or incomplete object for recovery')

        rtKeys.forEach(k => rt[k] = obj[k]);
        return rt;
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
        this.eventsThread.dispatchEvent(new CustomEvent(Events._baseEvent, {
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
                        .filter(cb => cb.eventType === Events.all || cb.eventType === firedEventType)
                        .forEach(cb => cb.listener.apply(this, [firedPayload, firedEventType]));
                },
                callbackList: []
            };
            this.eventsThread.addEventListener(
                Events._baseEvent,
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