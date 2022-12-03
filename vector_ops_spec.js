const { getVectorAngle, getRotationDelta, turnVector, getPossibleTurnRadians } = require('./vector_ops');

describe('getVectorAngle', function () {
  it('(1, 0) = 0', function () {
    let v = { x: 1, y: 0 };
    expect(getVectorAngle(v)).toEqual(0);
  });

  it('(0, 1) = Math.PI / 2', function () {
    let v = { x: 0, y: 1 };
    expect(getVectorAngle(v)).toEqual(Math.PI / 2);
  });

  it('(-1, 0) = Math.PI', function () {
    let v = { x: -1, y: 0 };
    expect(getVectorAngle(v)).toEqual(Math.PI);
  });

  it('(0, -1) = Math.PI + Math.PI / 2', function () {
    let v = { x: 0, y: -1 };
    expect(getVectorAngle(v)).toEqual(Math.PI + (Math.PI / 2));
  });
});

describe('getRotationDelta', function () {
  it('should be to compute angle between opposite vectors', function () {
    v1 = { x: 1, y: 0 };
    v2 = { x: -1, y: 0 };

    radians = getRotationDelta(v1, v2);
    expect(radians).toEqual(Math.PI);
  });

  it('should be to compute angle between perpendicular vectors', function () {
    v1 = { x: 1, y: 0 };
    v2 = { x: 0, y: 1 };

    radians = getRotationDelta(v1, v2);
    expect(radians).toEqual(Math.PI / 2);

    // The other way around.
    radians = getRotationDelta(v2, v1);
    expect(radians).toEqual(-Math.PI / 2);
  });

  it('should be to compute angle between vectors at beginning and end of angle value range', function () {
    v1 = { x: 0.70711, y: 0.70711 };
    v2 = { x: 0.70711, y: -0.70711 };

    radians = getRotationDelta(v1, v2);
    expect(radians).toEqual(-Math.PI / 2);

    // The other way around.
    radians = getRotationDelta(v2, v1);
    expect(radians).toEqual(Math.PI / 2);
  });
});

describe('turnVector', function () {
  it('(1, 0) + (Math.PI / 2) = (0, 1)', function () {
    v = { x: 1, y: 0 };
    angle = Math.PI / 2;

    radians = turnVector(v, angle);
    expect(turnVector(v, angle)).toEqual({ x: 0, y: 1 });
  });

  it('(0, 1) + (Math.PI / 2) = (-1, 0)', function () {
    v = { x: 0, y: 1 };
    angle = Math.PI / 2;

    radians = turnVector(v, angle);
    expect(turnVector(v, angle)).toEqual({ x: -1, y: 0 });
  });

  it('(-1, 0) + (Math.PI / 2) = (0, -1)', function () {
    v = { x: -1, y: 0 };
    angle = Math.PI / 2;

    radians = turnVector(v, angle);
    expect(turnVector(v, angle)).toEqual({ x: 0, y: -1 });
  });

  it('(0, -1) + (Math.PI / 2) = (1, 0)', function () {
    v = { x: 0, y: -1 };
    angle = Math.PI / 2;

    radians = turnVector(v, angle);
    expect(turnVector(v, angle)).toEqual({ x: 1, y: 0 });
  });
});

describe('getPossibleTurnRadians', function () {
  it('turn exactly turnAcceleration', function () {
    currentTurnSpeed = 0;
    turnAcceleration = 0.1;
    maxTurnSpeed = 1;
    requestedTurn = 0.1;

    nextTurnSpeed = getPossibleTurnRadians(currentTurnSpeed, turnAcceleration, maxTurnSpeed, requestedTurn);
    expect(nextTurnSpeed).toEqual(0.1);
    nextTurnSpeed = getPossibleTurnRadians(currentTurnSpeed, turnAcceleration, maxTurnSpeed, -requestedTurn);
    expect(nextTurnSpeed).toEqual(-0.1);
  });
  
  it('turn more than turnAcceleration', function () {
    currentTurnSpeed = 0;
    turnAcceleration = 0.1;
    maxTurnSpeed = 1;
    requestedTurn = 0.2;

    nextTurnSpeed = getPossibleTurnRadians(currentTurnSpeed, turnAcceleration, maxTurnSpeed, requestedTurn);
    expect(nextTurnSpeed).toEqual(0.1);
    nextTurnSpeed = getPossibleTurnRadians(currentTurnSpeed, turnAcceleration, maxTurnSpeed, -requestedTurn);
    expect(nextTurnSpeed).toEqual(-0.1);
  });
});
