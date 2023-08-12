import { Bullet } from "./bullet";
import { Tank } from "./tank";
import { Team, TeamId } from "./team";

type Score = {
    blue: number;
    red: number;
}

interface GameInterface {
    blueTeam: Team;
    redTeam: Team;

    addTank(tank: Tank): void;
    removeTank(tank: string | Tank): void;

    getTanks(): Tank[];
    getTank(tankId: string): Tank | undefined;

    getScore(): Score;
    updateTeamScore(team: TeamId, score: number): void;
}

export class Game implements GameInterface {
    blueTeam: Team;
    redTeam: Team;
    bullets: Bullet[] = [];

    constructor() {
        this.blueTeam = new Team("blue");
        this.redTeam = new Team("red");
    }

    createTank(id: string): Tank {
        const tank = new Tank(id);
        this.addTank(tank);
        return tank;
    }

    addTank(tank: Tank): void {
        this.blueTeam.getTanks().length <= this.redTeam.getTanks().length
            ? this.blueTeam.addTank(tank)
            : this.redTeam.addTank(tank);
    }

    removeTank(tank: string | Tank): void {
        if (tank instanceof Tank) {
            tank.team?.removeTank(tank.id)
        } else {
            this.getTank(tank).team?.removeTank(tank)
        }
    }

    getTanks(): Tank[] {
        return [...this.blueTeam.getTanks(), ...this.redTeam.getTanks()];
    }

    getTank(tankId: string): Tank | undefined {
        return this.getTanks().find(tank => tank.id === tankId);
    }

    getScore(): Score {
        return {
            blue: this.blueTeam.getScore(),
            red: this.redTeam.getScore()
        };
    }

    updateTeamScore(team: TeamId, score: number): void {
        team === "blue" ? this.blueTeam.updateScore(score) : this.redTeam.updateScore(score);
    }

    getTeamOfTank(tank: Tank): Team | undefined {
        return this.getTanks().find(t => t.id === tank.id)?.team;
      }

    public export() {
        return {
            tanks: this.getTanks().map(tank => tank.export()),
            score: this.getScore(),
            bullets: this.bullets.map(bullet => bullet.export())
        };
    }
}