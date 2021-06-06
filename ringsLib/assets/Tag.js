import config from './config.js';
import BaseClass from './BaseClass.js';

export default class Tag extends BaseClass {
    constructor(title) {
        const { defaultType } = config.Tag;
        super();
        this.id = defaultType + ":" +
            title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s/g, '_');
        this.title = title;
        return this;
    }

    _propagateConnection(eventsThread) {
        // Propagate
        // this.<childs>.forEach(ch => ch.connectEventsThread(this._eventsThread));
    }

    equals(t) { return this.id === t.id; }

    toString() { return `Tag:${this.title}`; }

    render(children) {
        children = children || [];

        if (!(children instanceof Array))
            children = [children];

        // DIV ITEMS
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