import { Tank } from './tank';
import { Position } from './position';

interface BulletInterface {
    shooterId: string;
    position: Position;
    speed: number;
}

export class Bullet implements BulletInterface {
    shooterId: string;
    position: Position;
    speed: number;

    constructor(shooterId: string, position: Position) {
        this.shooterId = shooterId;
        this.position = position;
        this.speed = 10;
    }


    export(): BulletInterface {
        return {
            shooterId: this.shooterId,
            position: this.position,
            speed: this.speed
        };
    }
}