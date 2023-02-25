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

    draw() {};
    construct() {};
}

/* ################################ Line Model ################################# */
class Line extends Base {
    constructor(id, gl, program) {
        super(id, gl, program);
        this.type       = "line";
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
            {x: x1 , y: y1}
        ];

        this.colors = [
            color_1,
            color_2
        ];
    }

    draw() {
        /* TODO: Implement */
        this.initDraw();

        var primitiveType   = this.gl.LINE_STRIP;
        var offset          = 0;
        var count           = 2;
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
    }

    draw() {
        /* TODO: Implement */
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

    rotate(angle, d) {
        this.vertices.forEach(element => {
            element.x = element.x * Math.cos(angle) - element.y * Math.sin(angle) + d;
            element.y = element.x * Math.sin(angle) + element.y * Math.cos(angle);
        });
    }

    draw() {
        this.initDraw();
        var primitiveType   = this.gl.TRIANGLE_FAN;
        var offset          = 0;
        var count           = this.vertices.length;

        this.gl.drawArrays(primitiveType, offset, count);
    }
}