import { getScale } from "./getScale";

// Expects explicit arguments rather than activeBed
export function animatePlants(ctx, bedLength, bedDepth, placedPlants, bedSize) {
  console.log("getScale received bedSize:", bedSize);
  const { scale, scaledWidth, scaledHeight } = getScale(bedSize);
  const verticalSpacing = scaledWidth / bedLength;
  const horizontalSpacing = scaledHeight / bedDepth;

  let currentPlantIndex = 0;

  function drawAnimatedCircle(
    x,
    y,
    radius,
    strokeColor,
    fillColor,
    onComplete
  ) {
    let startAngle = -Math.PI / 2;
    let endAngle = startAngle;
    const step = 0.2;

    function animateStep() {
      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, endAngle);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      endAngle += step;
      if (endAngle - startAngle < 2 * Math.PI) {
        requestAnimationFrame(animateStep);
      } else {
        fadeInFill();
      }
    }

    let opacity = 0;

    function fadeInFill() {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = convertHexToRgba(fillColor, opacity);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 0.25;
      ctx.stroke();

      if (opacity < 0.7) {
        opacity += 0.05;
        requestAnimationFrame(fadeInFill);
      } else {
        onComplete();
      }
    }

    animateStep();
  }

  function convertHexToRgba(hex, alpha) {
    let c = hex.replace("#", "");
    if (c.length === 3) {
      c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    const bigint = parseInt(c, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function animateNextPlant() {
    if (currentPlantIndex >= placedPlants.length) return;

    const plant = placedPlants[currentPlantIndex++];
    const safeDiameter = Math.max(plant.diameter || 1, 0.1);
    const radius = Math.max((safeDiameter * scale) / 2, 1);
    const x = plant.x * verticalSpacing;
    const y = plant.y * horizontalSpacing;

    if (
      x < 0 ||
      x > scaledWidth ||
      y < 0 ||
      y > scaledHeight ||
      isNaN(x) ||
      isNaN(y)
    ) {
      console.warn("Skipping plant out of bounds:", plant);
      animateNextPlant();
      return;
    }

    const strokeColor = "#363737";
    const fillColor = plant.color || "#228B22";

    drawAnimatedCircle(x, y, radius, strokeColor, fillColor, animateNextPlant);
  }

  animateNextPlant();
}

// import { getScale } from "./getScale";

// export function animatePlants(ctx, activeBed) {
//   if (!activeBed || !activeBed.bedSize || !activeBed.placedPlants) return;

//   const { bedLength, bedDepth } = activeBed.bedSize;
//   const { scale, scaledWidth, scaledHeight } = getScale(activeBed.bedSize);
//   const verticalSpacing = scaledWidth / bedLength;
//   const horizontalSpacing = scaledHeight / bedDepth;

//   const placedPlants = activeBed.placedPlants;
//   let currentPlantIndex = 0;

//   function drawAnimatedCircle(
//     x,
//     y,
//     radius,
//     strokeColor,
//     fillColor,
//     onComplete
//   ) {
//     let startAngle = -Math.PI / 2; // Start at top center
//     let endAngle = startAngle;
//     const step = 0.2; // How much of the circle to draw per frame

//     function animateStep() {
//       ctx.beginPath();
//       ctx.arc(x, y, radius, startAngle, endAngle);
//       ctx.strokeStyle = strokeColor;
//       ctx.lineWidth = 1;
//       ctx.stroke();

//       endAngle += step;
//       if (endAngle - startAngle < 2 * Math.PI) {
//         requestAnimationFrame(animateStep);
//       } else {
//         fadeInFill();
//       }
//     }

//     let opacity = 0;
//     function fadeInFill() {
//       ctx.beginPath();
//       ctx.arc(x, y, radius, 0, 2 * Math.PI);
//       ctx.fillStyle = fillColor;
//       ctx.fill();

//       ctx.beginPath();
//       ctx.arc(x, y, radius, 0, 2 * Math.PI);
//       ctx.strokeStyle = strokeColor;
//       ctx.lineWidth = 0.1;
//       ctx.stroke();

//       if (opacity < 0.7) {
//         opacity += 0.05;
//         requestAnimationFrame(fadeInFill);
//       } else {
//         // Final fill at full opacity
//         ctx.beginPath();
//         ctx.arc(x, y, radius, 0, 2 * Math.PI);
//         ctx.fillStyle = fillColor;
//         ctx.fill();

//         ctx.beginPath();
//         ctx.arc(x, y, radius, 0, 2 * Math.PI);
//         ctx.strokeStyle = strokeColor;
//         ctx.lineWidth = 0.25;
//         ctx.stroke();

//         onComplete();
//       }
//     }

//     animateStep();
//   }

//   function animateNextPlant() {
//     if (currentPlantIndex >= placedPlants.length) return;

//     const plant = placedPlants[currentPlantIndex++];
//     const safeDiameter = Math.max(plant.diameter || 1, 0.1);
//     const radius = Math.max((safeDiameter * scale) / 2, 1);
//     const x = plant.x * verticalSpacing;
//     const y = plant.y * horizontalSpacing;

//     if (
//       x < 0 ||
//       x > scaledWidth ||
//       y < 0 ||
//       y > scaledHeight ||
//       isNaN(x) ||
//       isNaN(y)
//     ) {
//       console.warn("Skipping plant out of bounds:", plant);
//       animateNextPlant();
//       return;
//     }

//     const strokeColor = "#363737" || "green";
//     let transparency = 80;
//     const fillColor = `${plant.color}${80}` || "#228B22";

//     drawAnimatedCircle(x, y, radius, strokeColor, fillColor, animateNextPlant);
//   }

//   animateNextPlant();
// }
