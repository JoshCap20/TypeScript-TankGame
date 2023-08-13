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
    static readonly TTL = 10000;

    constructor(shooterId: string, position: Position) {
        this.shooterId = shooterId;
        this.position = position;
        this.speed = 8;
    }

    updatePosition(): void {
        const radianRotation = (this.position.rotation * Math.PI) / 180; 
        this.position.x -= Math.sin(radianRotation) * this.speed;
        this.position.y += Math.cos(radianRotation) * this.speed;
        this.position.z -= this.speed * Math.sin(this.position.gunRotation);
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