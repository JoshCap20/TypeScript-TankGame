export function handleMovement(ws, tankInfo) {
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
        KeyW: false,
        KeyS: false,
        KeyA: false,
        KeyD: false,
    };

    function updateMovement() {
        const radianRotation = (position.rotation * Math.PI) / 180;

        if (keys.ArrowUp || keys.KeyW) {
            position.x -= Math.sin(radianRotation) * tank.speed;
            position.y += Math.cos(radianRotation) * tank.speed;
        }
        if (keys.ArrowDown || keys.KeyS) {
            position.x += Math.sin(radianRotation) * tank.speed;
            position.y -= Math.cos(radianRotation) * tank.speed;
        }
        if (keys.ArrowLeft || keys.KeyA) {
            position.rotation -= 5;
            if (position.rotation < 0) position.rotation += 360;
        }
        if (keys.ArrowRight || keys.KeyD) {
            position.rotation += 5;
            if (position.rotation >= 360) position.rotation -= 360;
        }

        const message = JSON.stringify({
            type: 'move',
            movementData: position
        });
        ws.send(message);
    }

    window.addEventListener('keydown', (event) => {
        if (keys.hasOwnProperty(event.key)) {
            keys[event.key] = true;
            updateMovement();
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
            bulletPosition: {...position}
        });
        ws.send(message);

        setTimeout(() => {
            canShoot = true;
        }, tank.cooldown * 1000);
    }
}