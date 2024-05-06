/**
 * Component
 */

class Component {
	static #compIdxCount = 100000;
	static #compPool = new Map();

	static findByName(compName = "", objName = "") {
		return [...Component.#compPool.values()].find( (comp) => {
			const isObj = (objName) ? comp.gameObject?.name == objName : true;
			const isName = (compName) ? comp.name == compName : true;
			return isObj && isName;
		})
	}

	static findAllByName(compName = "", objName = "") {
		return [...Component.#compPool.values()].filter( (comp) => {
			const isObj = (objName) ? comp.gameObject?.name == objName : true;
			const isName = (compName) ? comp.name == compName : true;
			return isObj && isName;
		})
	}

	static findById(compId) {
		return Component.#compPool.get(compId);
	}

	#index = 0;
	#id = Component.#compIdxCount++;
	#ownedPools = [];

	constructor() {
		this.gameObject = undefined;
		this.index = 0;
		this.enable = true;
		Component.#compPool.set(this.#id, this);
	}

	get name() { return this.constructor.name; }
	get id() { return this.#id; }
	get index() { return this.#index; }
	set index(idx) {
		this.#index = idx;
		this.#ownedPools.forEach( (pool) => { pool.flagModified(); });
	}

	addEvent(eventName, callback) {
		const pool = ComponentPool.componentPoolList[eventName];
		if (pool) {
			pool.push(this);
			this.#ownedPools.push(pool);
			this[eventName] = callback.bind(this);
		} else {
			console.warn(`Cannot find ComponentPool ${eventName}`);
		}
	}

	destroy() {
		this.#ownedPools.forEach(pool => {pool.pop(this);})
		this.gameObject?.removeComponent(this.id);
	}
}