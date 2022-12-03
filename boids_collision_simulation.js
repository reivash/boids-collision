'use strict';

const APPLICATION_WIDTH = 256;
const APPLICATION_HEIGHT = 256;
const RED = 0xff0000;
const BOIDS_SPEED = 3;
const NEIGHBOUR_MAX_DISTANCE = 40;
const NEIGHBOUR_MIN_DISTANCE = 20;
const AVOID_BORDER_DISTANCE = 50;
let boids = [];

// TODO: Add random pio pio sounds that make the icon flash bigger.
class Boid {
    maxTurnSpeed = 0.5;
    turnAcceleration = 0.2;
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
        if (this.graphics.y < AVOID_BORDER_DISTANCE) {
            // Avoid top collision.
            return getRotationDelta(this.direction, { x: 0, y: 1 });
        } else if (this.graphics.y > (APPLICATION_HEIGHT - AVOID_BORDER_DISTANCE)) {
            // Avoid bottom collision.
            return getRotationDelta(this.direction, { x: 0, y: -1 });
        } else if (this.graphics.x < AVOID_BORDER_DISTANCE) {
            // Avoid left collision.
            return getRotationDelta(this.direction, { x: 1, y: 0 });
        } else if (this.graphics.x > (APPLICATION_WIDTH - AVOID_BORDER_DISTANCE)) {
            // Avoid right collision.
            return getRotationDelta(this.direction, { x: -1, y: 0 });
        }
        return 0;
    }

    getPosition() {
        return { x: this.graphics.x, y: this.graphics.y };
    }

    getNeighbours() {
        let neighbours = [];
        for (let i = 0; i < boids.length; i++) {
            let b = boids[i];
            if (b == this) continue;

            if (distanceBetweenPoints(b.getPosition(),
                this.getPosition()) < NEIGHBOUR_MAX_DISTANCE) {
                neighbours.push(b);
            }
        }
        return neighbours;
    }

    alignWithNeighboursTurnAngle(neighbours) {
        let avg_angle = 0;
        for (let i = 0; i < neighbours.length; i++) {
            let n = neighbours[i];
            if (n == this) continue;

            avg_angle += getVectorAngle(n.getDirection());
        }

        avg_angle /= neighbours.length - 1;
        return avg_angle;
    }

    separateFromNeighboursTooClose(neighbours) {
        let get_away_vector = { x: 0, y: 0 }
        let count = 0;
        for (let i = 0; i < neighbours.length; i++) {
            let n = neighbours[i];
            if (n == this) continue;

            if (distanceBetweenPoints(n.getPosition(),
                this.getPosition()) < NEIGHBOUR_MIN_DISTANCE) {
                get_away_vector.x += this.getPosition().x - n.getPosition().x;
                get_away_vector.y += this.getPosition().y - n.getPosition().y;
                count++;
            }
        }

        get_away_vector.x /= count;
        get_away_vector.y /= count;

        if (get_away_vector.x == 0 && get_away_vector.y == 0)
            return 0;

        get_away_vector = normalizeVector(get_away_vector);
        return getRotationDelta(this.direction, get_away_vector);
    }

    getDirection() {
        return this.direction;
    }

    moveInBetweenNeighbours(neighbours) {
        if (neighbours.length == 0);
        return 0;
        let in_between_position;
        for (let i = 0; i < neighbours.length; i++) {
            let n = neighbours[i];
            if (n == this) continue;

            in_between_position.x += n.getPosition().x;
            in_between_position.y += n.getPosition().y;
        }
        in_between_position.x /= neighbours.length;
        in_between_position.y /= neighbours.length;

        let in_between_direction = {
            x: in_between_position.x - this.getPosition().x,
            y: in_between_position.y - this.getPosition().y
        };
        in_between_direction = normalizeVector(in_between_direction);

        return turnAngle(this.direction, in_between_direction);
    }

    tick() {
        // Move towards `direction` at `speed` velocity.
        this.graphics.x += this.direction.x * this.speed;
        this.graphics.y += this.direction.y * this.speed;

        this.graphics.rotation = getVectorAngle(this.direction);

        // Compute turn.
        // TODO: Boids are acting weird. Need to verify this logic.
        let avoidBordersTurnAngle = this.avoidBorders();
        let neighbours = this.getNeighbours();
        let separationAngle = this.separateFromNeighboursTooClose(neighbours);
        let cohesionAngle = this.moveInBetweenNeighbours(neighbours);
        let alignmentAngle = this.alignWithNeighboursTurnAngle(neighbours);
        let requestedTurnAngle = 0;
        if (avoidBordersTurnAngle != 0) {
            requestedTurnAngle = avoidBordersTurnAngle;
        } else
         if (separationAngle != 0) {
            // requestedTurnAngle = separationAngle;
        } else if (cohesionAngle != 0 || alignmentAngle != 0) {
            // requestedTurnAngle = (cohesionAngle+alignmentAngle) / 2;
        } 
        let turn = getPossibleTurnRadians(this.turnDelta, turnAcceleration, maxTurnSpeed, requestedTurnAngle);
        this.direction = turnVector(this.direction, turn);
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
for (let i = 0; i < 1; i++) {
    let position = getRandomPointInScreen();
    new Boid(app.stage, position);
}

// Add a ticker callback to move the sprite back and forth
let elapsed = 0.0;
app.ticker.add((delta) => {
    elapsed += delta;
    boids.forEach(boid => boid.tick());
});