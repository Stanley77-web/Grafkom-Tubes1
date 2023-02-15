/* ################################## Program ################################### */
async function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    var program = gl.createProgram();
    var vertexShader = await createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = await createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);

    async function createShader(gl, type, source) {
        var shaderSource = await fecthShader(source);
        var shader = gl.createShader(type);
        
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        
        if (success) {
            return shader;
        }
    
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    async function fecthShader(source) {
        const response = await fetch('/scripts/shader/' + source);
        return await response.text();
    }
}