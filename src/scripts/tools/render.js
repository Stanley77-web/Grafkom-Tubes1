/* ############################### Render Screen ################################ */
function render() {
    gl.canvas.width                = ( 9/12) * window.innerWidth;
    gl.canvas.height               = (12/12) * window.innerWidth;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.8, 0.8, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    shapeBuffer.draw();

    window.requestAnimationFrame(render, 10000/60);
}