/* abstract */
class AgentStore {
	findAgent(id) {}
	saveAgent(id, agentSocketID) {}
	findAllAgents() {}
}

class InMemoryAgentStore extends AgentStore {
	constructor() {
		super();
		this.agents = new Map();
	}

	findAgent(id) {
		return this.agents.get(id);
	}

	saveAgent(id, agentSocketID) {
		this.agents.set(id, agentSocketID);
	}

	findAllAgents() {
		return [...this.agents.values()];
	}
}

module.exports = {
	InMemoryAgentStore,
};
