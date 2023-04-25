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
var houseMesh;

objLoader.load(
  'house.obj',
  function (object) {
    object.scale.set(0.05, 0.05, 0.05);
    scene.add(object);
    houseMesh = object.children[0]; // assuming the house is the first child object
  }
);

var raycaster = new THREE.Raycaster();
var cameraCollisionDistance = 0.18; // distance to keep the camera from the collision point
var isColliding = false; // flag for collision detection
var lastCollisionPoint = null; // variable to store the last collision point

// new camera position
var initialCameraPosition = new THREE.Vector3();

// check for collision on every frame update
function update() {
  requestAnimationFrame(update);

  if (houseMesh) {
    // get the camera position and direction
    var camPos = camera.position;
    var camDir = camera.getWorldDirection(new THREE.Vector3());

    // set the raycaster with the camera position and direction
    raycaster.set(camPos, camDir);

    // check for intersection between the ray and the house object
    var intersects = raycaster.intersectObject(houseMesh, true);

    if (intersects.length > 0 && intersects[0].distance < cameraCollisionDistance) {
      // if there's an intersection and it's within the collision distance, move the camera back
      var collisionPoint = intersects[0].point;
      var moveDirection = camDir.clone().negate(); // negate the camera direction to move backwards
      moveDirection.y = 0; // set y-direction to 0 to prevent upward movement
      collisionPoint.add(moveDirection.multiplyScalar(cameraCollisionDistance));

      // check if intersection point is behind the camera
      var distanceToIntersection = camPos.distanceTo(intersects[0].point);
      var distanceToCollisionPoint = camPos.distanceTo(collisionPoint);
      if (distanceToCollisionPoint > distanceToIntersection) {
        // if intersection point is behind the camera, set camera position just in front of the intersection point
        collisionPoint = intersects[0].point.clone().sub(camDir.multiplyScalar(cameraCollisionDistance));
      } else {
        // if intersection point is in front of the camera, set camera position just behind the intersection point
        collisionPoint = intersects[0].point.clone().add(camDir.multiplyScalar(cameraCollisionDistance));
      }

      // check if the new position is not behind the initial position
      if (collisionPoint.z > initialCameraPosition.z) {
        camera.position.copy(collisionPoint);
        lastCollisionPoint = collisionPoint; // update the last collision point variable
        initialCameraPosition.copy(lastCollisionPoint); // update initialCameraPosition
      } else {
        camera.position.copy(initialCameraPosition);
        isColliding = true;
      }

      // set camera's y-position to a fixed value
      camera.position.y = 0.3;
    } else {
      isColliding = false;
      initialCameraPosition.copy(camera.position);
    }
  }

  renderer.render(scene, camera);
}

update();



var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

var pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 0, 100);
scene.add(pointLight);

camera.position.z = 2; //How close
camera.position.y = 0.3; //Up and down


var mouseLocked = false;
var prevMouseX = 0;
var prevMouseY = 0;
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
  

  renderer.render(scene, camera);
}

animate();

function lockPointer() {
  var pointerLockElement = document.getElementById('pointer-lock');

  pointerLockElement.addEventListener('click', function() {
    pointerLockElement.requestPointerLock = pointerLockElement.requestPointerLock || pointerLockElement.mozRequestPointerLock || pointerLockElement.webkitRequestPointerLock;
    pointerLockElement.requestPointerLock();
  }, false);

  document.addEventListener('pointerlockchange', onPointerLockChange, false);
  document.addEventListener('mozpointerlockchange', onPointerLockChange, false);
  document.addEventListener('webkitpointerlockchange', onPointerLockChange, false);

  function onPointerLockChange() {
    if (document.pointerLockElement === pointerLockElement || document.mozPointerLockElement === pointerLockElement || document.webkitPointerLockElement === pointerLockElement) {
      document.addEventListener('mousemove', onMouseMove, false);
      mouseLocked = true;
    } else {
      document.removeEventListener('mousemove', onMouseMove, false);
      mouseLocked = false;
    }
  }

  function onMouseMove(event) {
    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    if (mouseLocked) {
      camera.rotation.y -= movementX * 0.001;
      camera.rotation.x -= movementY * 0.001;
    }

    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
  }
}

lockPointer ();