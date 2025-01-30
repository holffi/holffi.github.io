'use strict';
const canvas = document.getElementById('renderCanvas'); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
let animation = true;
const createScene = function () {
  // Creates a basic Babylon Scene object
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = BABYLON.Color3.Black();
  // Creates and positions a free camera
  const camera = new BABYLON.ArcRotateCamera(
    'camera1',
    -2.5,
    Math.PI / 1.6,
    3,
    new BABYLON.Vector3(0.2, -0.5, 0.5),
    scene
  );

  // Adjust camera wheel precision (zoom speed)
  camera.wheelPrecision = 50; // Default is 3, higher value = slower zoom

  // Lock the camera to the alpha axis
  //   camera.lowerBetaLimit = Math.PI / 1.7;
  //   camera.upperBetaLimit = Math.PI / 1.5;
  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // Constants for animation
  const ALPHA_MIN = -3;
  const ALPHA_MAX = -2;
  const BETA_MIN = Math.PI / 1.75;
  const BETA_MAX = Math.PI / 1.45;
  const ALPHA_SPEED = 0.001;
  const BETA_SPEED = 0.002;

  // Variables for animation
  let alpha = -2.5;
  let beta = Math.PI / 1.6;
  let alphaDirection = ALPHA_SPEED;
  let betaDirection = BETA_SPEED;

  BABYLON.SceneLoader.ImportMeshAsync(null, './', 'piha.splat', scene).then(
    (result) => {
      const mesh = result.meshes[0];
      mesh.position = new BABYLON.Vector3(0, 0, 0);
      //mesh.rotate(BABYLON.Vector3.Up(), Math.PI * 1.25);
      //camera.lockedTarget = mesh;
    }
  );

  engine.runRenderLoop(function () {
    if (!animation) {
      return;
    }
    alpha += alphaDirection;
    beta += betaDirection;

    if (alpha > ALPHA_MAX || alpha < ALPHA_MIN) {
      alphaDirection *= -1;
    }
    if (beta > BETA_MAX || beta < BETA_MIN) {
      betaDirection *= -1;
    }

    camera.alpha = alpha;
    camera.beta = beta;

    scene.render();
  });

  return scene;
};
const scene = createScene(); //Call the createScene function
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});
// Watch for browser/canvas resize events
window.addEventListener('resize', function () {
  engine.resize();
});

// Prevent scrolling when mouse is over canvas
canvas.addEventListener(
  'wheel',
  function (event) {
    event.preventDefault();
  },
  { passive: false }
);

canvas.addEventListener('mouseover', function (event) {
  animation = false;
});

canvas.addEventListener('mouseleave', function (event) {
  animation = true;
});
