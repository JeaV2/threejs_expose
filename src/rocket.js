import * as THREE from 'three';
import { camera, renderer } from './setup.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import skyboxRight from './media/skybox/right.png';
import skyboxLeft from './media/skybox/left.png';
import skyboxTop from './media/skybox/top.png';
import skyboxBottom from './media/skybox/bottom.png';
import skyboxFront from './media/skybox/front.png';
import skyboxBack from './media/skybox/back.png';

// Rocket Scene

const rocketScene = new THREE.Scene();

// Use a cubemap background so the skybox always surrounds the camera.
const skyboxTexture = new THREE.CubeTextureLoader().load([
    skyboxRight,
    skyboxLeft,
    skyboxTop,
    skyboxBottom,
    skyboxFront,
    skyboxBack
]);
rocketScene.background = skyboxTexture;


// Create a rocket
// Body
const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 8);
const bodyMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
});
const body = new THREE.Mesh(
    bodyGeometry,
    bodyMaterial
);

// Nose cone
const noseGeometry = new THREE.ConeGeometry(0.5, 1, 8);
const noseMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true
});
const nose = new THREE.Mesh(
    noseGeometry,
    noseMaterial
);
nose.position.y = 2;

// thrusters (shared geometry + material)
const thrusterGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 8);
const thrusterMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    wireframe: true
});

const thrusterPositions = [
    [0.5, -1.5, 0.3],
    [-0.5, -1.5, 0.3],
    [0, -1.5, -0.5]
];

const thrusters = thrusterPositions.map((p) => {
    const thruster = new THREE.Mesh(thrusterGeometry, thrusterMaterial);
    thruster.position.set(p[0], p[1], p[2]);
    return thruster;
});

const flameLayers = [
    { geometry: new THREE.ConeGeometry(0.15, 0.4, 8), color: 0xff0000, offset: 0.7 },
    { geometry: new THREE.ConeGeometry(0.2, 0.5, 8), color: 0xffff00, offset: 0.75 },
    { geometry: new THREE.ConeGeometry(0.25, 0.6, 8), color: 0xffa500, offset: 0.8 }
];

// Create flames for each thruster using the flame layers
const flames = flameLayers.flatMap(({ geometry, color, offset }) => {
    const material = new THREE.MeshBasicMaterial({
        color,
        wireframe: true
    });

    return thrusterPositions.map((p) => {
        const flame = new THREE.Mesh(geometry, material);
        flame.position.set(p[0], p[1] - offset, p[2]);
        flame.rotation.x = Math.PI;
        return flame;
    });
});

// Initially hide the flames
flames.forEach(flame => {
    flame.visible = false;
});

// Thrust state and parameters
let isThrusting = false;
const thrustSpeedY = 4;
const thrustSpeedX = -3;

// Helper function to toggle flame visibility
const setFlamesVisible = (isVisible) => {
    flames.forEach(flame => {
        flame.visible = isVisible;
    });
};

const clock = new THREE.Clock();

// Event listeners for thrust control
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        setFlamesVisible(true);
        isThrusting = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
        setFlamesVisible(false);
        isThrusting = false;
    }
});

// Random planets so you can see that you are moving, beacus it it looked like you weren't moving at all.
const randomInRange = (min, max) => min + Math.random() * (max - min);
const planetCount = 50 + Math.floor(Math.random() * 20);
console.log(`Adding ${planetCount} planets to the scene...`);

for (let i = 0; i < planetCount; i += 1) {
    const radius = randomInRange(1.5, 10);
    const planetGeometry = new THREE.SphereGeometry(radius, 16, 8);
    const planetColor = new THREE.Color().setHSL(Math.random(), 0.8, 0.55);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: planetColor, wireframe: true });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);

    let x = 0;
    let y = 0;
    let z = 0;

    // Keep planets far from the rocket's starting point.
    do {
        x = randomInRange(-260, 260);
        y = randomInRange(-280, 520);
        z = randomInRange(-260, 260);
    } while (Math.sqrt((x * x) + (y * y) + (z * z)) < 45);

    planet.position.set(x, y, z);
    rocketScene.add(planet);
}


// Add components to the rocket scene
rocketScene.add(body);
body.add(nose);
thrusters.forEach(thruster => body.add(thruster));
flames.forEach(flame => body.add(flame));

// Add controls and such
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 5;
// controls.maxDistance = 20;
controls.enablePan = false;
controls.target.set(0, 0.5, 0);
controls.enableDamping = true;
controls.update();
body.rotation.z = 0.3

const prevBodyPos = body.position.clone();

function renderRocket() {
    // show the rocket-only spacebar note while in the rocket scene
    const spaceNote = document.getElementById('space-note');
    if (spaceNote) spaceNote.style.display = 'inline-block';
    requestAnimationFrame(renderRocket);

    const dt = clock.getDelta();
    if (isThrusting) {
        body.position.y += thrustSpeedY * dt;
        body.position.x += thrustSpeedX * dt;
    }

    // Move camera math I don't understand and just copy and pasted so the camera follows the rocket
    const delta = body.position.clone().sub(prevBodyPos);
    if (delta.lengthSq() > 0) {
        camera.position.add(delta);
        controls.target.add(delta);
        prevBodyPos.copy(body.position);
    }

    controls.update();

    renderer.render(rocketScene, camera);
}

// Makes it so the buttons work.
window.renderRocket = renderRocket;
renderRocket();

