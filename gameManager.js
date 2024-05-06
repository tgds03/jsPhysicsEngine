const GameManager = {
	GameFPS: 60,
	screenWidth: 800,
	screenHeight: 800,
	lastTime: new Date().getTime(),
	background: undefined,

	initPool: new ComponentPool('Init'),
	updatePool: new ComponentPool('Update'),

	Input: {
		mouse: new MouseInput()
	},

	init: function() {
		const canvas = document.getElementsByTagName("canvas")[0];
		canvas.width = GameManager.screenWidth;
		canvas.height = GameManager.screenHeight;

		Drawable.canvasContext = canvas.getContext('2d');

		GameManager.initPool.execute();
		setInterval(GameManager.update, 1000 / GameManager.GameFPS);
	},

	update: function() {
		let nowTime = new Date().getTime();
		deltaTime = (nowTime - GameManager.lastTime) / 1000;
		GameManager.lastTime = nowTime;

		GameManager.collision();
		GameManager.physics(deltaTime);
		GameManager.updatePool.execute(deltaTime, nowTime / 1000);
		GameManager.draw();
	},

	collision: function() {
		Collision.collisionPool.execute();
	},

	physics: function(deltaTime) {
		RigidBody.resolveCollisionPool.execute();
		RigidBody.computePhysicsPool.execute(deltaTime);
	},
	draw: function() {
		GameManager.backgroundDraw();
		Drawable.draw();
	},

	backgroundDraw: function() {
		const c = Drawable.canvasContext;
		const vx = [0, GameManager.screenWidth, GameManager.screenWidth, 0];
		const vy = [0, 0, GameManager.screenHeight, GameManager.screenHeight];
		c.fillStyle = "#eeeeee";
		c.strokeStyle = "black";
		c.beginPath();
		for (let i = 0; i < 4; i++) {
			c.lineTo(vx[i], vy[i]);
		}
		c.lineTo(vx[0], vy[0]);
		c.fill();
		c.stroke();
		c.closePath();
	}
}

window.onload = GameManager.init;