import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCanvasStore = defineStore('tres', () => {
  
    const canvasRef = ref<HTMLCanvasElement | null>(null)

  function setCanvas(el: HTMLCanvasElement | null) {
    canvasRef.value = el
  }

  return { canvasRef, setCanvas }
})
