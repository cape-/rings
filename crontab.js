module.exports = [{
        "cronExp": "* * * * * *",
        "cronFunc": function() { console.log("Each second", arguments[0].toISOString(), (new Date()).toISOString()) }
    },
    {
        "cronExp": "* * * * * *",
        "cronFunc": createTask
    },
    {
        "cronExp": "*/3 * * * * *",
        "cronFunc": () => console.log("Every 3 seconds")
    },
    {
        "cronExp": "*/5 * * * * *",
        "cronFunc": () => console.log("Every 5 seconds")
    },
    {
        "cronExp": "*/7 * * * * *",
        "cronFunc": () => console.log("Every 7 seconds")
    },
]