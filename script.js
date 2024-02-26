const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;
let currentStroke = -1;
let strokes = [];
let isMouseDown = false;

canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    isMouseDown = true;
    drawStart(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
});

canvas.addEventListener("mousemove", (e) => {
    if (isDrawing && isMouseDown) {
        draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
    }
});

canvas.addEventListener("mouseup", () => {
    isMouseDown = false;
    if (isDrawing) {
        isDrawing = false;
        strokes.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        currentStroke++;
    }
});

canvas.addEventListener("mouseleave", () => {
    if (isMouseDown) {
        isMouseDown = false;
        if (isDrawing) {
            isDrawing = false;
            strokes.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
            currentStroke++;
        }
    }
});

function drawStart(x, y) {
    const fontSize = parseInt(document.getElementById("fontSize").value);
    const fontColor = document.getElementById("fontColor").value;

    ctx.lineWidth = fontSize;
    ctx.strokeStyle = fontColor;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(x, y) {
    ctx.lineTo(x, y);
    ctx.stroke();
}

function clearSignature() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes = [];
    currentStroke = -1;
}

function undo() {
    if (currentStroke >= 0) {
        ctx.putImageData(strokes[currentStroke], 0, 0);
        currentStroke--;
    }
}

function redo() {
    if (currentStroke < strokes.length - 1) {
        currentStroke++;
        ctx.putImageData(strokes[currentStroke], 0, 0);
    }
}

function saveSignature() {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "signature.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
