import { defineStore } from 'pinia';
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import type { CircleInfo, Scene, SphereInfo, Tour } from '../types';

export const useTourStore = defineStore('tour', () => {
    
    const tour = ref<Tour>({
        id: uuidv4(),
        name: "New tour",
        scenes: [
            {
                id: uuidv4(),
                name: "New scene",
                background: 'https://pedrobaptista.com/photos360/testA.jpg',
                circles: [] as CircleInfo[],
                spheres: [] as SphereInfo[]
            }
        ]
    });

    const cameraPosition = ref({ x: 0, y: 0, z: 0 });
    const cameraDirection = ref({ x: 0, y: 0, z: 0 });

    const setCameraPosition = (position: { x: number; y: number; z: number }) => {
        cameraPosition.value = position;
    };

    const setCameraDirection = (direction: { x: number; y: number; z: number }) => {
        cameraDirection.value = direction;
    };

    const addScene = () => {
        const newScene: Scene = {
            id: uuidv4(),
            name: "New scene",
            background: 'https://cdn.aframe.io/360-image-gallery-boilerplate/img/cubes.jpg',
            circles: [],
            spheres: []
        };
        tour.value.scenes.push(newScene);
    };

    const setSceneName =  (sceneIndex: number, name: string) => {

        tour.value.scenes[sceneIndex].name = name;
  
      }

    const addCircle = (sceneIndex: number) => {
        const defaultCircle: CircleInfo = {
            id: uuidv4(),
            sceneIndex: sceneIndex,
            coordinates: [0, -5, -20],
            scale: 2,
            color: '#000000',
            onClickAction: {
                actionType: "Teleport",
                actionArgs: ""
            }
        };
        tour.value.scenes[sceneIndex].circles.push(defaultCircle);
    };

    const addSphere = (sceneIndex: number) => {
        const defaultSphere: SphereInfo = {
            id: uuidv4(),
            sceneIndex: sceneIndex,
            coordinates: [0, -5, -20],
            scale: 2,
            color: '#ffa500'
        };
        tour.value.scenes[sceneIndex].spheres.push(defaultSphere);
    };

    const editCircle = (sceneIndex: number, circleIndex: number, newCircleInfo: CircleInfo) => {
        tour.value.scenes[sceneIndex].circles[circleIndex] = newCircleInfo;
    };

    const deleteCircle = (sceneIndex: number, circleIndex: number) => {

        tour.value.scenes[sceneIndex].circles.splice(circleIndex, 1);
  
      }

    const editSphere = (sceneIndex: number, sphereIndex: number, sphereInfo: SphereInfo) => {
        tour.value.scenes[sceneIndex].spheres[sphereIndex] = sphereInfo;
    };

    const setSceneBackground = (sceneIndex: number, background: string) => {
        tour.value.scenes[sceneIndex].background = background;
    };

    const setCircleActionArgs = (sceneIndex: number, circleIndex: number, actionArgs: string) => {
        tour.value.scenes[sceneIndex].circles[circleIndex].onClickAction.actionArgs = actionArgs;
    };

    return {
        tour,
        cameraPosition,
        cameraDirection,
        setCameraPosition,
        setCameraDirection,
        addScene,
        setSceneName,
        addCircle,
        deleteCircle,
        addSphere,
        editCircle,
        editSphere,
        setSceneBackground,
        setCircleActionArgs
    };
});
