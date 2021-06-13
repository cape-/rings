import Events from './events.js';

export default class BaseClass {
    /**
     * @constructor BaseClass
     */
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
        var rtKeys = Object.keys(rt.toJSON()).sort();
        var objKeys = Object.keys(obj).sort();
        if (rtKeys.length !== objKeys.length ||
            rtKeys.join() !== objKeys.join())
            throw new Error('Unacceptable or incomplete object for recovery' +
                '. Expected keys: ' +
                rtKeys.join() +
                '. Received keys: ' +
                objKeys.join());

        return rt;
    }

    /**
     * @returns The DOM element corresponding to `this` object
     */
    _getSelfNode() {
        if (!this._selfDomElement) {
            this._selfDomElement = document.createElement('div');
        }
        return this._selfDomElement;
    }

    /**
     * Updates the DOM element to which `this` object points to
     * @param {*} newNode The new DOM element
     */
    _updateSelfNode(newNode) {
        var self = this._getSelfNode();
        if (self.parentNode)
        // If mounted replace it in the parent
            self.parentNode.replaceChild(newNode, self);
        this._selfDomElement = newNode;
    }

    /**
     * Emits an event over the EventsThread
     * @param {EventType} eventType Type of Event to emit
     * @param {Any} payload Payload to send
     */
    emit(eventType, payload) {
        this._eventsThread.dispatchEvent(new CustomEvent(Events._baseEvent, {
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
        if (!this._eventsThread)
            throw new Error('._eventsThread not connected!');
        if (!this._eventsHandler) {
            this._eventsHandler = {
                handler: function(e) {
                    var { eventType: firedEventType, payload: firedPayload } = e.detail;
                    this._eventsHandler
                        .callbackList
                        .filter(cb => cb.eventType === Events.all || cb.eventType === firedEventType)
                        .forEach(cb => cb.listener.apply(this, [firedPayload, firedEventType]));
                },
                callbackList: []
            };
            this._eventsThread.addEventListener(
                Events._baseEvent,
                this._eventsHandler.handler.bind(this)
            );
        }
        this._eventsHandler.callbackList.push({ eventType, listener });
    }

    /**
     * JSON.stringify hook implementation
     * @returns object to JSON-stringify
     */
    toJSON() {
        // For storage: remove runtime properties (_*)
        var _tmp = {...this };
        Object.keys(_tmp)
            .filter(k => k[0] === '_')
            .forEach(k => delete _tmp[k]);
        return _tmp
    }

    /**
     * Connects the instance to the eventsThread 
     * @param {EventsThread} eventsThread 
     */
    connectEventsThread(eventsThread) {
        this._eventsThread = eventsThread;
        // Propagate
        if (this._propagateConnection &&
            typeof this._propagateConnection === "function")
            this._propagateConnection(this._eventsThread);
    }

    // equals(t) { return this.id === t.id; }
    // toString() { return JSON.stringify(this); }
    // render(children) {}
};