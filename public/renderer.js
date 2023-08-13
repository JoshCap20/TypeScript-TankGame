import { globalVars } from './globalVars.js';

export function renderTank(tank, scene, camera) {
    const { position } = tank;

    const geometry = new THREE.BoxGeometry(20, 20, 40);
    const material = new THREE.MeshBasicMaterial({ color: 'blue' });
    const tankMesh = new THREE.Mesh(geometry, material);

    // Add a cannon
    const cannonGeometry = new THREE.CylinderGeometry(2, 2, 20);
    const cannonMaterial = new THREE.MeshBasicMaterial({ color: 'green' });
    const cannonMesh = new THREE.Mesh(cannonGeometry, cannonMaterial);
    cannonMesh.position.set(0, 10, 15);
    cannonMesh.rotation.x = Math.PI / 2;
    tankMesh.add(cannonMesh);

    tankMesh.position.set(position.x, 0, position.y);
    tankMesh.rotation.y = -position.rotation * Math.PI / 180;

    scene.add(tankMesh);

    // If it's the player's tank, position the camera behind the tank
    if (tank.id === globalVars.tankId) {
        const cameraOffset = 15; // Distance behind the tank
        const lookAtOffset = 30; // Distance in front of the tank to focus on
    
        // Calculate the camera's position
        const angle = position.rotation * Math.PI / 180;
        const cameraX = position.x + cameraOffset * Math.sin(angle);
        const cameraZ = position.y - cameraOffset * Math.cos(angle);
        const cameraY = 20; // Height above the ground
    
        camera.position.set(cameraX, cameraY, cameraZ);
    
        // Calculate the point for the camera to look at
        const lookAtX = position.x - lookAtOffset * Math.sin(angle);
        const lookAtZ = position.y + lookAtOffset * Math.cos(angle);
    
        camera.lookAt(lookAtX, cameraY, lookAtZ);
    }
}

export function renderBullet(bullet, scene) {
    const { position } = bullet;

    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 'red' });
    const bulletMesh = new THREE.Mesh(geometry, material);

    bulletMesh.position.set(position.x, 10,  position.y);

    scene.add(bulletMesh);
}