import Constellation from "./assets/constellation.js";
import Ring from "./assets/ring.js";
import Task from "./assets/task.js";
const { log: cl } = console;

var viaLactea = new Constellation([
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

// var t1 = new Task('Comprar comida para perro');
// var t2 = new Task({ title: 'Arreglar palo de amasar', tags: ['Taller', 'Carpintería'] });
// t2.setDone();
// var t3 = new Task({ title: 'Comprar sarula', tags: ['Insumos de la Casa'] });

// cl('me.ring("month")', me.ring("month"));
// cl('me.ringByTask(t2)', me.ringByTask(t2));
// cl('========== ME I  ', JSON.parse(JSON.stringify(viaLactea)));
// viaLactea.moveTaskForward(t1);
// viaLactea.moveTaskBackward(t2);
// cl('========== ME II  ', JSON.parse(JSON.stringify(viaLactea)));

// UI
var v = viaLactea // For the sake of clarity
var el = document.getElementById("ringsMount");
// parent.render([...children])
el.appendChild(v.renderView());