module.exports = [{
        "cronExp": "* * * * * *",
        "cronFunc": function() { console.log("This job runs every second since", arguments[0].toLocaleString(),
        ". Now is" (new Date()).toLocaleString()) }
    },
    {
        "cronExp": "* * * * * *",
        "cronFunc": createTask
    },
    {
        "cronExp": "*/3 * * * * *",
        "cronFunc": () => console.log("This job runs every THREE seconds")
    },
    {
        "cronExp": "*/5 * * * * *",
        "cronFunc": () => console.log("This job runs every FIVE seconds")
    },
    {
        "cronExp": "*/7 * * * * *",
        "cronFunc": () => console.log("This job runs every SEVEN seconds")
    },
]