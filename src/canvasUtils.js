class canvasUtils {
    static line(context2d, x0, y0, x1, y1, strokeStyle = "black", lineWidth = 2) {
        context2d.save();        
        context2d.beginPath();
        context2d.moveTo(x0, y0);
        context2d.lineTo(x1, y1);
        context2d.lineWidth = lineWidth;
        context2d.strokeStyle = strokeStyle;
        context2d.stroke();
        context2d.restore();
    }

    static rect(context2d, x, y, width, height, fillStyle, strokeStyle = "black", lineWidth = 4) {
        context2d.save();
        context2d.beginPath();
        context2d.rect(x, y, width, height);
        context2d.lineWidth = lineWidth;
        context2d.strokeStyle = strokeStyle;
        context2d.fillStyle = fillStyle;
        context2d.stroke();
        context2d.fill();
        context2d.restore();
    }

    static text(context2d, text, x, y, font, strokeStyle = "black", textAlign = "center") {
        context2d.save();   
        context2d.font = font;
        context2d.textAlign = textAlign;
        context2d.textBaseline = "middle";
        context2d.fillStyle = strokeStyle;
        context2d.fillText(text, x, y);
        context2d.restore();
    }

    static circle(context2d, centerX, centerY, radius, fillStyle, strokeStyle = "black", lineWidth = 4) {
        context2d.save();
        context2d.lineWidth = lineWidth;
        context2d.strokeStyle = strokeStyle;
        context2d.fillStyle = fillStyle;
        context2d.beginPath();
        context2d.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        context2d.stroke();
        context2d.fill();
        context2d.restore();
    }

    static getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect()
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        }
    }
};

