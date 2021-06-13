import Constellation from './Constellation.js';
import Events from './events.js';
import Task from './Task.js';

var _constellationInstance;
export default class AppDriver { // extends Constellation {
    constructor(constellationInstance) {
        if (!_constellationInstance) {
            if (!constellationInstance || !(constellationInstance instanceof Constellation))
                throw new TypeError("Constellation expected.")
            _constellationInstance = constellationInstance;
        }
        Object.defineProperty(this, constellationInstance.name || "constellation", {
            enumerable: true,
            configurable: false,
            writable: false,
            value: _constellationInstance
        })
        return this;
    }

    get constellation() {
        // Helper get constellation
        return _constellationInstance;
    }

    render(constellationElement) {
        constellationElement = constellationElement || this.constellation.render();

        // NEW TASK BAR RING SELECT OPTIONSrings.map(r => r
        var rtNewTaskRingSelectOpts = this.constellation.rings.map(r => {
            var rt = document.createElement('option');
            rt.value = r.id;
            rt.textContent = r.name;
            return rt;
        });

        // NEW TASK BAR RING SELECT
        var rtNewTaskRingSelect = document.createElement('select');
        rtNewTaskRingSelectOpts.forEach(op => rtNewTaskRingSelect.appendChild(op));

        // NEW TASK BAR INPUT
        var rtNewTaskTitleInput = document.createElement('input');
        rtNewTaskTitleInput.type = "text";
        rtNewTaskTitleInput.placeholder = "Nueva tarea...";
        rtNewTaskTitleInput.onkeyup = function(e) {
            if (e.code == 'Enter')
                rtNewTaskBtnAdd.click();
        }

        // NEW TASK BAR BUTTON
        var rtNewTaskBtnAdd = document.createElement('button');
        rtNewTaskBtnAdd.innerText = "Add";
        rtNewTaskBtnAdd.onclick = function handleAddTask() {
            var _title = rtNewTaskTitleInput.value;
            if (!_title)
                return;
            var _ring = rtNewTaskRingSelect.value;
            if (!_ring)
                return;
            const newTask = new Task(_title);
            this.constellation.ring(_ring).addTask(newTask);

            rtNewTaskTitleInput.value = "";
            this.constellation.ring(_ring).render();
            this.constellation.emit(Events.Task.created, newTask);
        }.bind(this);

        // DIV NEW TASK BAR
        var rtDivNewTaskBar = document.createElement('bar');
        rtDivNewTaskBar.classList.add('rings-app-bar');
        rtDivNewTaskBar.appendChild(rtNewTaskRingSelect);
        rtDivNewTaskBar.appendChild(rtNewTaskTitleInput);
        rtDivNewTaskBar.appendChild(rtNewTaskBtnAdd);


        // ROOT
        var rt = document.createElement('div');
        rt.classList.add('rings-app');
        rt.appendChild(rtDivNewTaskBar);
        rt.appendChild(constellationElement);

        return rt;
    }

    renderView() {
        // App main render algorithm
        var c = this.constellation;
        var ret =
            this.render(
                c.render(c.rings.map(r =>
                    r.render(r.tasks.map(t =>
                        t.render([
                            ...t.tags.map(u =>
                                u.render( /* Whatever should go inside Tags */ )
                            ),
                            ...t.ringLog.map(l =>
                                l.render( /* */ )
                            )
                        ])
                    ))
                ))
            );
        return ret;
    }


};