// Angle required for `v1` to become `v2`. 
// Both vectors must be normalized.

const TWO_PI = Math.PI * 2;

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

function turnVector(vector, radians) {
    return {x: vector.x * Math.cos(radians) - vector.y * Math.sin(radians), 
            y: vector.x * Math.sin(radians) + vector.y * Math.cos(radians)}
}


module.exports.getVectorAngle = getVectorAngle;
module.exports.getRotationDelta = getRotationDelta;
module.exports.turnVector = turnVector;
