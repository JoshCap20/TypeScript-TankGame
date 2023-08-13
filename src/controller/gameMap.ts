// Controls map, obstacle for rendering

type Obstacle = {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type GameMap = {
    size: number;
    obstacles: Obstacle[];
}

export class GameMapGenerator {
    private static readonly OBSTACLE_SIZE = 50;
    private static readonly OBSTACLE_GAP = 70;
    private static readonly OBSTACLE_COUNT = 10;

    public static generateMap(): GameMap {
        const mapSize = Math.floor(Math.random() * 1000 + 500);
        const obstacles: Obstacle[] = [];
        for (let i = 0; i < GameMapGenerator.OBSTACLE_COUNT; i++) {
            const obstacle: Obstacle = {
                x: Math.floor(Math.random() * (mapSize - GameMapGenerator.OBSTACLE_SIZE - GameMapGenerator.OBSTACLE_GAP) - mapSize / 2),
                y: Math.floor(Math.random() * (mapSize - GameMapGenerator.OBSTACLE_SIZE - GameMapGenerator.OBSTACLE_GAP) - mapSize / 2),                
                width: GameMapGenerator.OBSTACLE_SIZE,
                height: GameMapGenerator.OBSTACLE_SIZE
            };
            obstacles.push(obstacle);
        }
        return {
            size: mapSize,
            obstacles: obstacles
        };
    }
}