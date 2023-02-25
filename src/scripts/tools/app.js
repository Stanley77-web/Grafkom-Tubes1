// /* ##################################### App ##################################### */
function app() {
    var modeElmnt       = document.getElementById("menumode");
    var mode            = modeElmnt.value;
    var shapeElmnt      = document.getElementById("menushape"); 
    var clearButton     = document.getElementById("clearButton");  

    modeElmnt.addEventListener("change", (e) => {
        mode            = e.target.value;

        if (mode == "move") {
            document.getElementById("width").style.height                   = "74px";
            document.getElementById("similarity").style.display             = "inline-block";
            document.getElementById("similarity-label").style.display       = "inline-block";
            document.getElementById("number-picker").style.display          = "none";
            document.getElementById("number-picker-label").style.display    = "none";
            document.getElementById("menuspecial").style.display            = "none";
            document.getElementById("menuspecial-label").style.display      = "none";
        } else if (shapeElmnt.value == "polygon" && mode == "draw") {
            document.getElementById("width").style.height                   = "40px";
            document.getElementById("number-picker").style.display          = "block";
            document.getElementById("number-picker-label").style.display    = "block";
            document.getElementById("similarity").style.display             = "none";
            document.getElementById("similarity-label").style.display       = "none";
            document.getElementById("menuspecial").style.display            = "none";
            document.getElementById("menuspecial-label").style.display      = "none";
        } else {
            document.getElementById("width").style.height                   = "98px";
            document.getElementById("number-picker").style.display          = "none";
            document.getElementById("number-picker-label").style.display    = "none";
            document.getElementById("similarity").style.display             = "none";
            document.getElementById("similarity-label").style.display       = "none";
            document.getElementById("menuspecial").style.display            = "none";
            document.getElementById("menuspecial-label").style.display      = "none";
        }
    })

    drawMode();
    moveMode();
    paintMode();
    selectMode();
    resizeMode();
    // rotateMode();
    

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
            if (e.target.value == "polygon" && mode == "draw") {
                document.getElementById("width").style.height                 = "40px";
                document.getElementById("number-picker").style.display        = "block";
                document.getElementById("number-picker-label").style.display  = "block";
            } else {
                document.getElementById("width").style.height                 = "98px";
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
                    var convexPoint = getConvexHull(shape.vertices);
                    console.log(convexPoint);
                    console.log(shape.vertices);
                    if (convexPoint.length != shape.vertices.length) {
                        for (var i = 0; i < shape.vertices.length - convexPoint.length; i++) {
                            shape.vertices.pop();
                            shape.colors.pop();
                            nodeDrawed--;
                        }   
                        return;
                    }
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

        var vertex, inside, line, initialPos;

        canvas.addEventListener("mousedown", (e) => {
            if (mode != "move") return;

            var positon    = getPosition(canvas, e);
            
            vertex         = getNearestVertice(positon);
            inside         = getNearestInsideShape(positon);
            line           = getNearestShapeLine(positon);
            
            if (!vertex && !inside && !line) return;

            if (inside)
                initialPos  = positon

            moving          = true;
        })

        canvas.addEventListener("mousemove", (e) => {
            if (mode != "move") return;
            
            if (moving) {
                if (vertex)  {
                    var positon     = getPosition(canvas, e);
                    var shape       = shapeBuffer.findById(vertex.shapePos);
                    var vertexPos   = vertex.vertexPos;

                    if (similarityElmnt.checked) {
                        shape.setVertice(positon, vertexPos)
                    } else {
                        shape.vertices[vertexPos]    = positon;
                    }
                } else if (line) {
                    var position    = getPosition(canvas, e);
                    var shape       = shapeBuffer.findById(line.shapePos);
                    var linePos     = line.linePos;

                    if (shape.vertices[linePos[0]].x == shape.vertices[linePos[1]].x) {
                        shape.vertices[linePos[0]].x = position.x;
                        shape.vertices[linePos[1]].x = position.x;
                    } else if (shape.vertices[linePos[0]].y == shape.vertices[linePos[1]].y) {
                        shape.vertices[linePos[0]].y = position.y;
                        shape.vertices[linePos[1]].y = position.y;
                    }
                } else {
                    var positon     = getPosition(canvas, e);
                    var shape       = shapeBuffer.findById(inside.shapePos);

                    var dx          = positon.x - initialPos.x;
                    var dy          = positon.y - initialPos.y;
    
                    shape.move(dx, dy)
                    initialPos     = positon;
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
            var newColor    = getColor();

            var vertex      = getNearestVertice(positon);
            var inside      = getNearestInsideShape(positon);
            
            if (vertex) {
                var shape       = shapeBuffer.findById(vertex.shapePos);

                shape.colors[vertex.vertexPos]   = newColor;
            } else if (inside) {
                var shape       = shapeBuffer.findById(inside.shapePos);

                shape.colors.forEach(color => {
                    color.r = newColor.r;
                    color.g = newColor.g;
                    color.b = newColor.b;
                    color.a = newColor.a;
                })
            }
        })
    }

    function selectMode() {
        var menuSecialElmt     = document.getElementById("menuspecial");
        var menuSpecial        = menuSecialElmt.value;

        var selected;
        var shapeSelected;

        menuSecialElmt.addEventListener("change", (e) => {
            menuSpecial     = e.target.value;
        })

        canvas.addEventListener("click", (e) => {
            if (mode != "select") return;

            var positon     = getPosition(canvas, e);
            var inside       = getNearestInsideShape(positon);

            if (selected) {
                if (menuSpecial == "add") {
                    var color      = getColor();

                    shapeSelected.vertices.push(positon)
                    shapeSelected.colors.push(color)               
                } else {
                    var vertex      = getNearestVertice(positon);

                    if (!vertex) return;
    
                    shapeSelected.vertices.splice(vertex.vertexPos, 1);
                    shapeSelected.colors.splice(vertex.vertexPos, 1);

                }
                selected    = false;
                return;
            }

            if (!inside) return;
            
            shapeSelected   = shapeBuffer.findById(inside.shapePos);

            if (shapeSelected.type == "polygon") {
                selected        = true;
                document.getElementById("width").style.height               = "43.4px";
                document.getElementById("menuspecial-label").style.display  = "block";
                document.getElementById("menuspecial").style.display        = "block";
            } else {
                document.getElementById("width").style.height               = "98px";
                document.getElementById("menuspecial-label").style.display  = "none";
                document.getElementById("menuspecial").style.display        = "none";
            }
        })

    }

    function resizeMode() {
        var resizing        = false;
        var vertex;
        var shape;

        canvas.addEventListener("mousedown", (e) => {
            if (mode != "resize") return;

            var positon     = getPosition(canvas, e);
            
            vertex          = getNearestVertice(positon);

            if (!vertex) return;

            shape           = shapeBuffer.findById(vertex.shapePos);

            resizing        = true;
        })

        canvas.addEventListener("mousemove", (e) => {
            if (mode != "resize") return;

            if (resizing) {
                var position    = getPosition(canvas, e);
                var vertexPos   = vertex.vertexPos;

                var center     = getCenter(shape)

                var scale      = euclideanDistance(position, center) / 
                                 euclideanDistance(shape.vertices[vertexPos], center);

                shape.resize(center, scale)
            }
        })

        canvas.addEventListener("mouseup", (e) => {
            if (mode != "resize") return;

            resizing        = false;
        })
    }
    // bug
    // function rotateMode() {
    //     var rotating        = false;
    //     var shape;

    //     canvas.addEventListener("mousedown", (e) => {
    //         if (mode != "rotate") return;

    //         var positon     = getPosition(canvas, e);
    //         var inside      = getNearestInsideShape(positon);

    //         if (!inside) return;

    //         shape           = shapeBuffer.findById(inside.shapePos);

    //         rotating        = true;
    //     })

    //     canvas.addEventListener("mousemove", (e) => {
    //         if (mode != "rotate") return;

    //         if (rotating) {
    //             var positon     = getPosition(canvas, e);
    //             var center      = getCenter(shape)

    //             console.log(center)

    //             var dx          = positon.x - center.x;
    //             var dy          = positon.y - center.y;

    //             var angleRad    = Math.atan2(dy, dx);
    //             angleRad        = (((angleRad + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;

    //             shape.vertices.forEach(vertice => {
    //                 var distance   = euclideanDistance(vertice, center);
    //                 angleRad       = Math.atan2(vertice.y - center.y, vertice.x - center.x) + angleRad;
    //                 var angleDeg   = (((angleRad + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
                    
    //                 vertice.x      = center.x + distance * Math.cos(angleDeg);
    //                 vertice.y      = center.y + distance * Math.sin(angleDeg);
    //             })

    //         }
    //     })

    //     canvas.addEventListener("mouseup", (e) => {
    //         if (mode != "rotate") return;

    //         rotating        = false;
    //     })
    // }
}