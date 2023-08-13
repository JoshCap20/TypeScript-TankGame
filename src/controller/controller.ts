// Singleton class for a controller with a game object

import { Game } from '../models/game';
import { Utils } from './utils';
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

    public onAction(playerId: string, message: string): void {
        const data = JSON.parse(message);
        console.log("ACTION: " + JSON.stringify(data));
        switch (data.type) {
            case 'move':
                this.moveTank(playerId, data.movementData);
                break;
            case 'shoot':
                this.game.getTank(playerId).shoot();
                break;
            }
    }

    private moveTank(playerId: string, position: Position): void {
        this.game.getTank(playerId).move(position);
    }

    public onDisconnect(playerId: string): void {
        this.game.removeTank(playerId);
    }

    public getGame(): Game {
        return this.game;
    }

}
    

    

