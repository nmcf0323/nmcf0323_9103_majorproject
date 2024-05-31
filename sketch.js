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
}
  // We first draw the sky. This requires it's own scaling and coloring methods due to the complexity of the diagonal lines
    function drawSky() {
      let scaleX = width / originalWidth;
      let scaleY = height / originalHeight;

      skyAngles.forEach(shape => {
        noStroke();
        beginShape();
        for (let pt of shape.points) {
          vertex(pt.x * scaleX, pt.y * scaleY);
        }
        endShape(CLOSE);
        
        fillShapeWithDiagonalLines(shape.points, shape.angle, scaleX, scaleY);
      });
    }

  // We then draw the river, buildings, and building reflection, applying scaling 
  // and using lerpColor + array indexing to implement a gradual color gradient based on the line's position on the canvas
    function drawRiver() {
      let scaledRiverPoints = scalePoints(riverPoints);

      let minY = Math.min(...scaledRiverPoints.map(p => p.y));
      let maxY = Math.max(...scaledRiverPoints.map(p => p.y));
      let step = 4;

      for (let y = minY; y <= maxY; y += step) {
        let inter = map(y, minY, maxY, 0, 1);
        let riverStrokeColor;
        if (inter < 0.5) {
          riverStrokeColor = lerpColor(skyColors[0], skyColors[2], inter * 2);
        } else {
          riverStrokeColor = lerpColor(skyColors[2], skyColors[4], (inter - 0.5) * 2);
        }
        fillShapeWithHorizontalLines(scaledRiverPoints, riverStrokeColor, y);
      }
    }



// 5. FILL SHAPES WITH LINES
  // We then find the bounding box of our shapes and draw parallel lines within
  // Starting with the sky, this requires using the rotated points to find these bounds 
  function fillShapeWithDiagonalLines(points, angle, scaleX, scaleY) {
    let rotatedPoints = points.map(p => rotatePoint({ x: p.x * scaleX, y: p.y * scaleY}, angle));
    let minY = Infinity, maxY = -Infinity;
  
    for (let p of rotatedPoints) {
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    let step = 5;

  // We then iterate through each pair of consecutive rotated points to detect any intersections at the current y-coordinate
  // and sort them by ascending x-coordinates
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
  
    // We then use lerpColor and array indexing to interpolate between sky colors based on vertical position
          let t = map(y, minY, maxY, 0, 1);
          let skyStrokeColor;
          if (t < 0.25) {
            skyStrokeColor = lerpColor(skyColors[4], skyColors[3], t * 4); 
          } else if (t < 0.5) {
            skyStrokeColor = lerpColor(skyColors[3], skyColors[2], (t - 0.25) * 4);
          } else if (t < 0.75) {
            skyStrokeColor = lerpColor(skyColors[2], skyColors[1], (t - 0.5) * 4);
          } else {
            skyStrokeColor = lerpColor(skyColors[1], skyColors[0], (t - 0.75) * 4);
          }
          stroke(skyStrokeColor);
          line(pt1.x, pt1.y, pt2.x, pt2.y);
          strokeWeight(2);
        }
      }
    }
  }


// 6. WINDOW RESIZING
// Finally, we resize the canvas according to the window size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}