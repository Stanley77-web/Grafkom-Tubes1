/* ################################ Base Model ################################# */
class Base {
    id;
    gl;
    type;
    program;
    vertices;
    colors;

    constructor(id, gl, program) {
        this.id = id;
        this.gl = gl;
        this.program = program;
    }

    flatten() {
        var flatVertices    = [];
        var flatColors      = [];

        this.vertices.forEach(element => {
            flatVertices.push(element.x);
            flatVertices.push(element.y);
        });

        this.colors.forEach(element => {
            flatColors.push(element.r);
            flatColors.push(element.g);
            flatColors.push(element.b);
            flatColors.push(element.a);
        });
        return {
            vertices: new Float32Array(flatVertices),
            colors: new Float32Array(flatColors)
        }
    }

    bindBufferData(gl_buffer, data) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, gl_buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
    };

    setVertexAttribPointer(gl_att, gl_buffer, size) {
        this.gl.enableVertexAttribArray(gl_att);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, gl_buffer)

        var size       = size;
        var type       = this.gl.FLOAT;
        var normalize  = false;
        var stride     = 0;
        var offset     = 0;
        this.gl.vertexAttribPointer(gl_att, size, type, normalize, stride, offset);
    };

    initDraw() {
        var positionAttributeLocation   = this.gl.getAttribLocation(this.program, 'a_position');
        var colorAttributeLocation      = this.gl.getAttribLocation(this.program, 'a_color');
    
        var positionBuffer              = this.gl.createBuffer();
        var colorBuffer                 = this.gl.createBuffer();

        var flatData                    = this.flatten();

        this.bindBufferData(positionBuffer, flatData.vertices);
        this.bindBufferData(colorBuffer, flatData.colors);

        this.setVertexAttribPointer(positionAttributeLocation, positionBuffer, 2);
        this.setVertexAttribPointer(colorAttributeLocation, colorBuffer, 4);
    }

    construct() {};
    setVertice(newPos, vertexPos) {};
    setLine(newPos, linePos) { };
    move(dx, dy) {
        this.vertices.forEach(element => {
            element.x += dx;
            element.y += dy;
        });
    };
    resize(center, scale) {
        this.vertices.forEach(vertice => {
            vertice.x = center.x + (vertice.x - center.x) * scale;
            vertice.y = center.y + (vertice.y - center.y) * scale;
        });
    };
    rotate(center, angle) {
        this.vertices.forEach(vertice => {
            var dx      = vertice.x - center.x;
            var dy      = vertice.y - center.y;

            var x       = center.x + dx * Math.cos(angle) - dy * Math.sin(angle);
            var y       = center.y + dx * Math.sin(angle) + dy * Math.cos(angle);

            vertice.x    = x;
            vertice.y    = y;
        });
    };
    draw() {};
}

/* ################################ Line Model ################################# */
class Line extends Base {
    constructor(id, gl, program) {
        super(id, gl, program);
        this.type       = "line";
        this.vertices   = [];
        this.colors     = [];
    }

    construct() {}

    setVertice(newPos, vertexPos) {
        this.vertices[vertexPos] = newPos;
    }

    draw() {
        this.initDraw();

        var primitiveType   = this.gl.LINES;
        var offset          = 0;
        var count           = this.vertices.length;
        
        this.gl.drawArrays(primitiveType, offset, count);
    }
}

/* ############################## Square Model ############################### */
class Square extends Base {
    constructor(id, gl, program) {
        super(id, gl, program);
        this.type       = "square";
        this.vertices   = [];
        this.colors     = [];
    }

    construct() {
        const x0    = this.vertices[0].x;
        const y0    = this.vertices[0].y;
        const x1    = this.vertices[1].x;
        const y1    = this.vertices[1].y;

        var dx      = x1 - x0;
        var dy      = y1 - y0;

        var minxy   = Math.min(Math.abs(dx), Math.abs(dy));

        var dx      = dx > 0 ? minxy : -minxy;
        var dy      = dy > 0 ? minxy : -minxy;

        var color_1 = this.colors[0];
        var color_2 = this.colors[0];


        this.vertices = [
            {x: x0     , y: y0     },   
            {x: x0     , y: y0 + dy},
            {x: x0 + dx, y: y0 + dy},
            {x: x0 + dx, y: y0     }
        ]

        this.colors = [
            color_1,
            color_1,
            color_2,
            color_2
        ]
    }

    setVertice(newPos, vertexPos) {
        var anchor      = this.vertices[(vertexPos + 2) % 4];

        var dx          = newPos.x - anchor.x;
        var dy          = newPos.y - anchor.y;

        var minxy   = Math.min(Math.abs(dx), Math.abs(dy));
        
        dx          = dx > 0 ? minxy : -minxy;
        dy          = dy > 0 ? minxy : -minxy;        

        var xNew        = ((vertexPos + ((vertexPos%2)? -1 :  1)) + 4) % 4;
        var yNew        = ((vertexPos + ((vertexPos%2)?  1 : -1)) + 4) % 4;

        var newCorner   = {
            x: anchor.x + dx,
            y: anchor.y + dy
        }
        
        this.vertices[xNew].x = newCorner.x;

        this.vertices[vertexPos].x = newCorner.x;
        this.vertices[vertexPos].y = newCorner.y;

        this.vertices[yNew].y = newCorner.y;; 
    }

    setLine(newPos, linePos) {
        var dx, dy;
        if (this.vertices[linePos[0]].x == this.vertices[linePos[1]].x) {
            var opposite     = (linePos[0] + 2) % 4;
            dx  = newPos.x - this.vertices[linePos[0]].x;
            dy  = dx

            this.vertices[linePos[0]].x  += dx;

            this.vertices[linePos[1]].x  += dx;
            this.vertices[linePos[1]].y  += dy;
    
            this.vertices[opposite].y    += dy;
        } else if (this.vertices[linePos[0]].y == this.vertices[linePos[1]].y) {
            var opposite     = (linePos[0] + 2) % 4;
            dy = newPos.y - this.vertices[linePos[0]].y;
            dx = dy;

            this.vertices[linePos[0]].y  += dy;

            this.vertices[linePos[1]].y  += dy;
            this.vertices[linePos[1]].x  -= dx;
    
            this.vertices[opposite].x    -= dx;
        }
        

    }


    draw() {
        this.initDraw();

        var primitiveType   = this.gl.TRIANGLE_FAN;
        var offset          = 0;
        var count           = 4;

        this.gl.drawArrays(primitiveType, offset, count);
    }
}

/* ########################### Rectangle Model ############################## */
class Rectangle extends Base {
    constructor(id, gl, program) {
        super(id, gl, program);
        this.type       = "rectangle";  
        this.vertices   = [];
        this.colors     = [];
    }

    construct() {
        const x0    = this.vertices[0].x;
        const y0    = this.vertices[0].y;
        const x1    = this.vertices[1].x;
        const y1    = this.vertices[1].y;

        var color_1 = this.colors[0];
        var color_2 = this.colors[0];

        this.vertices = [
            {x: x0 , y: y0},
            {x: x0 , y: y1},
            {x: x1 , y: y1},
            {x: x1 , y: y0}
        ]

        this.colors = [
            color_1,
            color_1,
            color_2,
            color_2
        ]
    }

    setVertice(newPos, vertexPos) {
        var newX       = ((vertexPos + ((vertexPos%2)? -1 :  1)) + 4) % 4;
        var newY       = ((vertexPos + ((vertexPos%2)?  1 : -1)) + 4) % 4;

        this.vertices[newX].x      = newPos.x;

        this.vertices[vertexPos].x = newPos.x;
        this.vertices[vertexPos].y = newPos.y;

        this.vertices[newY].y      = newPos.y;;    
    }

    setLine(newPos, linePos) {
        if (this.vertices[linePos[0]].x == this.vertices[linePos[1]].x) {
            this.vertices[linePos[0]].x = newPos.x;
            this.vertices[linePos[1]].x = newPos.x;
        } else if (this.vertices[linePos[0]].y == this.vertices[linePos[1]].y) {
            this.vertices[linePos[0]].y = newPos.y;
            this.vertices[linePos[1]].y = newPos.y;
        }
    }

    draw() {
        this.initDraw();

        var primitiveType   = this.gl.TRIANGLE_FAN;
        var offset          = 0;
        var count           = 4;

        this.gl.drawArrays(primitiveType, offset, count);
    }
}

/* ############################ Polygon Model ############################### */
class Polygon extends Base {
    constructor(id, gl, program) {
        super(id, gl, program);
        this.type       = "polygon";
        this.vertices   = [];
        this.colors     = [];
    }

    setVertice(newPos, vertexPos) {
        if (this.vertices.length < 3) {
            this.vertices[vertexPos] = newPos;
        }

        var dx         = newPos.x - this.vertices[vertexPos].x;
        var dy         = newPos.y - this.vertices[vertexPos].y;

        var newX       = ((vertexPos + ((vertexPos%2)? -1 :  1)) + 4) % 4;
        var newY       = ((vertexPos + ((vertexPos%2)?  1 : -1)) + 4) % 4;

        this.vertices[newX].x      += dx;

        this.vertices[vertexPos].x += dx;
        this.vertices[vertexPos].y += dy;

        this.vertices[newY].y      += dy;  
    }

    draw() {
        this.initDraw();
        var primitiveType   = this.gl.TRIANGLE_FAN;
        var offset          = 0;
        var count           = this.vertices.length;

        this.gl.drawArrays(primitiveType, offset, count);
    }
}