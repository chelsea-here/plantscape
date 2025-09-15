import { drawGrid } from "./canvasDrawGrid";
import { animatePlants } from "./canvasAnimatePlants";
import { getScale } from "../utils/getScale";

export function renderGardenBed(ctx, activeBed) {
  if (!activeBed?.bedSize || !activeBed?.placedPlants) return;

  const { bedSize, placedPlants } = activeBed;
  const { bedLength, bedDepth } = bedSize;
  console.log("getScale received bedSize:", bedSize);
  const { scaledWidth, scaledHeight } = getScale(bedSize);

  console.log("Drawing garden bed:", {
    scaledWidth,
    scaledHeight,
    placedPlants,
  });

  drawGrid(ctx, bedLength, bedDepth, bedSize);
  animatePlants(ctx, bedLength, bedDepth, placedPlants, bedSize); // Pass full activeBed to animatePlants
}
