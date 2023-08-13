import { TankInterface } from './tank';
import { Team, TeamId } from './team';
import { Position } from './position';
import { ShootAction } from './shootAction';

export type PlanePosition = {
    pitch: number;
    roll: number;
    yaw: number;
    tilt: number;
}

export class Plane implements TankInterface {
    id: string;
    team?: Team;
    teamId?: TeamId;
    position: Position;
    health: number;
    planePosition: PlanePosition;
    speed: number;
    damage: number;
    cooldown: number;
    shootCallback: (action: ShootAction) => void;

    constructor(id: string, shootCallback: (action: ShootAction) => void) {
        console.log("Created plane with id: " + id);
        this.id = id;
        this.position = { x: 0, y: 20, z: 0, rotation: 0, gunRotation: 0 };
        this.health = 100;
        this.planePosition = { pitch: 0, roll: 0, yaw: 0, tilt: 0 };
        this.speed = 5;
        this.cooldown = 4;
        this.damage = 20;
        this.shootCallback = shootCallback;
    }

    shoot(position: Position): void {
        const action: ShootAction = {
            shooterId: this.id,
            position: position
        };
        this.shootCallback(action);
    }

    move(position: Position, planePosition: PlanePosition): void {
        this.position = position;
        this.planePosition = planePosition;
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

    export() {
        return {
            id: this.id,
            teamId: this.teamId,
            position: this.position,
            health: this.health,
            speed: this.speed,
            cooldown: this.cooldown,
            planePosition: this.planePosition
        };
    }
}