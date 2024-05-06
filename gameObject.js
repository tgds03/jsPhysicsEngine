/**
 * GameObject
 */

class GameObject {
	static #objIdxCount = 100000;
	static #objPool = new Map();

	static findByName(name) {
		return [...GameObject.#objPool].filter( (obj) => {
			return (obj.name == name)
		});
	}
	static findById(objid) {
		return GameObject.#objPool.get(objid);
	}

	#componentContainer = new Map();
	#id = GameObject.#objIdxCount++;

	constructor(name="") {
		this.name = name;
		GameObject.#objPool.set(this.#id, this);
	}

	get id() { return this.#id; }

	addComponent(comp) {
		const compId = comp.id;
		if (!this.#componentContainer.has(compId)) {
			this.#componentContainer.set(compId, comp);
			comp.gameObject = this;
		} else {
			console.warn(`try to add exist component ${compId} in object ${this.id}`);
		}
	}

	removeComponent(compId) {
		this.#componentContainer.delete(compId);
	}
	getComponentById(compId) {
		return this.#componentContainer.get(compId);
	}
	getComponentByName(compName) {
		return [...this.#componentContainer.values()].find( (comp)=> {
			return comp.name == compName;
		});
	}
	getComponentsByName(compName) {
		return [...this.#componentContainer.values()].filter( (comp=>{
			return comp.name == compName;
		}));
	}
	destroy() {
		this.#componentContainer.forEach( comp=> { comp.destroy(); });
		GameObject.#objPool.delete(componentId);
	}
}