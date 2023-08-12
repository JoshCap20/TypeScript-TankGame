import { Team, TeamId } from './team';

interface TankInterface {
    id: string;
    team?: Team;
    teamId?: TeamId;
    position: Position;
    health: number;
    speed: number;
}

export class Tank implements TankInterface {
    id: string;
    team?: Team;
    teamId?: TeamId;
    position: Position;
    health: number;
    speed: number;
    damage: number;

    constructor(id: string) {
        console.log("Created tank with id: " + id);
        this.id = id;
        this.position = { x: 0, y: 0, rotation: 0, gunRotation: 0 };
        this.health = 100;
        this.speed = 5;
    }

    shoot(target: Tank): void {
        if (!this.team || !target.team || this.team === target.team) {
            return;
        }

        target.takeDamage(this.getDamage());

        if (!target.isAlive()) {
            this.team?.updateScore(1);
        }
    }

    move(position: Position): void {
        this.position = position;
    }

    takeDamage(damage: number): void {
        this.health -= damage;
    }

    isAlive(): boolean {
        return this.health > 0;
    }

    setTeam(team: Team): void {
        this.team = team;
    }

    setDamage(damage: number): void {
        this.damage = damage;
    }

    getDamage(): number {
        return this.damage;
    }

    getTeam(): Team | undefined {
        return this.team;
    }

    getPosition(): Position {
        return this.position;
    }

    getHealth(): number {
        return this.health;
    }

    getSpeed(): number {
        return this.speed;
    }

    setSpeed(speed: number): void {
        this.speed = speed;
    }

    export(): TankInterface {
        return {
            id: this.id,
            teamId: this.teamId,
            position: this.position,
            health: this.health,
            speed: this.speed,
        };
    }
}

export type Position = {
    x: number;
    y: number;
    rotation: number; // 0-360
    gunRotation: number; // 0-360
};
