/**
 * ComponentPool
 */

class ComponentPool {
	static componentPoolList = {};
	#name = '';
	#componentPool = [];
	#componentPoolModified = false;

	constructor(poolName) {
		this.#name = poolName;
		ComponentPool.componentPoolList[poolName] = this;
	}

	flagModified() { this.#componentPoolModified = true; }

	push(comp) {
		this.#componentPool.push(comp);
		this.flagModified();
	}

	pop(comp) {
		const idx = this.#componentPool.findIndex( e => {comp.id == e.id});
		if (idx >= 0) this.#componentPool.splice(idx, 1);
	}

	execute(...arg) {
		if(this.#componentPoolModified) {
			this.#componentPool.sort( (compA, compB) => compA.zindex - compB.zindex );
			this.#componentPoolModified = false;
		}
		this.#componentPool.forEach( comp => {
			if (comp.enable) {
				if (this.#name in comp)
					comp[this.#name](...arg);
			}
		})
	}
}