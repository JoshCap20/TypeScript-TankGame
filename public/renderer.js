import { globalVars } from './globalVars.js';

export function renderTank(tank, scene, camera) {
    const { position } = tank;

    const geometry = new THREE.BoxGeometry(20, 20, 40);
    const material = new THREE.MeshBasicMaterial({ color: 'blue' });
    const tankMesh = new THREE.Mesh(geometry, material);

    // Add a cannon
    const cannonGeometry = new THREE.CylinderGeometry(3, 5, 50);
    const cannonMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
    const cannonMesh = new THREE.Mesh(cannonGeometry, cannonMaterial);
    cannonMesh.position.set(0, 4, 30);

    cannonMesh.rotation.x = Math.PI / 2 - position.gunRotation; // Apply the pitch

    tankMesh.add(cannonMesh);

    tankMesh.position.set(position.x, 0, position.y);
    tankMesh.rotation.y = -position.rotation * Math.PI / 180;

    scene.add(tankMesh);

    // If it's the player's tank, position the camera behind the tank
    if (tank.id === globalVars.playerId) {
        globalVars.playerCannonMesh = cannonMesh;
        const cameraOffset = 0; // Distance behind the tank
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

export function renderPlane(plane, scene, camera) {
    const { position, planePosition } = plane;

    const geometry = new THREE.BoxGeometry(20, 20, 40);
    const material = new THREE.MeshBasicMaterial({ color: 'blue' });
    const planeMesh = new THREE.Mesh(geometry, material);

    // Add a propeller
    const propellerGeometry = new THREE.BoxGeometry(10, 10, 5);
    const propellerMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
    const propellerMesh = new THREE.Mesh(propellerGeometry, propellerMaterial);
    propellerMesh.position.set(0, 0, 25);
    planeMesh.add(propellerMesh);

    planeMesh.position.set(position.x, position.z, position.y);
    planeMesh.rotation.y = -position.rotation * Math.PI / 180;
    planeMesh.rotation.x = planePosition.tilt * Math.PI / 180;

    scene.add(planeMesh);

    // If it's the player's plane, position the camera behind the plane
    if (plane.id === globalVars.playerId) {
        const cameraOffset = 50; // Distance behind the plane
        const lookAtOffset = 10; // Distance in front of the plane to focus on
    
        // Calculate the camera's position
        const angle = position.rotation * Math.PI / 180;
        const cameraX = position.x + cameraOffset * Math.sin(angle);
        const cameraZ = position.y - cameraOffset * Math.cos(angle);
        const cameraY = position.z + 20; // Height relative to the plane's altitude

    
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

    bulletMesh.position.set(position.x, position.z, position.y);

    scene.add(bulletMesh);
}

export function renderMap(mapInfo, scene) {
    console.log("MAP INFO: " + JSON.stringify(mapInfo));
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
    scene.add(ambientLight);
    
    /// Add ground
    const groundGeometry = new THREE.PlaneGeometry(mapInfo.size, mapInfo.size);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -10;
    scene.add(ground);

    /// Add obstacles
    mapInfo.obstacles.forEach((obstacle) => {
        const { x, y, width, height } = obstacle;
        const geometry = new THREE.CylinderGeometry(width, 20, height);
        const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, 10, y);
        scene.add(mesh);
    });
    globalVars.obstacles = mapInfo.obstacles.map(obstacle => ({
        x: obstacle.x,
        y: obstacle.y,
        width: obstacle.width,
        height: obstacle.height
    }));

    /// Add boundaries
    globalVars.mapSize = mapInfo.size;
}