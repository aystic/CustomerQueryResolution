/* abstract */
class SessionStore {
	findSession(id) {}
	saveSession(id, session) {}
	findAllSessions() {}
}

class InMemorySessionStore extends SessionStore {
	constructor() {
		super();
		this.sessions = new Map();
	}

	findSession(id) {
		return this.sessions.get(id);
	}

	saveSession(id, session) {
		this.sessions.set(id, session);
	}

	findAllSessions() {
		let allSessions = [];
		for (const key of this.sessions.keys()) {
			allSessions.push({ chatID: key, data: this.findSession(key) });
		}
		return allSessions;
	}
}

module.exports = {
	InMemorySessionStore,
};
