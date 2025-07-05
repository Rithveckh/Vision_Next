export function renderPredictions(predictions, ctx) {
  predictions.forEach(prediction => {
    const [x, y, width, height] = prediction.bbox;  // Box position
    const text = prediction.class;                  // Label name

    // Draw the bounding box
    ctx.strokeStyle = "#00FF00";    // Green box
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    // Draw the label
    ctx.fillStyle = "#00FF00";      // Green text
    ctx.font = "16px Arial";
    ctx.fillText(text, x, y > 10 ? y - 5 : 10); // Above the box
  });
}
