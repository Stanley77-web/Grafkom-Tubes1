// /* ##################################### App ##################################### */
function app() {
    var modeElmnt       = document.getElementById("menumode");
    var mode            = modeElmnt.value;

    modeElmnt.addEventListener("change", (e) => {
        mode            = e.target.value;
    })

    drawMode();
    moveMode();

    
    function drawMode() {
        var shapeElmnt          = document.getElementById("menushape"); 

        var nodePolygonElmt     = document.getElementById("nodePolygon");
        var nodePolygon         = nodePolygonElmt.value;
        var nodeDrawed          = 0;

        var drawing             = false;

        var shape;

        shapeElmnt.addEventListener("change", (e) => {
            if (e.target.value == "polygon") {
                document.getElementById("nodePolygon").style.display        = "block";
                document.getElementById("nodePolygon-label").style.display  = "block";
            } else {
                document.getElementById("nodePolygon").style.display        = "none";
                document.getElementById("nodePolygon-label").style.display  = "none";
            }
        })

        nodePolygonElmt.addEventListener("change", (e) => {
            nodePolygon     = e.target.value;
        })

        canvas.addEventListener("mouseup", (e) => {
            console.log(nodeDrawed)
            if (mode != "draw") return;

            var positon     = getPosition(canvas, e);
            var color       = getColor();
            console.log(shapeElmnt.value)
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
                } 

                shape.vertices.push(positon);
                shape.colors.push(color);

                if (!drawing) {
                    drawing     = true;
                } else {
                    drawing    = false;
                }

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
    }

    function moveMode() {
        var moving             = false;
        var vertex;

        canvas.addEventListener("mousedown", (e) => {
            if (mode != "move") return;

            var positon    = getPosition(canvas, e);
            
            vertex         = getNearestVertices(positon);
            
            if (!vertex) return;

            moving          = true;
        })

        canvas.addEventListener("mousemove", (e) => {
            if (mode != "move") return;
            
            if (moving) {
                var positon     = getPosition(canvas, e);
                var shape       = shapeBuffer.findById(vertex.shapePos);

                shape.vertices[vertex.vertexPos] = positon;
            }
        })

        canvas.addEventListener("mouseup", (e) => {
            if (mode != "move") return;

            moving          = false;
        })
    }

    function paintMode() {
    }
}
// function app() {
//     var drawElmnt       = document.getElementById("draw");
//     var moveElmt        = document.getElementById("move");
//     var paintElmt       = document.getElementById("paint");
//     var clearElmt       = document.getElementById("clear");

//     var lineElmt        = document.getElementById("line");
//     var squareElmt      = document.getElementById("square");
//     var rectangleElmt   = document.getElementById("rectangle");
//     var polygonElmt     = document.getElementById("polygon");

//     var vertices        = document.getElementsByClassName("vertices");

//     var exportElmt      = document.getElementById("export");
//     var importElmt      = document.getElementById("import");


//     drawElmnt.addEventListener("click", (e) => {
//         reset();
//         e.target.style = "background-color: blue; color: white";
//         drawMode();
//     })

//     moveElmt.addEventListener("click", (e) => {
//         reset();
//         e.target.style = "background-color: blue; color: white";
//         moveMode();
//     })

//     paintElmt.addEventListener("click", (e) => {
//         reset();
//         e.target.style = "background-color: blue; color: white";
//         paintMode();
//     })

//     clearElmt.addEventListener("click", (e) => {
//         reset();
//         clear();
//     })

//     exportElmt.addEventListener("click", (e) => {
//         exportFile();
//     })

//     importElmt.addEventListener("click", (e) => {
//         importFile();
//     })

    
//     function drawMode() {
//         lineElmt        = document.getElementById("line");
//         squareElmt      = document.getElementById("square");
//         rectangleElmt   = document.getElementById("rectangle");
//         polygonElmt     = document.getElementById("polygon");

//         var drawing     = false;

//         lineElmt.addEventListener("click", (e) => {         
//              /* TODO: Implement */
//         })  

//         squareElmt.addEventListener("click", (e) => {
//             /* TODO: Implement */
//         })

//         rectangleElmt.addEventListener("click", (e) => {
//             /* TODO: Implement */
//         })


//         polygonElmt.addEventListener("click", (e) => {
          
//             reset();
//             e.target.style      = "background-color: blue; color: white";
            
//             vertices[0].style   = "display: block";
//             vertices[1].style   = "display: block";

//             var shape           = new Polygon(num, gl, program);

//             console.log(shape);
            
//             canvas.onmousedown = (e) => {
//                 var mousePos    = getPositon(canvas, e);
//                 var color       = getColor();
//                 var numVertices = vertices[1].value;
//                 console.log(shape);
//                 console.log(numVertices);


//                 if (shape.vertices.length < numVertices) {
//                     shape.vertices.push(mousePos);
//                     shape.colors.push(color);
    
//                     shapes.push(shape);

//                     drawing  = true;
//                 } else {
//                     shape = new Polygon(num, gl, program);
//                     drawing = false;
//                 }
//             }

//             canvas.onmousemove = (e) => {
//                 var mousePos    = getPositon(canvas, e);
//                 var color       = getColor();

//                 if (drawing) {
//                     shape.vertices[1]   = mousePos;
//                     shape.colors[1]     = color;
//                 }
//             }
//         })

//         function reset() {
//             lineElmt.style          = "background-color: white; color: black";
//             squareElmt.style        = "background-color: white; color: black";
//             rectangleElmt.style     = "background-color: white; color: black";
//             polygonElmt.style       = "background-color: white; color: black";
//         }
//     }

//     function moveMode() {
//         /* TODO: Implement */
//     }

//     function paintMode() {
//         /* TODO: Implement */
//     }

//     function clear() {
//         shapes = [];
//     }

//     function exportFile() {
//         /* TODO: Implement */
//     }

//     function importFile() {
//         /* TODO: Implement */
//     }

//     function reset() {
//         drawElmnt.style         = "background-color: white; color: black";
//         moveElmt.style          = "background-color: white; color: black";
//         paintElmt.style         = "background-color: white; color: black";
//         clearElmt.style         = "background-color: white; color: black";

//         lineElmt.style          = "background-color: white; color: black";
//         squareElmt.style        = "background-color: white; color: black";
//         rectangleElmt.style     = "background-color: white; color: black";
//         polygonElmt.style       = "background-color: white; color: black";

//         vertices[0].style       = "display: none";
//         vertices[1].style       = "display: none";
//     }
// }