var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// update the camera aspect ratio when the window is resized
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

var objLoader = new THREE.OBJLoader();
objLoader.load(
  'horse.obj',
  function (object) {
    object.scale.set(0.05, 0.05, 0.05); // adjust the scale factor as needed
    scene.add(object);
  }
);

var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

var pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 0, 100);
scene.add(pointLight);

camera.position.z = 2; //How close
camera.position.y = 0.3; //Up and down

var mouseX = 0;
var mouseY = 0;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

function onMouseMove(event) {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

document.addEventListener('mousemove', onMouseMove, false);

function onKeyDown(event) {
  switch (event.keyCode) {
    case 87: // W
      moveForward = true;
      break;
    case 65: // A
      moveLeft = true;
      break;
    case 83: // S
      moveBackward = true;
      break;
    case 68: // D
      moveRight = true;
      break;
  }
}

function onKeyUp(event) {
  switch (event.keyCode) {
    case 87: // W
      moveForward = false;
      break;
    case 65: // A
      moveLeft = false;
      break;
    case 83: // S
      moveBackward = false;
      break;
    case 68: // D
      moveRight = false;
      break;
  }
}

document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

function animate() {
  requestAnimationFrame(animate);

  // move the camera based on WASD keys
  if (moveForward) {
    camera.position.x -= Math.sin(camera.rotation.y) * 0.01;
    camera.position.z -= Math.cos(camera.rotation.y) * 0.01;
  }
  if (moveBackward) {
    camera.position.x += Math.sin(camera.rotation.y) * 0.01;
    camera.position.z += Math.cos(camera.rotation.y) * 0.01;
  }
  if (moveRight) {
    camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * 0.01;
    camera.position.z += Math.cos(camera.rotation.y + Math.PI / 2) * 0.01;
  }
  if (moveLeft) {
    camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * 0.01;
    camera.position.z += Math.cos(camera.rotation.y - Math.PI / 2) * 0.01;
  }

  // rotate the camera based on mouse position
  camera.rotation.y = mouseX * Math.PI;
  camera.rotation.x = mouseY * Math.PI / 2;

  renderer.render(scene, camera);
}

animate();


