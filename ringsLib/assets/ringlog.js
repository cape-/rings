import config from './config.js';

export default function RingLog(r) {
    const { defaultType } = config.ringLog;
    this.logTime = new Date();
    this.id = defaultType + ":" + this.logTime.getTime();
    this.ring = { id: r.id, name: r.name };
    return this;
}
RingLog.prototype.render = function(children = []) {
    var rt = document.createElement('div');
    rt.classList.add('rings-ringlog');
    rt.textContent = this.toString();
    if (children instanceof Array)
        children.forEach(c => rt.appendChild(c));
    else
        rt.appendChild(children)
    return rt;
};
RingLog.prototype.toString = function() { return `Ring ${this.ring.name} at ${this.logTime.toISOString()}` };
RingLog.prototype.equals = function(t) { return this.id === t.id };