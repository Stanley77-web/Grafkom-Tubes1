document.getElementById("save").onclick = () => {
    saveFile(`save_(${new Date()}}).json`);
}

document.getElementById("load").onchange = (e) => {
    loadFile(e);
}

function saveFile(filename, contentType = "json") {
    var content     = JSON.stringify(shapeBuffer);
    console.log(shapeBuffer);
    var a           = document.createElement("a");
    var file        = new Blob([content], {type: contentType});
    a.href          = URL.createObjectURL(file);
    a.download      = filename;
    a.click();
    URL.revokeObjectURL(a.href);
}

function loadFile() {
    var loadElmt    = document.getElementById("load");
    var file        = loadElmt.files[0];
    var reader      = new FileReader();
    shapeBuffer     = new ShapeBuffer();
    reader.addEventListener("load", function(e) {
        var rawBuffer = JSON.parse(e.target.result).buffer;

        rawBuffer.forEach((shape) => {
            switch (shape.type) {
                case "line":
                    var line = new Line(shape.id, gl, program);
                    line.vertices   = shape.vertices;
                    line.colors     = shape.colors;
                    shapeBuffer.add(line);
                    break;
                case "square":
                    var square = new Square(shape.id, gl, program);
                    square.vertices = shape.vertices;
                    square.colors   = shape.colors;
                    shapeBuffer.add(square);
                    break;
                case "rectangle":
                    var rectangle = new Rectangle(shape.id, gl, program);
                    rectangle.vertices  = shape.vertices;
                    rectangle.colors    = shape.colors;
                    shapeBuffer.add(rectangle);
                    break;
                case "polygon":
                    var polygon = new Polygon(shape.id, gl, program);
                    polygon.vertices    = shape.vertices;
                    polygon.colors      = shape.colors;
                    shapeBuffer.add(polygon);
                    break;
            }
        })
    });
    reader.readAsBinaryString(file);
}