/**
 * Collision
 * Depend on Shape, Component
 */

class Collision extends Component {
	static check(collisionA, collisionB) {
		return Collision.checkFunction[collisionA.type][collisionB.type](collisionA, collisionB);
	}
	static types = {
		Point: 0,
		Line: 1,
		Circle: 2,
		Polygon: 3,
	};
	static checkFunction = [ [], [], [], [], [] ];
	static collisionPool = new ComponentPool("Collision");

	#collisionEventList = [];

	constructor(shape, bodyType) {
		super();
		this.shape = shape;
		this.type = bodyType;
		this.checkList = new Map();
		this.callbackList = new Map();
		this.addEvent('Collision', this.#checkCollision);
	}

	get transformedShape() { return this.shape.transformed; }
	get collisionEventList() { return [...this.#collisionEventList]; }
	get collidedList() { return this.#collisionEventList.map((e)=>e.otherCollision); }

	setCheck(collisionComp) {
		this.checkList.set(collisionComp.id, collisionComp);
	}
	unsetCheck(collisionCompId) {
		this.checkList.delete(collisionCompId);
	}
	isSetCheck(collisionCompId) {
		return this.checkList.has(collisionCompId);
	}
	ifCollideWith(collisionComp, callback) {
		this.callbackList.set(collisionComp.id, callback);
	}

	#checkCollision() {
		this.#collisionEventList = [];
		this.checkList.forEach( (other, otherId) => {
			const collisionEvent = Collision.check(this, other);
			collisionEvent.otherCollision = other;
			if ( collisionEvent.isCollision ) {
				const callback = this.callbackList.get(otherId);
				if (callback) callback();
				this.#collisionEventList.push(collisionEvent);
			}
		})
	}
}

// defining collsiion check functions
{
	const PointPoint = function (p1, p2) {
		return {
			isCollision: Vector2D.isEqual(p1, p2),
			contactPoint: p1,
			collisionDepth: 0,
			collisionNormal: Vector2D.zero
		}
	}

	const PointCircle = function (p, c, r) {

	}

	const PointPolygon = function (p, vertices) {
		let v0, v1, sign, dot, normal, n, depth = Number.POSITIVE_INFINITY;
		for (let i = 0; i < vertices.length; i++) {
			v0 = vertices.at(i - 1);
			v1 = vertices.at(i);
			n = Vector2D.sub(v1, v0).perpendicular.normalized;
			dot = Vector2D.dot(Vector2D.sub(p, v1), n);

			if (i == 0)
				sign = Math.sign(dot);
			if (depth > dot * sign) {
				depth = dot * sign;
				normal = n;
			}
		}
		return {
			isCollision: (depth > 0),
			contactPoint: p,
			collisionDepth: depth,
			collisionNormal: normal
		}
	}

	// point vs point
	Collision.checkFunction[0][0] = function (pointCollisionA, pointCollisionB) {
		const event = PointPoint(
			pointCollisionA.transformedShape.vec, 
			pointCollisionB.transformedShape.vec
		)
		event.collisionA = pointCollisionA;
		event.collisionB = pointCollisionB;
		return event;
	}

	// point vs polygon
	Collision.checkFunction[0][3] = function(pointCollision, polygonCollision) {
		const event = PointPolygon(
			pointCollision.transformedShape.vec,
			polygonCollision.transformedShape.verticesList
		);
		event.collisionA = pointCollision;
		event.collisionB = polygonCollision;
		return event;
	}

	Collision.checkFunction[3][0] = function(polygonCollision, pointCollision) {
		const event = PointPolygon(
			pointCollision.transformedShape.vec,
			polygonCollision.transformedShape.verticesList
		);
		event.collisionA = polygonCollision;
		event.collisionB = pointCollision;
		return event;
	}

	Collision.checkFunction[3][3] = function(polygonCollisionA, polygonCollisionB) {
		const verticesA = polygonCollisionA.transformedShape.verticesList,
			verticesB = polygonCollisionB.transformedShape.verticesList;

			let e, event;
			let eventAB = {
				isCollision: false,
				collisionDepth: Number.NEGATIVE_INFINITY,
				collisionNormal: undefined
			};
			for (let i = 0; i < verticesA.length; i++) {
				e = PointPolygon(verticesA[i], verticesB);
				if (eventAB.collisionDepth < e.collisionDepth) {
					eventAB = e;
				}
			}

			let eventBA = {
				isCollision: false,
				collisionDepth: Number.NEGATIVE_INFINITY,
				collisionNormal: undefined
			};
			for (let i = 0; i < verticesB.length; i++) {
				e = PointPolygon(verticesB[i], verticesA);
				if (eventBA.collisionDepth < e.collisionDepth) {
					eventBA = e;
				}
			}

			event = (eventAB.collisionDepth > eventBA.collisionDepth) ? eventAB : eventBA;
			return event;
	}


}