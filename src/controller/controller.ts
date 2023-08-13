// Singleton class for a controller with a game object

import { Game } from '../models/game';
import { Utils } from './utils';
import { GameMap, GameMapGenerator } from './gameMap';

import { Tank } from '../models/tank';
import { Plane } from '../models/plane';
import { Position } from '../models/position';

export enum VehicleType {
    TANK = 'tank',
    PLANE = 'plane'
}

export class Controller {
    private game: Game;
    private map: GameMap;

    constructor() {
        this.game = new Game();
        this.map = this.createMap();
    }

    public createTank(): Tank {
        return this.game.createTank(Utils.generateId());
    }

    public createPlane(): Plane {
        return this.game.createPlane(Utils.generateId());
    }

    public createMap(): GameMap {
        return GameMapGenerator.generateMap();
    }

    public onAction(playerId: string, message: string): void {
        const data = JSON.parse(message);
        console.log("ACTION: " + JSON.stringify(data));
        switch (data.type) {
            case 'move':
                this.move(playerId, data.vehicle, data.movementData);
                break;
            case 'shoot':
                this.shoot(playerId, data.bulletPosition, data.vehicle)
                break;
        }
    }

    private move(playerId: string, vehicle: VehicleType, movementData: Position): void {
        switch (vehicle) {
            case VehicleType.TANK:
                this.moveTank(playerId, movementData);
                break;
            case VehicleType.PLANE:
                this.movePlane(playerId, movementData);
                break;
        }
    }

    private moveTank(playerId: string, position: Position): void {
        this.game.getTank(playerId).move(position);
    }

    private movePlane(playerId: string, position: Position): void {
        console.log("ERRR: " + JSON.stringify(position));
        this.game.getPlane(playerId).move(position);
    }

    private shoot(playerId: string, position: Position, vehicle: VehicleType): void {
        switch (vehicle) {
            case VehicleType.TANK:
                this.game.getTank(playerId).shoot(position);
                break;
            case VehicleType.PLANE:
                this.game.getPlane(playerId).shoot(position);
                break;
        }
    }

    public onDisconnect(playerId: string): void {
        try {
            this.game.removeTank(playerId);
        } catch (e) {
            this.game.removePlane(playerId);
        }
    }

    public getGame(): Game {
        return this.game;
    }

    public getMap(): GameMap {
        return this.map;
    }

}




