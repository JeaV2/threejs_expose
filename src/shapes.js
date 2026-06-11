import * as THREE from 'three';
import { renderer } from './setup.js';

const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);

// Shape Gallery

// Create a scene
const shapeGalleryScene = new THREE.Scene();

// Create a cube
const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5, 2, 2, 2);

const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true
});

const cube = new THREE.Mesh(
  cubeGeometry,
  cubeMaterial
);

// Create sphere 
const sphereGeometry = new THREE.SphereGeometry(1, 8, 8);

const sphereMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true
});

const sphere = new THREE.Mesh(
  sphereGeometry,
  sphereMaterial
);

// Create a cylinder
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 8, 2);

const cylinderMaterial = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
  wireframe: true
});

const cylinder = new THREE.Mesh(
  cylinderGeometry,
  cylinderMaterial
);

// Create a cone
const coneGeometry = new THREE.ConeGeometry(0.5, 2, 8, 2);

const coneMaterial = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  wireframe: true
});

const cone = new THREE.Mesh(
  coneGeometry,
  coneMaterial
);

// Create a torus
const torusGeometry = new THREE.TorusGeometry(1, 0.3, 8, 16);

const torusMaterial = new THREE.MeshBasicMaterial({
  color: 0xff00ff,
  wireframe: true
});

const torus = new THREE.Mesh(
  torusGeometry,
  torusMaterial
);

// Add shapes to the scene
shapeGalleryScene.add(cube);
shapeGalleryScene.add(sphere);
shapeGalleryScene.add(cylinder);
shapeGalleryScene.add(cone);
shapeGalleryScene.add(cone);
shapeGalleryScene.add(torus);

// Position the shapes
sphere.position.x = 3;
cylinder.position.x = -3;
cone.position.y = 3;
torus.position.y = -3;

// Add a light source
const light = new THREE.PointLight(
  0xffffff,
  1,
);

light.position.set(3, 5, 3);
shapeGalleryScene.add(light);

// Rotation animation
function animate(shape) {
  shape.rotation.x += 0.01;
  shape.rotation.y += 0.01;
}

// Render loop
function renderShapeGallery() {
  // hide the rocket-only spacebar note when showing shapes
  const spaceNote = document.getElementById('space-note');
  if (spaceNote) spaceNote.style.display = 'none';

  // Animate the shapes
  requestAnimationFrame(renderShapeGallery);
  animate(cube);
  animate(sphere);
  animate(cylinder);
  animate(cone);
  animate(torus);
  renderer.render(shapeGalleryScene, camera);
  camera.position.set(0, 0, 8)
}

// Make this function available to inline onclick handlers in index.html
window.renderShapesGallery = renderShapeGallery;
