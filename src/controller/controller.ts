// Singleton class for a controller with a game object

import { Game } from '../models/game';
import { Utils } from './utils';
import { GameMap, GameMapGenerator } from './gameMap';

import { Tank } from '../models/tank';
import { Position } from '../models/position';

export class Controller {
    private game: Game;

    constructor() {
        this.game = new Game();
    }

    public createTank(): Tank {
        return this.game.createTank(Utils.generateId());
    }

    public createMap(): GameMap {
        return GameMapGenerator.generateMap();
    }

    public onAction(playerId: string, message: string): void {
        const data = JSON.parse(message);
        console.log("ACTION: " + JSON.stringify(data));
        switch (data.type) {
            case 'move':
                this.moveTank(playerId, data.movementData);
                break;
            case 'shoot':
                this.shoot(playerId, data.bulletPosition)
                break;
        }
    }

    private moveTank(playerId: string, position: Position): void {
        this.game.getTank(playerId).move(position);
    }

    private shoot(playerId: string, position: Position): void {
        this.game.getTank(playerId).shoot(position);
    }

    public onDisconnect(playerId: string): void {
        this.game.removeTank(playerId);
    }

    public getGame(): Game {
        return this.game;
    }

}




