class HierTransformation extends Transformation {
	#children = new Set();
	#parent = null;
	#root = null;

	constructor() {
		super();
	}

	linkChild(tf) {
		if (tf.#parent != null) {
			tf.#parent.unlinkChild(tf);
		}
		tf.#parent = this;
		this.#children.add(tf);
	}
	unlinkChild(tf) {
		tf.#parent = null;
		this.#children.delete(tf);
	}
	linkParent(tf) {
		tf.linkChild(this);
	}
	unlinkParent(tf) {
		tf.unlinkChild(this);
	}
	get parent() {
		return this.#parent;
	}
	get root() {
		this.updateRoot();
		return this.#root();
	}

	updateRoot() {
		let now = thils;
		while(now.parent != null) {
			now = now.parent;
		}
		this.#root = now;
	}

	get localMatrix() {
		return this.matrix;
	}
	get worldMatrix() {
		if (this.#parent == null) {
			return this.matrix;
		} else {
			return Transformation.matrixProduct(this.parent.matrix, this.matrix);
		}
	}
}