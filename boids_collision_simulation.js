'use strict';

const APPLICATION_WIDTH = 640;
const APPLICATION_HEIGHT = 360;
let boids = [];

class Boid {
    constructor(appStage, position) {
        // Create a Graphics object, set a fill color, draw a rectangle
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0xff0000);
        this.graphics.drawRect(0, 0, 200, 100);
        appStage.addChild(this.graphics);

        // Direction and speed are randomly initialized.
        this.direction = getRandom2DVector();
        this.speed = Math.random();

        // Add to global boids vector.
        boids.push(this);
    }

    tick() {
        // Move towards `direction` at `speed` velocity.
        this.graphics.x += this.direction.x * this.speed;
        this.graphics.y += this.direction.y * this.speed;

        // TODO: Change direction.
    }
};

function getRandom2DVector() {
    return {x: Math.random(), y: Math.random()};
}

function getRandom2DVectorInScreen() {
    return {x: Math.random() * APPLICATION_WIDTH, y: Math.random() * APPLICATION_HEIGHT};
}

// Create the application helper and add its render target to the page
let app = new PIXI.Application({ width: APPLICATION_WIDTH, height: APPLICATION_HEIGHT });
document.body.appendChild(app.view);

// Add it to the stage to render
let position = getRandom2DVectorInScreen();
new Boid(app.stage, position);

// Add a ticker callback to move the sprite back and forth
let elapsed = 0.0;
app.ticker.add((delta) => {
    elapsed += delta;
    boids.forEach(boid => boid.tick());
});