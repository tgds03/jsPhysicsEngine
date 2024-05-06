/**
 * Vector2D
 */

class Vector2D {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
		Object.seal(this);
	}

	get magnitude() { return Math.sqrt(this.x ** 2 + this.y ** 2); }
	get magnitudePow() { return this.x ** 2 + this.y ** 2; }
	get normalized() { return this.scaled(1/this.magnitude); }
	get angle() { return Vector2D.angle(Vector2D.right, this) || 0; }
	get perpendicular() { return new Vector2D(this.y, -this.x); }

	scaled(scalar) {
		return new Vector2D(scalar*this.x, scalar*this.y);
	}
	rotated(radian) {
		return new Vector2D(
			this.x * Math.cos(radian) - this.y * Math.sin(radian),
			this.x * Math.sin(radian) + this.y * Math.cos(radian)
		);
	}

	static isEqual(vecA, vecB) {
		return Math.isEqual(vecA.x, vecB.x) && Math.isEqual(vecA.y, vecB.y);
	}
	static add(vecA, vecB) {
		return new Vector2D(vecA.x + vecB.x, vecA.y + vecB.y);
	}
	static sub(vecA, vecB) {
		return new Vector2D(vecA.x - vecB.x, vecA.y - vecB.y);
	}
	static distance(vecA, vecB) {
		return Vector2D.sub(vecA, vecB).magnitude;
	}
	static dot(vecA, vecB) {
		return vecA.x * vecB.x + vecA.y * vecB.y;
	}
	static cross(vecA, vecB) {
		return vecA.x * vecB.y - vecA.y * vecB.x;
	}
	static angle(vecA, vecB) {
		return Math.acos( Vector2D.dot(vecA, vecB) / (vecA.magnitude * vecB.magnitude)) * Math.sign( -Vector2D.cross(vecA, vecB) );
	}

	static zero = new Vector2D(0, 0);
	static up = new Vector2D(0, -1);
	static down = new Vector2D(0, 1);
	static right = new Vector2D(1, 0);
	static left = new Vector2D(-1, 0);
}