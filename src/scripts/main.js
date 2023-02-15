var shapeBuffer;    // Array of shapes
var num             = 0;                    // Number of vertices
var canvas;                                 // Canvas element
var gl;                                     // WebGL context
var program;                                // WebGL program


window.onload = async function main() {
    shapeBuffer = new ShapeBuffer()
    canvas      = document.getElementById('canvas');
    gl          = canvas.getContext('webgl');

    if (!gl) {
        alert('Your browser does not support the canvas element.');
    }

    program = await createProgram(gl, 'vertex-shader.vert', 'fragment-shader.frag');

    app();
    render();
}



