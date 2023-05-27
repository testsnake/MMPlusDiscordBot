class KickRequests {
    constructor() {
        this.requests = new Map();
    }

    addRequest(user, executor) {
        const existingRequest = this.requests.get(user.id);

        if (existingRequest && existingRequest.executor.id !== executor.id) {
            this.requests.delete(user.id);
            return true;
        }

        this.requests.set(user.id, { user, executor, timestamp: Date.now() });
        return false;
    }

    clearExpiredRequests() {
        const now = Date.now();

        for (const [key, request] of this.requests.entries()) {
            if (now - request.timestamp > 1000 * 60 * 5) { // 5 minutes expiration time
                this.requests.delete(key);
            }
        }
    }
}

module.exports = new KickRequests();
