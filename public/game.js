import { handleMovement } from './player.js';
import { renderTank, renderBullet } from './renderer.js';
import { globalVars } from './globalVars.js';

////////////////////////// THREE.JS SETUP //////////////////////////
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.y = 50;
camera.position.z = 50;
camera.lookAt(scene.position); // temporary til fix camera
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth - 100, window.innerHeight - 100);
renderer.setClearColor(0xFFFFFF);
document.body.appendChild(renderer.domElement);

// Add an ambient light to illuminate the scene
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
scene.add(ambientLight);

/// Add ground
const groundGeometry = new THREE.PlaneGeometry(200, 200);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -10;
scene.add(ground);
////////////////////////////////////////////////////////////////////

const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  console.log('Connected to the server');
};

ws.onmessage = (message) => {
  const data = JSON.parse(message.data);
  switch (data.type) {
    case 'initial':
      console.log('Initial data received' + JSON.stringify(data));
      globalVars.tankId = data.tank.id = data.tank.id;
      handleMovement(ws, data.tank);
      break;
    case 'update':
      if (!globalVars.tankId) return;
      renderGame(data.game);
      break;
    default:
      console.log('Unknown message type received:', data.type);
  }
};

function renderGame(gameData) {
  scene.children.forEach((object) => {
    if (object.type === 'Mesh') {
      if (object.geometry.type === 'PlaneGeometry') return;
      scene.remove(object);
    }
  });
  
  // Render tanks
  gameData.tanks.forEach((tank) => {
    renderTank(tank, scene, camera);
  });

  // Render bullets
  gameData.bullets.forEach((bullet) => {
    renderBullet(bullet, scene);
  });

  // Will render score here in future
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();