import { Team, TeamId } from './team';
import { Position } from './position';
import { ShootAction } from './shootAction';

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
    shootCallback: (action: ShootAction) => void;

    constructor(id: string, shootCallback: (action: ShootAction) => void) {
        console.log("Created tank with id: " + id);
        this.id = id;
        this.position = { x: 0, y: 0, rotation: 0, gunRotation: 0 };
        this.health = 100;
        this.speed = 5;
        this.shootCallback = shootCallback;
    }

    shoot(): void {
        console.log("Tank " + this.id + " shoots");
        const action: ShootAction = {
            shooterId: this.id,
            position: this.position
        };
        this.shootCallback(action); // Emit the shoot action
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


