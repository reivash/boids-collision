'use strict';

const APPLICATION_WIDTH = 640;
const APPLICATION_HEIGHT = 360;
const RED = 0xff0000;
const MAX_SPEED = 50;
let boids = [];

class Boid {
    constructor(appStage, position) {
        // Draw triangle pointing to angle 0 (to the right).
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(RED);
        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(-15, 5);
        this.graphics.lineTo(-15, -5);
        this.graphics.endFill();

        appStage.addChild(this.graphics);

        // Direction and speed are randomly initialized.
        this.direction = getRandomNormalized2DVector();
        this.speed = MAX_SPEED * Math.random();

        // Add to global boids vector.
        boids.push(this);
    }

    tick() {
        // Move towards `direction` at `speed` velocity.
        this.graphics.x += this.direction.x * this.speed;
        this.graphics.y += this.direction.y * this.speed;

        this.graphics.rotation = getVectorAngle(this.direction);
    }
};

function getRandomNormalized2DVector() {
    let vector = { x: Math.random(), y: Math.random()};
    let vectorLength = Math.sqrt(vector.x * vector.x) + (vector.y * vector.y);
    vector.x /= vectorLength;
    vector.y /= vectorLength;
    return vector;
}

function getRandomPointInScreen() {
    return { x: Math.random() * APPLICATION_WIDTH, y: Math.random() * APPLICATION_HEIGHT };
}

// Gets the vector angle in radians.
function getVectorAngle(vector) {
    return Math.atan2(vector.y, vector.x);
}

// Create the application helper and add its render target to the page
let app = new PIXI.Application({ width: APPLICATION_WIDTH, height: APPLICATION_HEIGHT });
document.body.appendChild(app.view);

// Add it to the stage to render
let position = getRandomPointInScreen();

for (let step = 0; step < 100; step++) {
    new Boid(app.stage, position);
}

// Add a ticker callback to move the sprite back and forth
let elapsed = 0.0;
app.ticker.add((delta) => {
    elapsed += delta;
    boids.forEach(boid => boid.tick());
});