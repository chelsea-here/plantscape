/**
 * Returns the scale (pixels per foot) and derived dimensions
 * @param {Object} bedSize - { bedLength: number, bedDepth: number }
 * @returns {Object} - { scale, scaledWidth, scaledHeight }
 */
export function getScale(bedSize) {
  if (
    !bedSize ||
    typeof bedSize.bedLength !== "number" ||
    typeof bedSize.bedDepth !== "number"
  ) {
    console.warn("Invalid or missing bedSize passed to getScale:", bedSize);
    return { scale: 0, scaledWidth: 0, scaledHeight: 0 };
  }

  const scale = bedSize.bedLength > 8 ? 60 : 80;
  const scaledWidth = bedSize.bedLength * scale;
  const scaledHeight = bedSize.bedDepth * scale;

  return { scale, scaledWidth, scaledHeight };
}
