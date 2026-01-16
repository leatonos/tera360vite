export type Coordinates = [number, number, number];

export interface SceneInfo {
    id: string; // Unique identifier for the Scene
    name: string;
    background: string;
    thumbnail?: string | null;
    rotation: number;
    circles: CircleInfo[];
    spheres: SphereInfo[];
}

export interface Tour {
    _id: string; // Unique identifier for the Tour
    name: string;
    scenes: SceneInfo[];
    iframeLink: string;
}

export type ViewType = "360Tour" | "3DView"

export interface CircleInfo {
    id: string; // Unique identifier for the Circle
    sceneIndex:number;
    coordinates: Coordinates;
    scale: number;
    color: string;
    onClickAction: {
        actionType: string;
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