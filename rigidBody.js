class RigidBody extends Component {
	static resolveCollisionPool = new ComponentPool("ResolveCollision");
	static computePhysicsPool = new ComponentPool("ComputePhysics");

	#shape = undefined;
	#collision = undefined;
	#transformation = undefined;

	// material
	#invMass = NaN;
	#invInertia = NaN;
	#density = NaN;
	restitution = NaN;
	gravity = new Vector2D(0, 0);
	staticFriction = 0;
	dynamicFriction = 0;

	get invMass() { return this.#invMass; }
	get invInertia() { return this.#invInertia; }
	get density() { return this.#density; }
	set density(d) { this.#density = d; this.#updateMaterial(); }

	// linear movement
	get position() { return this.#transformation.position; }
	set position(pos) { this.#transformation.position = pos; }
	velocity = new Vector2D(0, 0);
	accelation = new Vector2D(0, 0);
	#resultForce = new Vector2D(0, 0);
	#resultImpulse = new Vector2D(0, 0);

	// angular movement
	get rotation() { return this.#transformation.rotation; }
	set rotation(radian) { this.#transformation.rotation = radian; }
	angularVelocity = 0;
	torque = 0;
	#resultTorque = 0;
	#resultAngularImpulse = 0;

	isStatic = false;

	constructor(collision, posComp, density = 1, restitution = 1) {
		super();
		this.#transformation = posComp;
		this.#density = density;
		this.checkList = new Map();
		this.restitution = restitution;
		this.setCollisionComp(collision);
		this.addEvent('ResolveCollision', this.resolveCollision);
		this.addEvent('ComputePhysics', this.#compute);
	}

	setCollisionComp(collision) {
		this.#collision = collision;
		this.#shape = collision.shape;
		this.#updateMaterial();
	}

	setCollisionCheck(otherRigidBody) {
		if (!this.checkList.has(otherRigidBody)) {
			this.checkList.set(otherRigidBody.collision, otherRigidBody);
			this.collision.setCheck(otherRigidBody.collision);
		}
		if (!otherRigidBody.checkList.has(this)) {
			otherRigidBody.checkList.set(this.collision, this);
			otherRigidBody.collision.setCheck(this.collision);
		}
	}

	#updateMaterial() {
		const mass = this.#shape.area * this.density;
		this.#invMass = 1 / mass;
		this.#invInertia = 1 / this.#shape.inertia(mass);
	}

	get shape() { return this.#shape; }
	get collision() { return this.#collision; }
	get massCenter() { return this.shape.massCenter; }

	resolveCollision(deltaTime) {
		const collisionEventList = this.collision.collisionEventList;

		this.#resultForce = Vector2D.zero;
		this.#resultTorque = 0;
		this.#resultImpulse = Vector2D.zero;
		this.#resultAngularImpulse = 0;

		// calculate friction

		collisionEventList.forEach( event => {
			if (!this.checkList.has(event.otherCollision)) return;
			if (!this.invMass) return;

			const other = this.checkList.get(event.otherCollision);
			const rlVelocity = Vector2D.sub(other.velocity, this.velocity);
			const normal = event.collisionNormal;
			const dot = Vector2D.dot(rlVelocity, normal);
			const frictionNormal = Vector2D.sub(rlVelocity, normal.scaled(dot)).normalized

			let frictionScalar = -Vector2D.dot(rlVelocity, frictionNormal);
			frictionScalar /= this.invMass + other.invMass;

			let friction;
			const staticFriction = Math.sqrt(this.staticFriction ** 2 + other.staticFriction ** 2);
			if (frictionScalar < event.impulseScalar *  staticFriction) {
				friction = frictinoNormal.scaled(frictionScalar);
			} else {
				const dynamicFriction = Math.sqrt(this.dynamicFriction ** 2 + other.dynamicFriction ** 2);
				friction = frictionNormal.scaled(-event.impulseScalar * dynamicFriction);
			}

			friction.scaled(this.invMass);
			this.#resultForce = Vector2D.add(this.#resultImpulse, friction);
		});

		// calculate collision impulse
		collisionEventList.forEach(event => {
			if (!this.checkList.has(event.otherCollision)) return;
			if (!this.invMass) return;

			const other = this.checkList.get(event.otherCollision);
			const rlVelocity = Vector2D.sub(this.velocity, other.velocity);
			const impulseNormal = event.collisionNormal;
			const normalVel = Vector2D.dot(rlVelocity, impulseNormal);
			const restitution = Math.min(this.restitution, other.restitution);

			let impulseScalar = -(1 + restitution) * normalVel;
			impulseScalar /= this.invMass + other.invMass;

			const impulse = impulseNormal.scaled(impulseScalar);
			this.applyImpulse(impulse, event.contactPoint);
			event.impulseScalar = impulseScalar;
		})
	}

	applyImpulse(impulse, contactPoint) {
		const contactVector = Vector2D.sub(contactPoint, this.shape.transformed.massCenter);
		this.velocity = Vector2D.add(this.velocity, impulse.scaled(this.invMass));
		this.angularVelocity += Vector2D.cross(contactVector, impulse) * this.invInertia;

		console.log(this.density, impulse.scaled(this.invMass), Vector2D.cross(contactVector, impulse) * this.invInertia);
	}

	#compute(deltaTime) {
		if (!this.isStatic) {
			const force = Vector2D.add(this.#resultForce.scaled(this.#invMass), this.gravity);
			this.velocity = Vector2D.add(this.velocity, force.scaled(deltaTime));
			this.position = Vector2D.add(this.position, this.velocity.scaled(deltaTime));

			const torque = this.#resultTorque * this.#invInertia;
			this.angularVelocity += torque * deltaTime;
			this.rotation = this.angularVelocity * deltaTime;
		}
	}

}