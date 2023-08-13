import { handleTank } from './tankPlayer.js';
import { handlePlane } from './planePlayer.js';
import { renderTank, renderPlane, renderBullet, renderMap } from './renderer.js';
import { globalVars } from './globalVars.js';

////////////////////////// THREE.JS SETUP //////////////////////////
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.y = 50;
camera.position.z = 50;
camera.lookAt(scene.position); // temporary til fix camera
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth - 100, window.innerHeight - 100);
// renderer.setClearColor(0xFFFFFF);
document.body.appendChild(renderer.domElement);
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
      if (globalVars.playerId) return;
      if (data.vehicle === 'tank') {
        globalVars.playerId = data.tank.id;
        handleTank(ws, data.tank);
      } else if (data.vehicle === 'plane') {
        globalVars.playerId = data.plane.id;
        handlePlane(ws, data.plane);
      }
      renderMap(data.map, scene);
      break;
    case 'update':
      if (!globalVars.playerId) return;
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
      if (object.geometry.type === 'CylinderGeometry') return;
      scene.remove(object);
    }
  });
  
  // Render tanks
  gameData.tanks?.forEach((tank) => {
    renderTank(tank, scene, camera);
  });

  // Render planes
  gameData.planes?.forEach((plane) => {
    renderPlane(plane, scene, camera);
  });

  // Render bullets
  gameData.bullets?.forEach((bullet) => {
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