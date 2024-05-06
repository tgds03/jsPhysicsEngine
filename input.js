function MouseInput() {
	this.position = new Vector2D(0, 0);
	this.mouseMove = function(e) {
		this.position = new Vector2D(e.clientX - 8, e.clientY - 8);
	};
	addEventListener('mousemove', this.mouseMove.bind(this));
}