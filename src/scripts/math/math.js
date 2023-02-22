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

function getNearestInsideShape(pos) {
    for (var i = 0; i < shapeBuffer.buffer.length; i++) {
        if (isInside(pos, shapeBuffer.buffer[i])) {
            var shape   = shapeBuffer.buffer[i];
            var min     = euclideanDistance(pos, shape.vertices[0]);
            var j       = 0;

            for (var k = 1; k < shape.vertices.length; k++) {
                var dist    = euclideanDistance(pos, shape.vertices[k]);
                if (dist < min) {
                    min     = dist;
                    j       = k;
                }
            }

            return {
                shapePos    : i,
                vertexPos   : j,
            }
        }
    }
    return;
}

function isInside(pos, shape) {
    var x = pos.x;
    var y = pos.y;

    if (shape.type == "rectangle" || shape.type == "square") {
        return (
            // check x position
            x > shape.vertices[1].x &&  // min x
            x < shape.vertices[3].x &&  // max x
            // check y position
            y > shape.vertices[1].y &&  // min y
            y < shape.vertices[3].y);   // max y
    } 
}

function euclideanDistance(pos1, pos2) {
    var dx = pos1.x - pos2.x;
    var dy = pos1.y - pos2.y;
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}