/* abstract */
class UserStore {
	findUser(id) {}
	saveUser(id, userSocketID) {}
	findAllUsers() {}
}

class InMemoryUserStore extends UserStore {
	constructor() {
		super();
		this.users = new Map();
	}

	findUser(id) {
		return this.users.get(id);
	}

	saveUser(id, userSocketID) {
		this.users.set(id, userSocketID);
	}

	findAllUsers() {
		return [...this.users.values()];
	}
}

module.exports = {
	InMemoryUserStore,
};
