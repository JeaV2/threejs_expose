import * as THREE from 'three';

// Create a camera
const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    100000 // Far clipping plane
);

camera.position.z = 8;

// Create a renderer
const renderer = new THREE.WebGLRenderer();

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.body.appendChild(
    renderer.domElement
);

export { camera, renderer };

