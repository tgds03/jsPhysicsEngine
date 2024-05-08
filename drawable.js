/**
 * Drawable
 * Depend on Shape, Component
 */

class Drawable extends Component {
	static canvasContext;
	static drawablePool = new ComponentPool('Draw');
	static draw() { this.drawablePool.execute(); }

	constructor(shape) {
		super();
		this.fillStyle = "";
		this.strokeStyle = "";
		this.shape = shape;
		this.addEvent('Draw', this.draw);
	}

	get canvasContext() { return Drawable.canvasContext; }
	get transformedShape() { return this.shape.transformed; }
	beforeDraw() {
		const c = this.canvasContext;
		c.fillStyle = this.fillStyle;
		c.strokeStyle = this.strokeStyle;
	}
	draw() {}
}

class TextDraw extends Drawable {
	constructor(posVec, string) {
		super( new VectorShape(posVec) );
		this.content = string || '';
	}

	draw() {
		const c = this.canvasContext;
		this.beforeDraw();
		c.fillText(this.content, this.shape.vec.x, this.shape.vec.y);
		c.strokeText(this.content, this.shape.vec.x, this.shape.vec.y);
	}
}

class ArrowDraw extends Drawable {
	constructor(...vecs) {
		super(new LineShape(...vecs));
	}

	draw() {
		const c = this.canvasContext;
		const transformed = this.transformedShape;
		this.beforeDraw();
		c.beginPath();
		c.lineTo(transformed.a.x, transformed.a.y);
		c.lineTo(transformed.b.x, transformed.b.y);
		c.stroke();
		c.closePath();
	}
}

class CircleDraw extends Drawable {
	constructor(radius) {
		super( new CircleShape(radius) );
	}
	draw() {
		const c = this.canvasContext;
		const transformed = this.transformedShape;
		const center = transformed.center;
		const radius = transformed.radius;
		this.beforeDraw();
		c.beginPath();
		c.arc(center.x, center.y, radius, 0, Math.PI * 2);
		c.fill();
		c.stroke();
		c.closePath();
	}
}

class PolygonDraw extends Drawable {
	constructor(vertices) {
		super( new PolygonShape(vertices) );
	}
	draw() {
		const c = this.canvasContext;
		const transformed = this.transformedShape;
		const vertices = transformed.verticesList;
		this.beforeDraw();
		c.beginPath();
		for (let i = 0; i < vertices.length; i++) {
			c.lineTo(vertices[i].x, vertices[i].y);
		}
		c.lineTo(vertices[0].x, vertices[0].y);
		c.fill();
		c.stroke();
		c.closePath();
	}
}