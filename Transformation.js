/**
 * Transformation
 */

class Transformation {
	positionVec = undefined;
	scaleVec = undefined;
	rotation = NaN;
	
	constructor() {
		this.positionVec = new Vector2D(0, 0);
		this.scaleVec = new Vector2D(1, 1);
		this.rotation = 0;
	}

	get matrix() {
		const d = this.positionVec, s = this.scaleVec, r = this.rotation;
		return [
			s.x * Math.cos(r), -s.y * Math.sin(r), d.x,
			s.x * Math.sin(r), s.y * Math.cos(r), d.y,
			0, 0, 1
		]
	}

	translate(vec) {
		this.positionVec = Vector2D.add(this.positionVec, vec);
	}
	scale(vec) {
		this.scaleVec = new Vector2D(this.scaleVec.x * vec.x, this.scaleVec.y * vec.y);
	}
	rotate(radian) {
		this.rotation = (this.rotation + radian) % (2 * Math.PI);
	}

	static origin = new Transformation();

	static matrixProduct(m1, m2) {
		const res = Array.from({length:9});

		res[0] = m1[0]*m2[0] + m1[1]*m2[3] + m1[2]*m2[6];
		res[1] = m1[0]*m2[1] + m1[1]*m2[4] + m1[2]*m2[7];
		res[2] = m1[0]*m2[2] + m1[1]*m2[5] + m1[2]*m2[8];

		res[3] = m1[3]*m2[0] + m1[4]*m2[3] + m1[5]*m2[6];
		res[4] = m1[3]*m2[1] + m1[4]*m2[4] + m1[5]*m2[7];
		res[5] = m1[3]*m2[2] + m1[4]*m2[5] + m1[5]*m2[8];
	
		res[6] = m1[6]*m2[0] + m1[7]*m2[3] + m1[8]*m2[6];
		res[7] = m1[6]*m2[1] + m1[7]*m2[4] + m1[8]*m2[7];
		res[8] = m1[6]*m2[2] + m1[7]*m2[5] + m1[8]*m2[8];

		return res;
	}

}