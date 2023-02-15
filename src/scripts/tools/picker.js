/* ############################## Postion Picker ################################ */
function getPosition(canvas, e) {
    var rect    = canvas.getBoundingClientRect();
    var clientX = e.clientX;
    var clientY = e.clientY;

    return {
        x: (2 * (clientX - rect.left) - canvas.width) / canvas.width,
        y: (canvas.height - 2 * (clientY - rect.top)) / canvas.height
    }
}

/* ############################### Color Picker ################################# */
function getColor() {
    var colorPicker = document.getElementById("color-picker");
    var color       = colorPicker.value;

    return hexToRgb(color);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: (parseInt(result[1], 16)/255.0),
        g: (parseInt(result[2], 16)/255.0),
        b: (parseInt(result[3], 16)/255.0),
        a: 1.0
    } : null;
}