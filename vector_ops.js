// Angle required for `v1` to become `v2`. 
// Both vectors must be normalized.

const TWO_PI = Math.PI * 2;
const VECTOR_PRECISION = 0.0000001;

function getVectorAngle(vector) {
    let angle = Math.atan2(vector.y, vector.x);
    if (angle < 0) {
        angle = (Math.PI + angle) + Math.PI;
    }
    return angle;
}

function getRotationDelta(v1, v2) {
    let v1_angle = getVectorAngle(v1);
    let v2_angle = getVectorAngle(v2);
    
    let delta = v2_angle - v1_angle;
    if (delta > Math.PI) {
        delta = delta - TWO_PI;
    }
    if (delta < -Math.PI) {
        delta = delta + TWO_PI;
    }
    
    return delta;
}

function smallValuesVectorToZero(vector) {
    if (Math.abs(vector.x) < VECTOR_PRECISION) {
        vector.x = 0;
    }
    if (Math.abs(vector.y) < VECTOR_PRECISION) {
        vector.y = 0;
    }
    return vector;
}

function turnVector(vector, radians) {
    let turnedVector = {x: vector.x * Math.cos(radians) - vector.y * Math.sin(radians), 
                        y: vector.x * Math.sin(radians) + vector.y * Math.cos(radians)};

    return smallValuesVectorToZero(turnedVector);
}

function distanceBetweenPoints(p1, p2) {
    let d = {x: p2.x - p1.x, 
             y: p2.y - p1.y};
    return Math.sqrt(d.x * d.x + 
                     d.y * d.y);
}

function normalizeVector(v) {
    let normal = Math.sqrt(v.x * v.x + v.y * v.y);
    return {x: v.x / normal, y: v.y / normal};
}

function getPossibleTurnRadians(currentTurnSpeed, turnAcceleration, maxTurnSpeed, requestedTurn) {
    // If we want to turn more than we can, turn only what we can.
    if (requestedTurn >= 0) {
        if (turnAcceleration < requestedTurn) { requestedTurn = turnAcceleration; }
    } else {
        if (requestedTurn < -turnAcceleration) { requestedTurn = -turnAcceleration; }
    }

    // Compute turn speed based on turn acceleration.
    if (requestedTurn >= 0) {
        currentTurnSpeed += turnAcceleration > requestedTurn ? requestedTurn : turnAcceleration;
    } else {
        currentTurnSpeed += -turnAcceleration < requestedTurn ? requestedTurn : -turnAcceleration;
    }
    
    
    // // If we turn more than we can, turn only what we can.
    if (currentTurnSpeed < -maxTurnSpeed) currentTurnSpeed = -maxTurnSpeed;
    if (currentTurnSpeed > maxTurnSpeed) currentTurnSpeed = maxTurnSpeed;

    return currentTurnSpeed;
}

module.exports.getVectorAngle = getVectorAngle;
module.exports.getRotationDelta = getRotationDelta;
module.exports.turnVector = turnVector;
module.exports.distanceBetweenPoints = distanceBetweenPoints;
module.exports.normalizeVector = normalizeVector;
module.exports.getPossibleTurnRadians = getPossibleTurnRadians;
