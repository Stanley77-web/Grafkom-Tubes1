// /* ##################################### App ##################################### */
function app() {
    var modeElmnt       = document.getElementById("menumode");
    var mode            = modeElmnt.value;
    var shapeElmnt      = document.getElementById("menushape"); 
    var clearButton          = document.getElementById("clearButton");

    modeElmnt.addEventListener("change", (e) => {
        mode            = e.target.value;

        if (mode == "move") {
            document.getElementById("width").style.height              = shapeElmnt.value == "polygon" ? "16px" : "74px";
            document.getElementById("similarity").style.display        = "inline-block";
            document.getElementById("similarity-label").style.display  = "inline-block";
        } else {
            document.getElementById("width").style.height              = shapeElmnt.value == "polygon" ? "40px" : "98px";
            document.getElementById("similarity").style.display        = "none";
            document.getElementById("similarity-label").style.display  = "none";
        }
    })

    drawMode();
    moveMode();
    paintMode();

    clearButton.addEventListener("click", (e) => {
        shapeBuffer.clear();
        num         = 0;
    })

    function drawMode() {
        var nodePolygonElmt     = document.getElementById("number-picker");
        var nodePolygon         = nodePolygonElmt.value;
        var nodeDrawed          = 0;

        var drawing             = false;

        var shape;

        shapeElmnt.addEventListener("change", (e) => {
            if (e.target.value == "polygon") {
                document.getElementById("width").style.height                 = mode == "move" ? "16px" : "40px";
                document.getElementById("number-picker").style.display        = "block";
                document.getElementById("number-picker-label").style.display  = "block";
            } else {
                document.getElementById("width").style.height                 = mode == "move" ? "74px" : "98px";
                document.getElementById("number-picker").style.display        = "none";
                document.getElementById("number-picker-label").style.display  = "none";
            }
        })

        nodePolygonElmt.addEventListener("change", (e) => {
            nodePolygon     = e.target.value;
        })

        canvas.addEventListener("mousedown", (e) => {
            if (mode != "draw") return;

            var positon     = getPosition(canvas, e);
            var color       = getColor();

            if (shapeElmnt.value == "polygon") {
                if (!drawing) {
                    shape       = new Polygon(num, gl, program)
                    shapeBuffer.add(shape);
                    drawing     = true;
                    num++;
                } 
                
                if (shape.vertices.length < nodePolygon) {
                    shape.vertices.push(positon);
                    shape.colors.push(color);

                    nodeDrawed++;
                } else {
                    drawing     = false;
                    nodeDrawed  = 0;
                }
            } else {
                switch (shapeElmnt.value) {
                    case "line":
                        shape       = new Line(num, gl, program);
                        break;
                    case "square":
                        shape       = new Square(num, gl, program);
                        break;
                    case "rectangle":
                        shape       = new Rectangle(num, gl, program);
                        break;
                }

                if (!drawing) {
                    shapeBuffer.add(shape);
                    num++;
                    drawing    = true;
                } 

                shape.vertices.push(positon);
                shape.colors.push(color);
            }
        })

        canvas.addEventListener("mousemove", (e) => {
            if (mode != "draw") return;

            var positon     = getPosition(canvas, e);
            var color       = getColor();

            if (shapeElmnt.value == "polygon") {
                if (drawing) {
                    shape.vertices[nodeDrawed]  = positon;
                    shape.colors[nodeDrawed]    = color;
                }
            } else {
                if (drawing) {
                    shape.vertices[1]           = positon;
                    shape.colors[1]             = color;
                    shape.construct();
                }
            }
        })

        canvas.addEventListener("mouseup", (e) => {
            if (mode != "draw") return;
            if (shapeElmnt.value == "polygon") return;
            drawing         = false;
        })
    }

    function moveMode() {
        var moving             = false;

        var similarityElmnt    = document.getElementById("similarity");

        var vertex, inside, initialPos;

        canvas.addEventListener("mousedown", (e) => {
            if (mode != "move") return;

            var positon    = getPosition(canvas, e);
            
            vertex         = getNearestVertice(positon);
            inside         = getNearestInsideShape(positon);
            
            if (!vertex && !inside) return;

            if (inside)
                initialPos  = positon

            moving          = true;
        })

        canvas.addEventListener("mousemove", (e) => {
            if (mode != "move") return;
            
            if (moving) {
                if (!vertex) {
                    var positon     = getPosition(canvas, e);
                    var shape       = shapeBuffer.findById(inside.shapePos);

                    var dx          = positon.x - initialPos.x;
                    var dy          = positon.y - initialPos.y;
    
                    shape.vertices.forEach(vertice => {
                        vertice.x   += dx;
                        vertice.y   += dy;
                    });
                    initialPos     = positon;

                } else {
                    var positon     = getPosition(canvas, e);
                    var shape       = shapeBuffer.findById(vertex.shapePos);
                    var vertexPos   = vertex.vertexPos;

                    if (similarityElmnt.checked && shape.type != "line") {
                        var vertice     = shape.vertices[vertexPos];

                        var dx          = positon.x - vertice.x;
                        var dy          = positon.y - vertice.y;

                        var xMove       = ((vertexPos + ((vertexPos%2)? -1 :  1)) + 4) % 4;
                        var yMove       = ((vertexPos + ((vertexPos%2)?  1 : -1)) + 4) % 4;
                        
                        shape.vertices[xMove].x += dx;

                        shape.vertices[vertexPos].x += dx;
                        shape.vertices[vertexPos].y += dy;

                        shape.vertices[yMove].y += dy;   
                    } else {
                        shape.vertices[vertexPos]    = positon;
                    }
                }
            }
        })

        canvas.addEventListener("mouseup", (e) => {
            if (mode != "move") return;

            moving          = false;
        })
    }

    function paintMode() {
        canvas.addEventListener("click", (e) => {
            if (mode != "paint") return;

            var positon     = getPosition(canvas, e);
            var color       = getColor();

            var vertex      = getNearestVertice(positon);
            var inside      = getNearestInsideShape(positon);
            
            if (vertex) {
                var shape       = shapeBuffer.findById(vertex.shapePos);

                shape.colors[vertex.vertexPos]   = color;
            } else if (inside) {
                var shape       = shapeBuffer.findById(inside.shapePos);

                shape.colors.forEach((_, i) => {
                    shape.colors[i] = color;
                });
            }
        })
    }
}