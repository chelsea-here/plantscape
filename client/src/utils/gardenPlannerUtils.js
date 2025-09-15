// min number of columns (vertical) per style
export function getMinCols(style) {
  if (style === "modern") return 3;
  if (style === "classical") return 4;
  if (style === "cottage") return 3;
  return 3;
}

export function calculateCols(bedLengthFt, style) {
  let cols = getMinCols(style);

  if (style === "modern" && cols % 2 === 0) cols += 1;
  if (style === "classical" && cols % 2 !== 0) cols += 1;

  const maxDiameterFt = bedLengthFt / cols;
  return { cols, maxDiameterFt };
}

export function getDensityBuffer(density) {
  if (density === "lush") return 1.0;
  if (density === "balanced") return 1.2;
  if (density === "open") return 1.4;
  return 1.2;
}

export function filterPlants(plantList, maxDiameterFt, light, style) {
  return plantList.filter(
    (plant) =>
      plant.diameterFt <= maxDiameterFt &&
      plant.light.includes(light) &&
      plant.style.includes(style)
  );
}
