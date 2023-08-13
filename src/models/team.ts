import { Tank } from './tank';
import { Plane } from './plane';
interface TeamInterface {
    id: String;
    tanks: Tank[];
    score: number;
}

export type TeamId = "blue" | "red";

export class Team implements TeamInterface {
    id: TeamId;
    tanks: Tank[];
    planes: Plane[];
    score: number;

    constructor(id: TeamId) {
        this.id = id;
        this.tanks = [];
        this.planes = [];
        this.score = 0;
    }

    addTank(tank: Tank): void {
        tank.setTeam(this);
        this.tanks.push(tank);
    }

    removeTank(tankId: string): void {
        this.tanks = this.tanks.filter(tank => tank.id !== tankId);
    }

    addPlane(plane: Plane): void {
        plane.setTeam(this);
        this.planes.push(plane);
    }

    removePlane(planeId: string): void {
        this.planes = this.planes.filter(plane => plane.id !== planeId);
    }

    getTanks(): Tank[] {
        return this.tanks;
    }

    getTank(tankId: string): Tank | undefined {
        return this.tanks.find(tank => tank.id === tankId);
    }

    getPlanes(): Plane[] {
        return this.planes;
    }

    getPlane(planeId: string): Plane | undefined {
        return this.planes.find(plane => plane.id === planeId);
    }

    getScore(): number {
        return this.score;
    }

    updateScore(score: number): void {
        this.score = score;
    }
}