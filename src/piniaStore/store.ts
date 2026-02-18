import { defineStore } from 'pinia';
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import type { CircleInfo, SceneInfo, SphereInfo, Tour, ViewType } from '../types';

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
        iframeLink:''
    });

    const tourState = ref<ViewType>('360Tour')

    const setTourState = (newState:ViewType) => {
        tourState.value = newState
    }

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

    const setIframeLink = (link:string) => {
        tour.value.iframeLink = link
    }

    const addScene = () => {
        const newScene: SceneInfo = {
            id: uuidv4(),
            name: "New scene",
            background: 'https://cdn.aframe.io/360-image-gallery-boilerplate/img/cubes.jpg',
            thumbnail: null,
            rotation: 0,
            circles: [],
            spheres: []
        };
        tour.value.scenes.push(newScene);
    };

    const deleteScene = (sceneIndex: number) => {
        if (tour.value.scenes.length <= 1) {
            alert("Cannot delete the last scene.");
            return;
        }

        tour.value.scenes.splice(sceneIndex, 1);

    }

    const setSceneName =  (sceneIndex: number, name: string) => {

        tour.value.scenes[sceneIndex].name = name;
  
    };

    const setSceneRotation = (sceneIndex: number, rotation: number) => {
        tour.value.scenes[sceneIndex].rotation = rotation;
    }

    const addCircle = (sceneIndex: number) => {
        const defaultCircle: CircleInfo = {
            id: uuidv4(),
            sceneIndex: sceneIndex,
            coordinates: [-2, -14, -23],
            scale: 0.5,
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
        console.log('Circle Edited')
        tour.value.scenes[sceneIndex].circles[circleIndex] = newCircleInfo;
        selectedCircle.value = newCircleInfo
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

    const setSceneThumbnail = (sceneIndex: number, thumbnail: string) => {
        tour.value.scenes[sceneIndex].thumbnail = thumbnail;
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
        setIframeLink,
        addScene,
        setSceneRotation,
        deleteScene,
        setSceneName,
        addCircle,
        deleteCircle,
        addSphere,
        editCircle,
        editSphere,
        setSceneBackground,
        setSceneThumbnail,
        setCircleActionArgs,
        tourState,
        setTourState
    };
});