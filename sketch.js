// 1. SETUP
  // We first define the original artwork dimensions for use in resizing the code later
  let originalWidth = 2480, originalHeight = 1758;

  // We then setup a responsive canvas
    function setup() {
     createCanvas(windowWidth, windowHeight);
     initializeData();
    }

// 2. INITIALIZE DATA
  // Now we define the color and shape arrays that we will be implementing in the artwork
   function initializeData() {

  // 2A. COLOR DEFINITIONS
    // We create color arrays for each section of the artwork that can then be called using array indexing
    // We used the Photoshop eyedropper tool to obtain the most prominent color codes in the artwork
    // Sky colors will be implemented in the sky and river
      skyColors = [
        color("#b94224"),
        color("#dc8400"),
        color("#e8c158"),
        color("#81b6ac"), 
        color("#3459a0")  
      ];
      skyColors2 = [
        color("c3c0c7"),
        color("#c6bac8"), 
        color("#a6a7bb"),
        color("#aec0b4"),
        color("#8eb3cd")  
      ];
    // I initialise an empty changing sky color array through which the two sky color arrays will later be interpolated 
    // so that they transition between one another based on the mouse x-position
      changingSkyColor = [];

    // Building colors will be implemented in the primary building and it's reflection in the river
      buildingColors = [
        color('#304754'), 
        color('#762E59'), 
        color('#6F3831')
    ];
      buildingColors2 = [
        color('#849396'), 
        color('#b9a4a1'), 
        color('#878daf')
      ];
      // I then used the same logic and initialised an empty changing building color array
      changingBuildingColor = [];
  
    // We used rgb values instead for the secondary building to allow for a semi-transparent effect
    // I did not extend the color changing to this building as the effect is minimal due to its transparency
      buildingBColors = [
        color(48, 71, 84, 63.5),
        color(118, 46, 89, 63.5),
        color(111, 56, 49, 63.5)
      ];

  // 2B. SHAPE DEFINITIONS
    // We then define the coordinates that outline each section in the artwork so that these created shapes can be filled with lines
    // The sky is segmented into several shapes for visual effect, we must define these shape coordinates individually as we want them to vary in the angles of their diagonal lines:
      skyPointsA = [
        {x: 0, y: 0}, {x: 0, y: 1015}, {x: 62, y: 1015}, {x: 196, y: 0}, {x: 0, y: 0}
      ];
      skyPointsB = [
        {x: 196, y: 0}, {x: 62, y: 1015}, {x: 404, y: 1015}, {x: 404, y: 0}, {x: 196, y: 0}
      ];
      skyPointsC = [
        {x: 404, y: 0}, {x: 404, y: 1015}, {x: 798, y: 1015}, {x: 587, y: 0}
      ];
      skyPointsD = [
        {x: 587, y: 0}, {x: 798, y: 1015}, {x: 1155, y: 1015}, {x: 910, y: 0}, {x: 587, y: 0}
      ];
      skyPointsE = [
        {x: 910, y: 0}, {x: 1155, y: 1015}, {x: 1459, y: 1015}, {x: 1221, y: 0}, {x: 910, y: 0}
      ];
      skyPointsF = [
        {x: 1221, y: 0}, {x: 1459, y: 1015}, {x: 1756, y: 1015}, {x: 1540, y: 0}, {x: 1221, y: 0}
      ];
      skyPointsG = [
        {x: 1540, y: 0}, {x: 1756, y: 1015}, {x: 2044, y: 1015}, {x: 1884, y: 0}, {x: 1540, y: 0}
      ];
      skyPointsH = [
        {x: 1884, y: 0}, {x: 2044, y: 1015}, {x: 2316, y: 1015}, {x: 2114, y: 0}, {x: 1884, y: 0}
      ];
      skyPointsI = [
        {x: 2114, y: 0}, {x: 2316, y: 1015}, {x: 2480, y: 1015}, {x: 2480, y: 0}, {x: 2114, y: 0}
      ];
  
    // We then define the angles at which each of these shapes will display their filled lines
      skyAngles = [
        {points: skyPointsA, angle: PI / -4}, {points: skyPointsB, angle: PI / -6},
        {points: skyPointsC, angle: PI / 9}, {points: skyPointsD, angle: PI / 4},
        {points: skyPointsE, angle: PI / 6}, {points: skyPointsF, angle: PI / 8},
        {points: skyPointsG, angle: PI / 4}, {points: skyPointsH, angle: PI / 3},
        {points: skyPointsI, angle: PI / 6}
      ];

    // We then define the buildings and river coordinates
      buildingPoints = [
        {x: 0, y: 1015},
        {x: 0, y: 897}, 
        {x: 64, y: 897}, {x: 64, y: 812}, {x: 143, y: 738}, {x: 223, y: 762}, {x: 263, y: 655},
        {x: 302, y: 759}, {x: 345, y: 728}, {x: 345, y: 269}, {x: 372, y: 300}, {x: 372, y: 106},
        {x: 401, y: 43}, {x: 467, y: 321}, {x: 467, y: 643}, {x: 535, y: 588}, {x: 535, y: 580},
        {x: 550, y: 515}, {x: 565, y: 540}, {x: 565, y: 588},  {x: 636, y: 648}, {x: 636, y: 725},
        {x: 728, y: 725}, {x: 798, y: 757}, {x: 834, y: 757}, {x: 846, y: 706}, {x: 856, y: 757},
        {x: 938, y: 810}, {x: 938, y: 850}, {x: 1128, y: 879},
        {x: 1240, y: 950}, 
        {x: 1240, y: 1015}, {x: 0, y: 1015},
      ];

      buildingBPoints = [
        {x: 1905, y: 1015}, {x: 2038, y: 721}, {x: 2131, y: 855}, {x: 2189, y: 735},
        {x: 2205, y: 657}, {x: 2227, y: 707}, {x: 2401, y: 1015},
      ];

      riverPoints = [
        {x: 0, y: 1015},
        {x: 2480, y: 1015},
        {x: 2480, y: 1758},
        {x: 0, y: 1758}
      ];

    // Since the reflection does not require variation in their filled lines, we can define its segments collectively
    reflectionSegments = [
      [
        {x: 128, y: 1015}, {x: 372, y: 1096}, {x: 354, y: 1136},
        {x: 379, y: 1153}, {x: 371, y: 1183}, {x: 389, y: 1203},
        {x: 373, y: 1243}, {x: 400, y: 1247}, {x: 507, y: 1243},
        {x: 547, y: 1193}, {x: 505, y: 1176}, {x: 543, y: 1156},
        {x: 496, y: 1140}, {x: 550, y: 1053}, {x: 547, y: 1050},
        {x: 948, y: 1046}, {x: 1228, y: 1012}, {x: 128, y: 1015}
      ],
      [
        {x: 428, y: 1258}, {x: 366, y: 1264}, {x: 381, y: 1277},
        {x: 365, y: 1284}, {x: 383, y: 1300}, {x: 353, y: 1321},
        {x: 445, y: 1341}, {x: 515, y: 1336}, {x: 508, y: 1303},
        {x: 524, y: 1283}, {x: 428, y: 1258}
      ],
      [
        {x: 398, y: 1348}, {x: 497, y: 1362}, {x: 506, y: 1406},
        {x: 455, y: 1439}, {x: 377, y: 1430}, {x: 362, y: 1401},
        {x: 398, y: 1358}
      ],
      [
        {x: 412, y: 1469}, {x: 360, y: 1474}, {x: 395, y: 1508},      
        {x: 369, y: 1520}, {x: 369, y: 1551}, {x: 485, y: 1555},
        {x: 457, y: 1525}, {x: 487, y: 1519}, {x: 488, y: 1516},
        {x: 494, y: 1502}, {x: 412, y: 1469}
      ],
      [
        {x: 454, y: 1586}, {x: 384, y: 1594}, {x: 380, y: 1610},
        {x: 379, y: 1629}, {x: 420, y: 1654}, {x: 483, y: 1652},
        {x: 477, y: 1612}, {x: 493, y: 1602}
      ],
      [
        {x: 452, y: 1694}, {x: 407, y: 1700}, {x: 394, y: 1734},
        {x: 400, y: 1751}, {x: 497, y: 1748}, {x: 494, y: 1734},
        {x: 453, y: 1694}
      ]
    ];

  }

// 3. SCALING AND ROTATION
  // We then implement the following functions that will be utilised later in the code 
  // for scaling our coordinates and rotating our sky shapes to be filled with angled diagonal lines
      function scalePoints(points) {
        let scaleX = width / originalWidth;
        let scaleY = height / originalHeight;
        return points.map(p => ({ x: p.x * scaleX, y: p.y * scaleY }));
      }
      function rotatePoint(p, angle) {
        let cosA = cos(angle);
        let sinA = sin(angle);
        return {
          x: p.x * cosA - p.y * sinA,
          y: p.x * sinA + p.y * cosA
        };
      }


// 4. DRAWING AND COLORING SHAPES
function draw() {
  background('#FFFFFF');
  drawSky();
  drawRiver(); 
  drawReflection();
  drawBuilding();
  drawBuildingB();
}
  // We first draw the sky. This requires it's own scaling and coloring methods due to the complexity of the diagonal lines
  function drawSky() {
    let scaleX = width / originalWidth;
    let scaleY = height / originalHeight;
    
    for (let i = 0; i < skyAngles.length; i++) {
      let shape = skyAngles[i];
 
  // I then use the p5.js system variable mouseX to track the mouse's x-position
  // I normalise the mouse position to a range between 0 and 1 based on the browser width by dividing mouseX by width
  // and clear the array to store the changing sky color
    let mouseXRatio = mouseX / width;      
      changingSkyColor = [];
      
    // I then loop through the color arrays and use lerpColor to interpolate between these arrays based on the mouse's x-position
    // This means that as the mouse moves along the x-axis, skyColor[0] will transition to skyColor2[0], skyColor[1] will transition to skyColor2[1] and so on
    // I then push the interpolated colors into the previously initialised changing sky color array to be called upon when filling the sky shapes with lines
      for (let j = 0; j < skyColors.length; j++) {
        let interpolatedSkyColor = lerpColor(skyColors[j], skyColors2[j], mouseXRatio);
        changingSkyColor.push(interpolatedSkyColor);
      }
      
      noStroke();
      beginShape();
      for (let pt of shape.points) {
        vertex(pt.x * scaleX, pt.y * scaleY);
      }
      endShape(CLOSE);
    
     // I add the currentSkyColor array to the fillShapeWithDiagonalLines function
      fillShapeWithDiagonalLines(shape.points, shape.angle, scaleX, scaleY, changingSkyColor);
    }
  }

  // We then draw the river, buildings, and building reflection, applying scaling 
  // and using lerpColor + array indexing to implement a gradual color gradient based on the line's position on the canvas
    function drawRiver() {
      let scaledRiverPoints = scalePoints(riverPoints);
      
      let minY = Math.min(...scaledRiverPoints.map(p => p.y));
      let maxY = Math.max(...scaledRiverPoints.map(p => p.y));
      let step = 4;

    // I have replaced the original color array with the changing sky color array
      for (let y = minY; y <= maxY; y += step) {
        let inter = map(y, minY, maxY, 0, 1);
        let riverStrokeColor;
        if (inter < 0.5) {
          riverStrokeColor = lerpColor(changingSkyColor[0], changingSkyColor[2], inter * 2);
        } else {
          riverStrokeColor = lerpColor(changingSkyColor[2], changingSkyColor[4], (inter - 0.5) * 2);
        }
        fillShapeWithHorizontalLines(scaledRiverPoints, riverStrokeColor, y);
      }
    }

    function drawBuilding() {
      let scaledBuildingPoints = scalePoints(buildingPoints);

      let minX = Math.min(...scaledBuildingPoints.map(p => p.x));
      let maxX = Math.max(...scaledBuildingPoints.map(p => p.x));
      let step = 3;
      
      let mouseXRatio = mouseX / width;
      changingBuildingColor = [];
      
      for (let j = 0; j < buildingColors.length; j++) {
        let interpolatedBuildingColor = lerpColor(buildingColors[j], buildingColors2[j], mouseXRatio);
        changingBuildingColor.push(interpolatedBuildingColor);
      }

      for (let x = minX; x <= maxX; x += step) {
        let inter = map(x, minX, maxX, 0, 1);
        let buildingStrokeColor;
        if (inter < 0.5) {
          buildingStrokeColor = lerpColor(changingBuildingColor[0], changingBuildingColor[1], inter * 2);
        } else {
          buildingStrokeColor = lerpColor(changingBuildingColor[1], changingBuildingColor[2], (inter - 0.5) * 2);
        }
        fillShapeWithVerticalLines(scaledBuildingPoints, buildingStrokeColor, x);
      }
    }

    function drawReflection() {
      for (let reflectionPoints of reflectionSegments) {
        let scaledReflectionPoints = scalePoints(reflectionPoints);

        let minY = Math.min(...scaledReflectionPoints.map(p => p.y));
        let maxY = Math.max(...scaledReflectionPoints.map(p => p.y));
        let step = 4;

        let mouseXRatio = mouseX / width;
        changingBuildingColor = [];
      
      for (let j = 0; j < buildingColors.length; j++) {
        let interpolatedBuildingColor = lerpColor(buildingColors[j], buildingColors2[j], mouseXRatio);
        changingBuildingColor.push(interpolatedBuildingColor);
      }

        for (let y = minY; y <= maxY; y += step) {
          let inter = map(y, minY, maxY, 0, 1);
          let reflectionStrokeColor;
          if (inter < 0.5) {
            reflectionStrokeColor = lerpColor(changingBuildingColor[0], changingBuildingColor[1], inter * 2);
          } else {
            reflectionStrokeColor = lerpColor(changingBuildingColor[1], changingBuildingColor[2], (inter - 0.5) * 2);
          }
          fillShapeWithHorizontalLines(scaledReflectionPoints, reflectionStrokeColor, y);
        }
      }
    }

    function drawBuildingB() {
      let scaledBuildingPoints = scalePoints(buildingBPoints);

      let minX = Math.min(...scaledBuildingPoints.map(p => p.x));
      let maxX = Math.max(...scaledBuildingPoints.map(p => p.x));
      let step = 3;

      for (let x = minX; x <= maxX; x += step) {
        let inter = map(x, minX, maxX, 0, 1);
        let buildingBStrokeColors;
        if (inter < 0.5) {
          buildingBStrokeColors = lerpColor(buildingBColors[0], buildingBColors[1] , inter * 2);
        } else {
          buildingBStrokeColors = lerpColor(buildingBColors[1], buildingBColors[2], (inter - 0.5) * 2);
        }
        fillShapeWithVerticalLines(scaledBuildingPoints, buildingBStrokeColors, x);
      }
    }

  
// 5. FILL SHAPES WITH LINES
  // We then find the bounding box of our shapes and draw parallel lines within
  // Starting with the sky, this requires using the rotated points to find these bounds 
  function fillShapeWithDiagonalLines(points, angle, scaleX, scaleY, changingSkyColor) {
    let rotatedPoints = points.map(p => rotatePoint({ x: p.x * scaleX, y: p.y * scaleY}, angle));
    let minY = Infinity, maxY = -Infinity;
    
    for (let p of rotatedPoints) {
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    let step = 5;
  
    for (let y = minY; y <= maxY; y += step) {
      let intersections = [];
      for (let i = 0; i < rotatedPoints.length; i++) {
        let p1 = rotatedPoints[i];
        let p2 = rotatedPoints[(i + 1) % rotatedPoints.length];
        if ((p1.y < y && p2.y >= y) || (p2.y < y && p1.y >= y)) {
          let x = p1.x + (y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y);
          intersections.push(x);
        }
      }
      intersections.sort((a, b) => a - b);
      for (let i = 0; i < intersections.length; i += 2) {
        if (i + 1 < intersections.length) {
          let x1 = intersections[i];
          let x2 = intersections[i + 1];
          let pt1 = rotatePoint({ x: x1, y: y }, -angle);
          let pt2 = rotatePoint({ x: x2, y: y }, -angle);
  
          // I have replaced the original color array with the changing sky color array
          let t = map(y, minY, maxY, 0, 1);
          let skyStrokeColor;
          if (t < 0.25) {
            skyStrokeColor = lerpColor(changingSkyColor[4], changingSkyColor[3], t * 4); 
          } else if (t < 0.5) {
            skyStrokeColor = lerpColor(changingSkyColor[3], changingSkyColor[2], (t - 0.25) * 4);
          } else if (t < 0.75) {
            skyStrokeColor = lerpColor(changingSkyColor[2], changingSkyColor[1], (t - 0.5) * 4);
          } else {
            skyStrokeColor = lerpColor(changingSkyColor[1], changingSkyColor[0], (t - 0.75) * 4);
          }
          stroke(skyStrokeColor);
          line(pt1.x, pt1.y, pt2.x, pt2.y);
          strokeWeight(2);
        }
      }
    }
  }

   // We then use the same logic (without point rotation or color implementation) 
  // to find the bounds of the shapes that require horizontal and vertical lines, detect intersection points, and draw these lines
  function fillShapeWithHorizontalLines(points, color, y) {
    let minX = Infinity, maxX = -Infinity;

    for (let p of points) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
    }

    let intersections = [];
    for (let i = 0; i < points.length; i++) {
      let p1 = points[i];
      let p2 = points[(i + 1) % points.length];
      if ((p1.y < y && p2.y >= y) || (p2.y < y && p1.y >= y)) {
        let t = (y - p1.y) / (p2.y - p1.y);
        let xAtY = p1.x + t * (p2.x - p1.x);
        intersections.push(xAtY);
      }
    }
    intersections.sort((a, b) => a - b);

    for (let i = 0; i < intersections.length; i += 2) {
      if (i + 1 < intersections.length) {
        stroke(color);
        strokeWeight(2);
        line(intersections[i], y, intersections[i + 1], y);
      }
    }
  }

  function fillShapeWithVerticalLines(points, color, x) {
    let minY = Infinity, maxY = -Infinity;

    for (let p of points) {
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }

    let intersections = [];
    for (let i = 0; i < points.length; i++) {
      let p1 = points[i];
      let p2 = points[(i + 1) % points.length];
      if ((p1.x < x && p2.x >= x) || (p2.x < x && p1.x >= x)) {
        let y = p1.y + (x - p1.x) * (p2.y - p1.y) / (p2.x - p1.x);
        intersections.push(y);
      }
    }
    intersections.sort((a, b) => a - b);

    for (let i = 0; i < intersections.length; i += 2) {
      if (i + 1 < intersections.length) {
        stroke(color);
        strokeWeight(2);
        line(x, intersections[i], x, intersections[i + 1]);
      }
    }
  }

// 6. WINDOW RESIZING
// Finally, we resize the canvas according to the window size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}