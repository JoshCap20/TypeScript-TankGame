import express from 'express';
import http from 'http';
import { Server as WebSocketServer } from 'ws';
import path from 'path';
import { Controller, VehicleType } from './controller/controller';

const app = express();
const server = http.createServer(app);

const publicPath = path.join(__dirname, '..', 'public');

app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'game.html'));
});

const sockserver = new WebSocketServer({ server });

const controller = new Controller();

enum Action {
    update = "update",
    initial = "initial"
}

setInterval(() => {
    sockserver.clients.forEach(client => client.send(JSON.stringify({ type: Action.update, game: controller.getGame().export() })));
}, 1000 / 60); // 60 fps

setInterval(() => {
    console.log(JSON.stringify({ game: controller.getGame().export() }));
}, 1000 * 15 );

sockserver.on('connection', ws => {
    console.log('New client connected!');

    const plane = controller.createPlane();
    const playerId = plane.id;
    ws.send(JSON.stringify({ type: Action.initial, id: playerId, vehicle: VehicleType.PLANE, plane: plane.export(), map: controller.getMap() }));

    // const tank = controller.createTank();
    // const playerId = tank.id;

    // ws.send(JSON.stringify({ type: Action.initial, id: playerId, vehicle: VehicleType.TANK, tank: tank.export(), map: controller.getMap() }));

    ws.on('message', data => controller.onAction(playerId, data));

    ws.on('close', () => controller.onDisconnect(playerId));

    ws.onerror = function () {
        console.log('websocket error');
    };
});

const port = 3000;
server.listen(port, () => console.log(`Listening on ${port}`));
