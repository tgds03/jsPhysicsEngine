obj1 = new GameObject("obj1");
{
	const posComp = new TransformationComp();
	posComp.addEvent('Init', function()  {
		this.position = new Vector2D(200, 600);
	});
	obj1.addComponent(posComp);

	const polygonNum = 6;
	const objShape = new PolygonShape(
		Array.from({length: polygonNum}, (_, i) => {
			return Vector2D.up.scaled(50).rotated(-i/polygonNum * 2 * Math.PI);
		})
	);
	objShape.transformation.linkParent(posComp.transformation);

	const drawComp = new PolygonDraw();
	drawComp.addEvent('Init', function() {
		this.shape = objShape;
		this.fillStyle = "lime";
		this.strokeStyle = "";
	});
	drawComp.addEvent('Update', function() {
		// const collision = Component.findByName("Collision", "obj1");
		// const obj2Collision = Component.findByName("Collision", "obj2");
		const collision = obj1.getComponentByName("Collision");
		// const event = collision.collisionEventList.find( (event) => (event?.otherCollisoin == obj2Collision));
		const event = (collision.collisionEventList.length > 0);
		if (event) {
			this.fillStyle = "orange";
			// console.log(event.collisionDepth, event.collisionNormal.angle * Math.radtodeg)
		} else {
			this.fillStyle = "lime";
		}
	})
	obj1.addComponent(drawComp);

	const collisionComp = new Collision(objShape, Collision.types.Polygon);
	collisionComp.addEvent('Init', function() {
		// const obj2collision = Component.findByName("Collisoin", "obj2");
		// this.setCheck(obj2Collision);
	})
	obj1.addComponent(collisionComp);

	const physicsComp = new RigidBody(collisionComp, posComp, 1, 1);
	physicsComp.addEvent('Init', function() {
		// this.velocity = new Vector2D(0, -300);
		this.setCollisionCheck(Component.findByName("RigidBody", "obj2"));
		this.setCollisionCheck(Component.findByName("RigidBody", "objFloor"));
	});
	physicsComp.addEvent('Update', function() {
		const diff = Vector2D.sub(GameManager.Input.mouse.position, this.position).normalized;
		this.velocity = Vector2D.add(this.velocity, diff);
	})
	obj1.addComponent(physicsComp);
}

obj2 = new GameObject("obj2");
{
	const posComp = new TransformationComp();
	posComp.addEvent('Init', function()  {
		this.position = new Vector2D(600, 600);
	});
	posComp.addEvent('Update', function() {
		this.debugDraw();
	})
	obj2.addComponent(posComp);

	const polygonNum = 6;
	const objShape = new PolygonShape(
		Array.from({length: polygonNum}, (_, i) => {
			return Vector2D.up.scaled(50).rotated(-i/polygonNum * 2 * Math.PI);
		})
	);
	objShape.transformation.linkParent(posComp.transformation);

	const drawComp = new PolygonDraw();
	drawComp.addEvent('Init', function() {
		this.shape = objShape;
		this.fillStyle = "lime";
		this.strokeStyle = "";
	});
	drawComp.addEvent('Update', function() {
		const collision = Component.findByName("Collision", "obj1");
		const obj2Collision = Component.findByName("Collision", "obj2");
		const event = collision.collisionEventList.find( (event) => (event?.otherCollisoin == obj2Collision));
		if (event) {
			this.fillStyle = "orange";
			console.log(event.collisionDepth, event.collisionNormal.angle * Math.radtodeg)
		} else {
			this.fillStyle = "lime";
		}
	})
	obj2.addComponent(drawComp);

	const collisionComp = new Collision(objShape, Collision.types.Polygon);
	collisionComp.addEvent('Init', function() {
		// const obj2collision = Component.findByName("Collisoin", "obj2");
		// this.setCheck(obj2Collision);
	})
	obj2.addComponent(collisionComp);

	const physicsComp = new RigidBody(collisionComp, posComp, 1, 1);
	physicsComp.addEvent('Init', function() {
		// this.velocity = new Vector2D(0, -300);
		// this.setCollisionCheck(Component.findByName("RigidBody", "obj1"));
		this.setCollisionCheck(Component.findByName("RigidBody", "objFloor"));
	});
	physicsComp.addEvent('Update', function() {
		const diff = Vector2D.sub(GameManager.Input.mouse.position, this.position).normalized;
		this.velocity = Vector2D.add(this.velocity, diff);
	})
	obj2.addComponent(physicsComp);
}

objFloor = new GameObject("objFloor");
{
	const posComp = new TransformationComp();
	posComp.addEvent('Init', function() {
		this.position = new Vector2D(400, 200);
	});
	objFloor.addComponent(posComp);

	const objShape = new PolygonShape ([
		new Vector2D(-350, -50),
		new Vector2D(350, -50),
		new Vector2D(350, 50),
		new Vector2D(-350, 50)
	]);
	objShape.transformation.linkParent(posComp.transformation);

	const drawComp = new PolygonDraw();
	drawComp.addEvent('Init', function() {
		this.shape = objShape;
		this.fillStyle = "gray";
	});
	objFloor.addComponent(drawComp);

	const collisionComp = new Collision(objShape, Collision.types.Polygon);
	objFloor.addComponent(collisionComp);

	const physicsComp = new RigidBody(collisionComp, posComp, 0.1);
	physicsComp.isStatic = true;
	objFloor.addComponent(physicsComp);
}