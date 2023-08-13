import { globalVars } from './globalVars.js';

export function handlePlane(ws, planeInfo) {
    const position = planeInfo.position;
    const planePosition = planeInfo.planePosition;

    let canShoot = true;

    const plane = {
        speed: planeInfo.speed,
        health: planeInfo.health,
        cooldown: planeInfo.cooldown
    };

    const keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        w: false,
        s: false,
        a: false,
        d: false,
    };

    function updateMovement(deltaTime) {
        const radianRotation = (position.rotation * Math.PI) / 180;
        const distance = plane.speed * (deltaTime ? deltaTime : 1) * 10;
        
        const newX = position.x - Math.sin(radianRotation) * distance;
        const newY = position.y + Math.cos(radianRotation) * distance;
        position.x = newX;
        position.y = newY;

        if (keys.ArrowLeft || keys.a) {
            position.rotation -= 5 * distance * .7;
            if (position.rotation < 0) position.rotation += 360;
        } else if (keys.ArrowRight || keys.d) {
            position.rotation += 5 * distance * .7;
            if (position.rotation >= 360) position.rotation -= 360;
        } else {
            planePosition.tilt *= .9;
        }

        // Ascending
        if (keys.ArrowUp || keys.w) {
            planePosition.tilt -= 10; // Tilt upwards
            position.z += Math.cos(planePosition.tilt * Math.PI / 180) * distance; // Ascend
        } else if (keys.ArrowDown || keys.s) {
            planePosition.tilt += 10; // Tilt downwards
            position.z -= Math.sin(planePosition.tilt * Math.PI / 180) * distance; // Descend
        }
        planePosition.tilt = Math.max(-45, Math.min(45, planePosition.tilt));

        const message = JSON.stringify({
            type: 'move',
            vehicle: 'plane',
            movementData: position,
            planePosition: planePosition
        });
        ws.send(message);
    }

    window.addEventListener('keydown', (event) => {
        if (keys.hasOwnProperty(event.key)) {
            keys[event.key] = true;
        }

        if (event.code === "Space") {
            shoot();
        }
    });

    window.addEventListener('keyup', (event) => {
        if (keys.hasOwnProperty(event.key)) {
            keys[event.key] = false;
        }
    });

    function shoot() {
        if (!canShoot) return;
        canShoot = false;

        const message = JSON.stringify({
            type: 'shoot',
            vehicle: 'plane',
            bulletPosition: {...position}
        });
        ws.send(message);

        setTimeout(() => {
            canShoot = true;
        }, tank.cooldown * 1000);
    }

    function isInvalidPosition(x, y) {
        if (isOutOfBounds(x, y)) return true;
        if (isCollidingWithObstacle(x, y)) return true;
        return false;
    }

    function isOutOfBounds(x, y) {
        if (x < -(globalVars.mapSize / 2) || x > (globalVars.mapSize / 2) || y < -(globalVars.mapSize / 2) || y > (globalVars.mapSize / 2)) return true;
        return false;
    }

    function isCollidingWithObstacle(x, y) {
        for (const obstacle of globalVars.obstacles) {
            const dx = x - obstacle.x;
            const dy = y - obstacle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
    
            if (distance < obstacle.width / 2 + 10) { 
                return true;
            }
        }
        return false;
    }

    let lastTime = performance.now();

    function gameLoop(time) {
        const deltaTime = (time - lastTime) / 1000;
        lastTime = time;

        updateMovement(deltaTime);
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

