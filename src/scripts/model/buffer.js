class ShapeBuffer {
    buffer;

    constructor() {
        this.buffer = [];
    }
    
    add(shape) {
        this.buffer.push(shape);
    }

    remove(shape) {
        this.buffer = this.buffer.filter(element => element.id != shape.id);
    }

    find(shape) {
        return this.buffer.find(element => element.id == shape.id);
    }

    findById(id) {
        return this.buffer.find(element => element.id == id);
    }

    clear() {
        this.buffer = [];
    }

    draw() {
        this.buffer.forEach(element => {
            element.draw();
        });
    }
}