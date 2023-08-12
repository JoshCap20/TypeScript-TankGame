export function handleMovement(ws, tankInfo) {
    const position = tankInfo.position;
    
    const tank = {
        speed: tankInfo.speed,
        health: tankInfo.health,
    };

    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                position.x += Math.cos(position.rotation * Math.PI / 180) * tank.speed;
                position.y += Math.sin(position.rotation * Math.PI / 180) * tank.speed;
                break;
            case 'ArrowDown':
                position.x -= Math.cos(position.rotation * Math.PI / 180) * tank.speed;
                position.y -= Math.sin(position.rotation * Math.PI / 180) * tank.speed;
                break;
            case 'ArrowLeft':
                position.rotation -= 5;
                if (position.rotation < 0) position.rotation += 360; // Keep rotation within 0-360
                break;
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