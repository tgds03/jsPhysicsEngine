/**
 * TransformationComp
 */

class TransformationComp extends Component {
	#transformation = undefined;
	#debugDrawComp = undefined;

	constructor() {
		super();
		this.#transformation = new HierTransformation();
	}
	get transformation() { return this.#transformation; }

	translate(vec) { this.#transformation.translate(vec); }
	scale(vec) { this.#transformation.scale(vec); }
	rotate(radian) { this.#transformation.rotate(radian); }

	get position() { return this.#transformation.positionVec; }
	get scaleVec() { return this.#transformation.scaleVec; }
	get rotation() { return this.#transformation.rotation; }

	set position(vec) { this.#transformation.positionVec = vec; }
	set scaleVec(vec) { this.#transformation.scaleVec = vec; }
	set rotation(radian) { this.#transformation.rotation = radian; }

	linkParent(comp) { this.#transformation.linkParent(comp.transformation); }
	linkChild(comp) { this.#transformation.linkChild(comp.transformation); }
	unlinkParent(comp) { this.#transformation.unlinkParent(comp.transformation); }
	unlinkChild(comp) { this.#transformation.unlinkChild(comp.transformation); }

	debugDraw() {
		const ratioScale = 50;
		const m = this.#transformation.worldMatrix,
			mp = this.#transformation.parent?.worldMatrix || Transformation.origin.matrix,
			p1 = new Vector2D(mp[2], mp[5]),
			p2 = new Vector2D(m[2], m[5]),
			sx = new Vector2D(m[0], m[3]).scaled(ratioScale),
			sy = new Vector2D(m[1], m[4]).scaled(ratioScale);

		if (!(this.#debugDrawComp)) {
			this.#debugDrawComp = {
				posArrow : new ArrowDraw(p1, p2),
				sxArrow : new ArrowDraw(p2, Vector2D.add( p1, Vector2D.add(p2, sx) )),
				syArrow : new ArrowDraw(p2, Vector2D.add( p1, Vector2D.add(p2, sy) ))
			};
			this.#debugDrawComp.posArrow.strokeStyle = "black";
			this.#debugDrawComp.sxArrow.strokeStyle = "red";
			this.#debugDrawComp.syArrow.strokeStyle = "green";
		} else {
			let transformed = this.#debugDrawComp.posArrow.shape;
			transformed.a = p1;
			transformed.b = p2;

			transformed = this.#debugDrawComp.sxArrow.shape;
			transformed.a = p2;
			transformed.b = Vector2D.add(p2, sx);

			transformed = this.#debugDrawComp.syArrow.shape;
			transformed.a = p2;
			transformed.b = Vector2D.add(p2, sy);
		}
		
	}
}