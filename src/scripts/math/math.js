const eplison       = 0.05;

function getNearestVertice(pos) {
    for (var i = 0; i < shapeBuffer.buffer.length; i++) {
        for (var j = 0; j < shapeBuffer.buffer[i].vertices.length; j++) {
            if (euclideanDistance(pos, shapeBuffer.buffer[i].vertices[j]) < eplison) {
                return {
                    shapePos    : i,
                    vertexPos   : j,
                }
            }
        }
    }
    return;
}

function euclideanDistance(pos1, pos2) {
    var dx = pos1.x - pos2.x;
    var dy = pos1.y - pos2.y;
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}