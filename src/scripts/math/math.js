const eplison       = 0.05;

function getNearestVertice(pos) {
    for (var i = 0; i < shapeBuffer.buffer.length; i++) {
        for (var j = 0; j < shapeBuffer.buffer[i].vertices.length; j++) {
            if (euclideanDistance(pos, shapeBuffer.buffer[i].vertices[j]) < eplison) {
                console.log(j)
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
        // console.log(shapeBuffer.buffer[i])
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

function getNearestShapeLine(pos) {
    for (var i = 0; i < shapeBuffer.buffer.length; i++) {
        var length  = shapeBuffer.buffer[i].vertices.length;
        if (shapeBuffer.buffer[i].type == "line")
            continue
        for (var j = 0; j < length; j++) {
            
            var x1      = shapeBuffer.buffer[i].vertices[j%length].x;
            var y1      = shapeBuffer.buffer[i].vertices[j%length].y;
            var x2      = shapeBuffer.buffer[i].vertices[(j+1)%length].x;
            var y2      = shapeBuffer.buffer[i].vertices[(j+1)%length].y;

            var m   = (y2 - y1) / (x2 - x1);
            var b   = y1 - m * x1;

            var y   = m * pos.x + b;

            console.log(y, pos.y, Math.abs(y - pos.y))

            if ((Math.abs(y - pos.y) < eplison) || (x2 == x1 && Math.abs(x1 - pos.x) < eplison)) {
                return {
                    shapePos    : i,
                    linePos     : [j%length, (j+1)%length]
                }
            }
        }

    }
    return;
}

function isInside(pos, shape) {
    var x = pos.x;
    var y = pos.y;

    if (shape.type == "line") {
        var x1  = shape.vertices[0].x;
        var y1  = shape.vertices[0].y;
        var x2  = shape.vertices[1].x;
        var y2  = shape.vertices[1].y;

        var m   = (y2 - y1) / (x2 - x1);
        var b   = y1 - m * x1;

        var y   = m * x + b;

        return Math.abs(y - pos.y) < eplison;
    } else if (shape.type == "rectangle" || shape.type == "square") {
        var Xmax   = Math.max(shape.vertices[1].x, shape.vertices[3].x);
        var Xmin   = Math.min(shape.vertices[1].x, shape.vertices[3].x);
        var Ymax   = Math.max(shape.vertices[1].y, shape.vertices[3].y);
        var Ymin   = Math.min(shape.vertices[1].y, shape.vertices[3].y);
        return (
            // check x position
            x > Xmin &&  // min x
            x < Xmax &&  // max x
            // check y position
            y > Ymin &&  // min y
            y < Ymax     // max y
        ); 
    } else if (shape.type == "polygon") {
        console.log("polygon")
        for (var i = 0; i < shape.vertices.length - 2; i++) {
            var A = area(shape.vertices[0], shape.vertices[i + 1], shape.vertices[i + 2]);
            var A1 = area(pos, shape.vertices[i + 1], shape.vertices[i + 2]);
            var A2 = area(shape.vertices[0], pos, shape.vertices[i + 2]);
            var A3 = area(shape.vertices[0], shape.vertices[i + 1], pos);
            console.log((A - (A1 + A2 + A3)) )
            if (Math.abs(A - (A1 + A2 + A3)) < eplison) {
                return true;
            }
        }
        return false;
    }
}

function euclideanDistance(pos1, pos2) {
    var dx = pos1.x - pos2.x;
    var dy = pos1.y - pos2.y;
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

function area(p1, p2, p3) {
    return Math.abs((p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2.0);
}

function getCenter(shape) {
    var x = 0;
    var y = 0;

    for (var i = 0; i < shape.vertices.length; i++) {
        x += shape.vertices[i].x;
        y += shape.vertices[i].y;
    }

    return {
        x   : x / shape.vertices.length,
        y   : y / shape.vertices.length,
    }
}

function getConvexHull(points) {
    var hull = [];

    // Find the leftmost point
    var leftmost   = 0;
    for (var i = 1; i < points.length; i++) {
        if (points[i].x < points[leftmost].x) {
            leftmost   = i;
        }
    }

    var p = leftmost;
    var q;
    do {
        hull.push(p);

        q = (p + 1) % points.length;
        for (var i = 0; i < points.length; i++) {
            if (orientation(points[p], points[i], points[q]) == 2) {
                console.log("orientation")
                q = i;
            }
            console.log("notorientation")
        }

        p = q;
    } while (p != leftmost);

    return hull;
}

function orientation(p, q, r) {
    var val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

    if (val == 0) {
        return 0;
    }
    return (val > 0) ? 1 : 2;
}