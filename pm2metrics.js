const io = require("@pm2/io");
const pm2Metrics = {
    liveBots: io.counter({
        name: 'Live Bots',
        id: 'liveBots',
    }),
    messagesReceived: io.counter({
        name: 'Messages Received',
        id: 'messagesReceived',
    }),
    actionsPerformed: io.counter({
        name: 'Actions Performed',
        id: 'actionsPerformed',
    }),
    errors: io.counter({
        name: 'Errors',
        id: 'errors',
    }),
    commandsLoaded: io.counter({
        name: 'Commands Loaded',
        id: 'commandsLoaded',

    }),
    commandsErrored: io.counter({
        name: 'Commands Errored',
        id: 'commandsErrored',
    }),
    eventsLoaded: io.counter({
        name: 'Events Loaded',
        id: 'eventsLoaded',
    }),
    eventsErrored: io.counter({
        name: 'Events Errored',
        id: 'eventsErrored',
    }),
}

module.exports = pm2Metrics;