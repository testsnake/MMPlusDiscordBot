// logManager.js
let lastLogs = [];

function splitIntoChunks(str, maxLength) {
    const chunks = [];
    let start = 0;

    while (start < str.length) {
        chunks.push(str.slice(start, start + maxLength));
        start += maxLength;
    }

    return chunks;
}

function addLog(log) {
    if (lastLogs.length >= 100) {
        lastLogs.shift(); // Remove the oldest log (first item in the array)
    }

    lastLogs.push(log); // Add the new log to the array
}

function getLogs() {
    return lastLogs.flatMap(log => splitIntoChunks(log, 1900));
}

function getRecentLogs(count) {
    const recentLogs = lastLogs.slice(-count);
    return recentLogs.flatMap(log => splitIntoChunks(log, 1900));
}

module.exports = {
    addLog,
    getLogs,
    getRecentLogs,
};
