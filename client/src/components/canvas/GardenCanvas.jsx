import { useRef, useEffect } from "react";
import { renderGardenBed } from "../../utils/renderGardenBed";
import { getScale } from "../../utils/getScale";

export default function GardenCanvas({ bedData }) {
  const canvasRef = useRef(null);

  const currentBed = bedData;
  const bedSize = currentBed?.bedSize;
  const placedPlants = currentBed?.placedPlants;

  useEffect(() => {
    // Only proceed if we have valid bed data and its necessary properties
    if (!currentBed || !bedSize || !placedPlants) {
      // console.log("GardenCanvas useEffect: Missing currentBed data for rendering.");
      return; // Exit early if data is not ready
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("2D context not available on canvas");
      return;
    }

    const { scaledWidth, scaledHeight } = getScale(bedSize);

    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    ctx.clearRect(0, 0, scaledWidth, scaledHeight);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, scaledWidth, scaledHeight);

    console.log("Calling renderGardenBed with:", currentBed);
    renderGardenBed(ctx, currentBed); // Pass the entire currentBed object if renderGardenBed expects it
  }, [currentBed, bedSize, placedPlants]); // Dependencies: currentBed and its derived properties

  // Render logic: Only show canvas if bedData is available, otherwise nothing (or a specific loading state from MyGardenBed)
  // The "Loading Garden..." message should now come from MyGardenBed.jsx's loadingGardenBeds state.
  if (!currentBed) {
    return null; // Or a very minimal placeholder if needed, but MyGardenBed handles the main loading
  }

  return (
    <canvas
      ref={canvasRef}
      style={{ marginTop: "1rem", border: "1px solid #ccc", display: "block" }}
    />
  );
}
