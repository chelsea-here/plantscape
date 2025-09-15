import { getScale } from "./getScale";

/**
 * Draws grid lines for the garden bed.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} bedLength - Number of columns (horizontal segments)
 * @param {number} bedDepth - Number of rows (vertical segments)
 * @param {object} bedSize - Object with { bedLength, bedDepth }
 */
export function drawGrid(ctx, bedLength, bedDepth, bedSize) {
  console.log("getScale received bedSize:", bedSize);
  const { scale, scaledWidth, scaledHeight } = getScale(bedSize);

  const verticalSpacing = scaledWidth / bedLength;
  const horizontalSpacing = scaledHeight / bedDepth;

  ctx.strokeStyle = "gray";
  ctx.lineWidth = 1;

  // Draw vertical lines
  for (let i = 1; i < bedLength; i++) {
    const x = i * verticalSpacing;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, scaledHeight);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let j = 1; j < bedDepth; j++) {
    const y = j * horizontalSpacing;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(scaledWidth, y);
    ctx.stroke();
  }
}
