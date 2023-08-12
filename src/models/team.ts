import { Tank } from './tank';

interface TeamInterface {
    id: String;
    tanks: Tank[];
    score: number;
}

export type TeamId = "blue" | "red";

export class Team implements TeamInterface {
    id: TeamId;
    tanks: Tank[];
    score: number;

    constructor(id: TeamId) {
        this.id = id;
        this.tanks = [];
        this.score = 0;
    }

    addTank(tank: Tank): void {
        tank.setTeam(this);
        this.tanks.push(tank);
    }

    removeTank(tankId: string): void {
        this.tanks = this.tanks.filter(tank => tank.id !== tankId);
    }

    getTanks(): Tank[] {
        return this.tanks;
    }

    getTank(tankId: string): Tank | undefined {
        return this.tanks.find(tank => tank.id === tankId);
    }

    getScore(): number {
        return this.score;
    }

    updateScore(score: number): void {
        this.score = score;
    }
}