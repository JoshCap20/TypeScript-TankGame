export function handleMovement(ws, tankInfo) {
    const position = tankInfo.position;
    
    const tank = {
        speed: tankInfo.speed,
        health: tankInfo.health,
    };

    window.addEventListener('keydown', (event) => {
        const radianRotation = (position.rotation * Math.PI) / 180;
        switch (event.key) {
            case "KeyW":
            case 'ArrowUp':
                position.x -= Math.sin(radianRotation) * tank.speed;
                position.y += Math.cos(radianRotation) * tank.speed;
                break;
            case "KeyS":
            case 'ArrowDown':
                position.x += Math.sin(radianRotation) * tank.speed;
                position.y -= Math.cos(radianRotation) * tank.speed;
                break;
            case "KeyA":
            case 'ArrowLeft':
                position.rotation -= 5;
                if (position.rotation < 0) position.rotation += 360; // Keep rotation within 0-360
                break;
            case "KeyD":
            case 'ArrowRight':
                position.rotation += 5;
                if (position.rotation >= 360) position.rotation -= 360; // Keep rotation within 0-360
                break;
        }
        const message = JSON.stringify({
            type: 'move',
            movementData: position
        });
        ws.send(message);
    });
}