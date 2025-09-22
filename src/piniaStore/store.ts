import { defineStore } from 'pinia';
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import type { CircleInfo, SceneInfo, SphereInfo, Tour } from '../types';

export const useTourStore = defineStore('tour', () => {
    
    const tour = ref<Tour>({
        _id: '',
        name: "New tour",
        scenes: [
            {
                id: uuidv4(),
                name: "New scene",
                background: 'https://pedrobaptista.com/photos360/welder_01.jpg',
                circles: [] as CircleInfo[],
                spheres: [] as SphereInfo[]
            }
        ] as SceneInfo[],
    });

    const currentSceneIndex = ref(0);

    const cameraPosition = ref({ x: 0, y: 0, z: 0 });
    const cameraDirection = ref({ x: 0, y: 0, z: 0 });

   
    const selectedCircle = ref<CircleInfo | null>(null);

    const setSelectedCircle = (circle: CircleInfo | null) => {
        selectedCircle.value = circle;
    }

    const setTour = (newTour: Tour) => {
        tour.value = newTour;
    }

    const setCameraPosition = (position: { x: number; y: number; z: number }) => {
        cameraPosition.value = position;
    };
 
    const setCameraDirection = (direction: { x: number; y: number; z: number }) => {
        cameraDirection.value = direction;
    };

    const setCurrentSceneIndex = (index: number) => {
        currentSceneIndex.value = index;
        selectedCircle.value = null;
    };

    const setTourName = (name: string) => {
        tour.value.name = name;
    };

    const addScene = () => {
        const newScene: SceneInfo = {
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
  
    };

    const addCircle = (sceneIndex: number) => {
        const defaultCircle: CircleInfo = {
            id: uuidv4(),
            sceneIndex: sceneIndex,
            coordinates: [0, -0.5, -1],
            scale: 0.2,
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
        currentSceneIndex,
        selectedCircle,
        setSelectedCircle,
        setTour,
        setCurrentSceneIndex,
        setCameraPosition,
        setCameraDirection,
        setTourName,
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
