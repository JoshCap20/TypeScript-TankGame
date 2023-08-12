import { Tank, Position } from './tank';

interface BulletInterface {
    shooter: Tank;
    position: Position;
    rotation: number;
    speed: number;
}

export class Bullet implements BulletInterface {
    shooter: Tank;
    position: Position;
    rotation: number;
    speed: number;

    constructor(shooter: Tank, position: Position, rotation: number) {
        this.shooter = shooter;
        this.position = position;
        this.rotation = rotation;
        this.speed = 10;
    }

    export(): BulletInterface {
        return {
            shooter: this.shooter,
            position: this.position,
            rotation: this.rotation,
            speed: this.speed
        };
    }
}