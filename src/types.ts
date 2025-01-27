export type Coordinates = [number, number, number];

export interface Scene {
    id: string; // Unique identifier for the Scene
    name: string;
    background: string;
    circles: CircleInfo[];
    spheres: SphereInfo[];
}

export interface Tour {
    id: string; // Unique identifier for the Tour
    name: string;
    scenes: Scene[];
}

export interface CircleInfo {
    id: string; // Unique identifier for the Circle
    sceneIndex:number;
    coordinates: Coordinates;
    scale: number;
    color: string;
    onClickAction: {
        actionType: "Teleport";
        actionArgs: string;
    }
}

export interface SphereInfo {
    id: string; // Unique identifier for the Sphere
    sceneIndex:number;
    coordinates: Coordinates;
    scale: number;
    color: string;
}