import { Tank } from './tank';
import { Position } from './position';

interface BulletInterface {
    shooterId: string;
    position: Position;
    speed: number;
    creationTime: number;
}

export class Bullet implements BulletInterface {
    shooterId: string;
    position: Position;
    speed: number;
    creationTime: number = Date.now();
    static readonly TTL = 5000;

    constructor(shooterId: string, position: Position) {
        this.shooterId = shooterId;
        this.position = position;
        this.speed = 10;
    }

    hasExpired(): boolean {
        return Date.now() - this.creationTime > Bullet.TTL;
    }

    export(): BulletInterface {
        return {
            shooterId: this.shooterId,
            position: this.position,
            speed: this.speed,
            creationTime: this.creationTime
        };
    }
}