import AppDriver from "./assets/AppDriver.js";
import Constellation from "./assets/Constellation.js";
import Ring from "./assets/Ring.js";
import Task from "./assets/Task.js";
const { log: cl } = console;

var storedData = Constellation.load();

if (storedData) {
    var App = new AppDriver(storedData);

} else {
    var App = new AppDriver(
        new Constellation({
            name: 'viaLactea',
            rings: [
                new Ring('day'),
                new Ring('week'),
                new Ring('month'),
                new Ring('year'),
                new Ring('lifetime')
            ]
        })
    );
    App.viaLactea.ring("lifetime")
        .addTask(new Task({ title: 'Get a plane', tags: ['Car Maintenance'] }))
        .addTask(new Task({ title: 'Buy new stove', tags: ['Car Maintenance'] }));
    App.viaLactea.ring("year")
        .addTask(new Task({ title: 'Build greenhouse', tags: ['Car Maintenance'] }))
        .addTask(new Task({ title: 'Sell car', tags: ['Car Maintenance'] }));
    App.viaLactea.ring("month")
        .addTask(new Task({ title: 'Repair kitchen', tags: ['Home', 'Workshop'] }))
        .addTask(new Task({ title: 'Get the dog vaccinated', tags: ['Pets'] }))
        .addTask(new Task({ title: 'Car service at 30.000', tags: ['Car Maintenance'] }));
    App.viaLactea.ring("week")
        .addTask(new Task({ title: 'Buy paint for cellar', tags: ['Home', 'Workshop'], metadata: { price: 18241.50, currency: "ARS", qty: 20, um: "L", umISO: "l" } }))
        .addTask(new Task({ title: 'Repaint cellar' }))
        .addTask(new Task({ title: 'Withdraw cash from ATM' }))
        .addTask(new Task({ title: 'Meeting with new Authorities', tags: ['Social'] }));


    var selectedTask = App.viaLactea.ring("year").tasks[0];
    App.viaLactea.moveTaskForward(selectedTask);
    App.viaLactea.moveTaskForward(selectedTask);
}

// Rendering to DOM
// UI
var el = document.getElementById("ringsMount");
// parent.render([...children])
el.appendChild(App.renderView());