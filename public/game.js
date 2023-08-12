import { handleMovement } from './player.js';
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  console.log('Connected to the server');
};

ws.onmessage = (message) => {
  const data = JSON.parse(message.data);
  switch (data.type) {
    case 'initial':
      console.log('Initial data received' + JSON.stringify(data));
      handleMovement(ws, data.tank);
      break;
    case 'update':
      renderGame(data.game);
      break;
    default:
      console.log('Unknown message type received:', data.type);
  }
};

function renderGame(gameData) {
  // Clearing the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Render tanks
  gameData.tanks.forEach((tank) => {
    renderTank(tank);
  });

  // Render bullets
  gameData.bullets.forEach((bullet) => {
    renderBullet(bullet);
  });

  // Will render score here in future
}

function renderTank(tank) {
  const { position } = tank;

  ctx.save();
  ctx.translate(position.x, position.y);
  ctx.rotate((position.rotation * Math.PI) / 180);
  ctx.fillStyle = 'blue';
  ctx.fillRect(-10, -10, 20, 40); 
  ctx.restore();
}

function renderBullet(bullet) {
  const { position } = bullet;

  ctx.save();
  ctx.translate(position.x, position.y);
  ctx.rotate((bullet.rotation * Math.PI) / 180);
  ctx.fillStyle = 'red';
  ctx.fillRect(-2, -2, 4, 4);
  ctx.restore();
}