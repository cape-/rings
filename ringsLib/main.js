import Constellation from "./assets/Constellation.js";
import Ring from "./assets/Ring.js";
import Task from "./assets/Task.js";
const { log: cl } = console;

var viaLactea = new Constellation('Alfa Centauri', [
    new Ring('day'),
    new Ring('week'),
    new Ring('month'),
    new Ring('year'),
    new Ring('lifetime')
]);
viaLactea.ring("lifetime")
    .addTask(new Task({ title: 'Get a plane', tags: ['Car Maintenance'] }))
    .addTask(new Task({ title: 'Buy new stove', tags: ['Car Maintenance'] }));
viaLactea.ring("year")
    .addTask(new Task({ title: 'Build greenhouse', tags: ['Car Maintenance'] }))
    .addTask(new Task({ title: 'Sell car', tags: ['Car Maintenance'] }));
viaLactea.ring("month")
    .addTask(new Task({ title: 'Repair kitchen', tags: ['Home', 'Workshop'] }))
    .addTask(new Task({ title: 'Get the dog vaccinated', tags: ['Pets'] }))
    .addTask(new Task({ title: 'Car service at 30.000', tags: ['Car Maintenance'] }));
viaLactea.ring("week")
    .addTask(new Task({ title: 'Buy paint for cellar', tags: ['Home', 'Workshop'], metadata: { price: 18241.50, currency: "ARS", qty: 20, um: "L", umISO: "l" } }))
    .addTask(new Task({ title: 'Repaint cellar' }))
    .addTask(new Task({ title: 'Withdraw cash from ATM' }))
    .addTask(new Task({ title: 'Meeting with new Authorities', tags: ['Social'] }));


var recoveredJSONObject = {
    id: 'asereje',
    creationDate: 19879854133,
    title: '12.345',
    tags: [],
    metadata: { foo: "bar" },
    ringLog: [],
    done: true
};
viaLactea.ring('day')
    .addTask(Task.from(recoveredJSONObject));

// var recoveredJSONObject = {
//     id: 'anillito',
//     name: 'El del Capitán Beto',
//     tasks: []
// };
// console.log(recoveredJSONObject);
// console.log(Ring.from(recoveredJSONObject));

// UI
var v = viaLactea // For the sake of clarity
var el = document.getElementById("ringsMount");
// parent.render([...children])
el.appendChild(v.renderView());