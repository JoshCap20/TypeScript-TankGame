import { globalVars } from './globalVars.js';

export function handlePlane(ws, planeInfo) {
    const position = planeInfo.position;

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
        q: false, // Ascend
        e: false, // Descend
    };

    function updateMovement(deltaTime) {
        const radianRotation = (position.rotation * Math.PI) / 180;
        const distance = plane.speed * deltaTime * 10;
        
        if (keys.ArrowUp || keys.w) {
            const newX = position.x - Math.sin(radianRotation) * distance;
            const newY = position.y + Math.cos(radianRotation) * distance;
            position.x = newX;
            position.y = newY;
        }
        if (keys.ArrowDown || keys.s) {
            const newX = position.x + Math.sin(radianRotation) * distance;
            const newY = position.y - Math.cos(radianRotation) * distance;
            position.x = newX;
            position.y = newY;
        }
        if (keys.ArrowLeft || keys.a) {
            position.rotation -= 5 * distance * .7;
            if (position.rotation < 0) position.rotation += 360;
        }
        if (keys.ArrowRight || keys.d) {
            position.rotation += 5 * distance * .7;
            if (position.rotation >= 360) position.rotation -= 360;
        }

        // Ascending
        if (keys.q) {
            position.z += distance * 5; 
        }
        
        // Descending
        if (keys.e) {
            position.z -= distance * 5; 
        }

        const message = JSON.stringify({
            type: 'move',
            vehicle: 'plane',
            movementData: position
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

