const {getRotationDelta} = require('./vector_ops');

describe('getRotationDelta', function() {
  it('should be to compute angle between opposite vectors', function() {
    v1 = {x: 1, y: 0};
    v2 = {x: -1, y: 0};

    radians = getRotationDelta(v1, v2);
    
    expect(radians).toEqual(Math.PI);
  });
});
