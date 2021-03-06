export default {
    all: "*",
    _baseEvent: "Rings:data", // Alt.name: dataBaseEvent
    Task: {
        created: "Rings:data:Task.created",
        moved: "Rings:data:Task.moved",
        deleted: "Rings:data:Task.deleted"
    },
    Ring: {
        created: "Rings:data:Ring.created",
        moved: "Rings:data:Ring.moved",
        deleted: "Rings:data:Ring.deleted"
    },
    Tag: {
        created: "Rings:data:Tag.created",
        moved: "Rings:data:Tag.moved",
        deleted: "Rings:data:Tag.deleted"
    },
    RingLog: {
        created: "Rings:data:RingLog.created",
        moved: "Rings:data:RingLog.moved",
        deleted: "Rings:data:RingLog.deleted"
    }
};