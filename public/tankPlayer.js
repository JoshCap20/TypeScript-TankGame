import { globalVars } from './globalVars.js';

export function handleTank(ws, tankInfo) {
    const position = tankInfo.position;

    let canShoot = true;
    
    const tank = {
        speed: tankInfo.speed,
        health: tankInfo.health,
        cooldown: tankInfo.cooldown
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
        const distance = tank.speed * deltaTime * 10;
        if (keys.ArrowUp || keys.w) {
            const newX = position.x - Math.sin(radianRotation) * distance;
            const newY = position.y + Math.cos(radianRotation) * distance;
            if (isInvalidPosition(newX, newY)) return;
            position.x = newX;
            position.y = newY;
        }
        if (keys.ArrowDown || keys.s) {
            const newX = position.x + Math.sin(radianRotation) * distance;
            const newY = position.y - Math.cos(radianRotation) * distance;
            if (isInvalidPosition(newX, newY)) return;
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

        const message = JSON.stringify({
            type: 'move',
            vehicle: 'tank',
            movementData: position
        });
        ws.send(message);
    }


    window.addEventListener('mousemove', (event) => {
        position.gunRotation  += event.movementY * 0.002;
        position.gunRotation = Math.max(Math.min(position.gunRotation, 0.28), -3);
      });

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
            vehicle: 'tank',
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
        const deltaTime = (time - lastTime) / 1000; // Time since last frame in seconds
        lastTime = time;

        updateMovement(deltaTime);
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}