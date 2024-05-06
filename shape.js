/**
 * Shape
 * Depend On
 * Vector2D, HierTransformation
 */

class Shape {
	verticesList = undefined;
	transformation = undefined;
	constructor(vertices) {
		this.verticesList = vertices?.filter(vertex => vertex instanceof Vector2D);
		this.transformation = new HierTransformation();
	}

	get AABBmax() {
		const max = new Vector2D(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
		this.verticesList.forEach(vertex => {
			if (vertex.x > max.x) max.x = vertex.x;
			if (vertex.y > max.y) max.y = vertex.y;
		});
		return max;
	}

	get AABBmin() {
		const min = new Vector2D(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
		this.verticesList.forEach(vertex => {
			if (vertex.x < min.x) min.x = vertex.x;
			if (vertex.y < min.y) min.y = vertex.y;
		});
		return min;
	}
	get transformed() {
		const m = this.transformation.worldMatrix;
		const trnasformedVertices = this.verticesList.map(v => {
			return new Vector2D(
				v.x * m[0] + v.y * m[1] + m[2],
				v.x * m[3] + v.y * m[4] + m[5]
			);
		});
		const transformedShape = new this.constructor();
		transformedShape.verticesList = trnasformedVertices;
		return transformedShape;
	}
	get area() {
		let v0, v1, area, c = this.massCenter, sumArea = 0;
		for (let i = 0; i < this.verticesList.length; i++) {
			v0 = Vector2D.sub(this.verticesList.at(i-1), c);
			v1 = Vector2D.sub(this.verticesList.at(i), c);
			area = Math.abs(Vector2D.cross(v0, v1)) / 2;
			sumArea += area;
		}
		return sumArea;
	}
	get massCenter() {
		let n = this.verticesList.length, sumVec = Vector2D.zero;
		this.verticesList.forEach((vec) => {sumVec = Vector2D.add(sumVec, vec);});
		return sumVec.scaled(1/n);
	}
	inertia(mass) {
		let v0, v1, sumA = 0, sumB = 0;
		for (let i = 0; i < this.verticesList.length; i++) {
			v0 = this.verticesList.at(i-1);
			v1 = this.verticesList.at(i);
			sumA += Vector2D.cross(v0, v1) * (v0.magnitudePow + Vector2D.dot(v0, v1) + v1.magnitudePow);
			sumB += Vector2D.cross(v0, v1);
		}
		return (mass * sumA) / (6 * sumB);
	}
}

class PointShape extends Shape {
	constructor(vec) {
		super([vec || new Vector2D()]);
	}
	get vec() { return this.verticesList[0]; }
	get area() { return 0; }
	get massCenter() { return this.vec; }
	inertia() { return 0; }
}

class LineShape extends Shape {
	constructor(vecc1, vec2) {
		super([vec1 || new VEctor2D(), vec2 || new Vector2D()]);
	}
	get a() { return this.verticesList[0]; }
	get b() { return this.verticesList[1]; }
	set a(vec) { this.verticesList[0] = vec; }
	set b(vec) { this.verticesList[1] = vec; }

	get area() { return 0; }
	get massCenter() { return Vector2D.add(this.a, this.b).scaled(0.5); }
	inertia() { return 0;}
}

class CircleShape extends Shape {
	constructor (radius) {
		super([
			new Vector2D(),
			(radius instanceof Vector2D) ? radius : Vector2D.right.scaled(radius)
		]);
	}
	get radiusVec() { return Vector2D.sub(this.verticesList[1], this.verticesList[0]); }
	get radius() { return this.radiusVec.magnitude; }
	set radius(value) {
		const r = this.radiusVec,
			newRadiusVec = r.normalized.scaled(value);
		this.verticesList[1] = Vector2D.add(this.verticesList[0], newRadiusVec);
	}
	get center() { return this.verticesList[0]; }
	set center(vec) {
		const newRadiusVec = this.radiusVec;
		this.verticesList[0] = vec;
		this.verticesList[1] = Vector2D.add(this.verticesList[0], newRadiusVec);
	}
	get center() { return this.verticesList[0]; }
	set center(vec) {
		const newRadiusVec = this.radiusVec;
		this.verticesList[0] = vec;
		this.verticesList[1] = Vector2D.add(this.verticesList[0], newRadiusVec);
	}
	get area() { return this.radiusVec.magnitudePow * Math.PI; }
	get massCenter() { return this.center; }
	inertia(mass) { return this.radiusVec.magnitudePow * mass * 0.5; }
}

class PolygonShape extends Shape {
	constructor(vertices) {
		super(vertices);
	}
}
