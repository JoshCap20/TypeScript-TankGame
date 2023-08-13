/*
    Created to decouple tank and game objects
    and avoid circular dependencies.
*/

import { Position } from './position';

export interface ShootAction {
    shooterId: string;
    position: Position;
}
