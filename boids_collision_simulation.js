'use strict';

const APPLICATION_WIDTH = 640;
const APPLICATION_HEIGHT = 360;
const RED = 0xff0000;
const BOIDS_SPEED = 3;
let boids = [];

// TODO: Add random pio pio sounds that make the icon flash bigger.
class Boid {
    avoidBorderMinimumDistance = 35;
    maxTurnSpeed = 0.1;
    turnAcceleration = 0.02;
    turnDelta = 0;

    constructor(appStage, position) {
        // Draw triangle pointing to angle 0 (to the right).
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(RED);
        this.graphics.moveTo(5, 0);
        this.graphics.lineTo(-10, 5);
        this.graphics.lineTo(-10, -5);
        this.graphics.endFill();
        appStage.addChild(this.graphics);

        // Set position.
        this.graphics.x = position.x;
        this.graphics.y = position.y;


        // Direction and speed are randomly initialized.
        this.direction = getRandomNormalized2DVector();
        if (Math.random() > 0.5) this.direction.x *= -1;
        if (Math.random() > 0.5) this.direction.y *= -1;

        this.speed = BOIDS_SPEED;

        // Add to global boids vector.
        boids.push(this);
    }

    avoidBorders() {
        // Avoid top collision.
        if (this.graphics.y < this.avoidBorderMinimumDistance) {
            let requestedTurnRadians = getRotationDelta(this.direction, { x: 0, y: 1 });
            let possibleTurnRadians = this.getPossibleTurnRadians(requestedTurnRadians);
            this.direction = turnVector(this.direction, possibleTurnRadians);
        } else if (this.graphics.y > (APPLICATION_HEIGHT - this.avoidBorderMinimumDistance)) {
            // Avoid bottom collision.
            let requestedTurnRadians = getRotationDelta(this.direction, { x: 0, y: -1 });
            let possibleTurnRadians = this.getPossibleTurnRadians(requestedTurnRadians);
            this.direction = turnVector(this.direction, possibleTurnRadians);
        } else if (this.graphics.x < this.avoidBorderMinimumDistance) {
            // Avoid left collision.
            let requestedTurnRadians = getRotationDelta(this.direction, { x: 1, y: 0 });
            let possibleTurnRadians = this.getPossibleTurnRadians(requestedTurnRadians);
            this.direction = turnVector(this.direction, possibleTurnRadians);
        } else if (this.graphics.x > (APPLICATION_WIDTH - this.avoidBorderMinimumDistance)) {
            // Avoid right collision.
            let requestedTurnRadians = getRotationDelta(this.direction, { x: -1, y: 0 });
            let possibleTurnRadians = this.getPossibleTurnRadians(requestedTurnRadians);
            this.direction = turnVector(this.direction, possibleTurnRadians);
        } else {
            this.turnDelta = 0;
        }
    }

    getPossibleTurnRadians(requestedRadians) {
        // Compute turn speed based on turn acceleration.
        if (this.requestedRadians < 0) {
            this.turnDelta += -this.turnAcceleration < requestedRadians ? requestedRadians : -this.turnAcceleration;
        }
        this.turnDelta += this.turnAcceleration > requestedRadians ? requestedRadians : this.turnAcceleration;

        // If we turn more than we can, turn only what we can.
        if (this.turnDelta < -this.maxTurnSpeed) this.turnDelta = -this.maxTurnSpeed;
        if (this.turnDelta > this.maxTurnSpeed) this.turnDelta = this.maxTurnSpeed;
        // If we turn more than we want, turn only what we want.
        if (requestedRadians < 0) {
            if (this.turnDelta < requestedRadians) { this.turnDelta = -requestedRadians; }
        } else {
            if (this.turnDelta > requestedRadians) { this.turnDelta = requestedRadians; }
        }

        return this.turnDelta;
    }

    tick() {
        // Move towards `direction` at `speed` velocity.
        this.graphics.x += this.direction.x * this.speed;
        this.graphics.y += this.direction.y * this.speed;

        this.graphics.rotation = getVectorAngle(this.direction);

        this.avoidBorders();
    }
};

function getRandomNormalized2DVector() {
    let vector = { x: Math.random(), y: Math.random() };
    let vectorLength = Math.sqrt(vector.x * vector.x) + Math.sqrt(vector.y * vector.y);
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
new Boid(app.stage, position);

// Add a ticker callback to move the sprite back and forth
let elapsed = 0.0;
app.ticker.add((delta) => {
    elapsed += delta;
    boids.forEach(boid => boid.tick());
});