import * as THREE from "three";

/**
 * Preloads all textures and reports progress.
 * @param urls - Array of texture URLs (e.g., from S3)
 * @param onProgress - Optional callback for progress updates (0–100)
 * @returns Promise<Record<string, THREE.Texture>>
 */
export async function loadAllTextures(
  urls: string[],
  onProgress?: (progress: number) => void
): Promise<Record<string, THREE.Texture>> {
  const manager = new THREE.LoadingManager();
  const loader = new THREE.TextureLoader(manager);
  loader.crossOrigin = "anonymous"; // needed for S3 or external URLs

  const textures: Record<string, THREE.Texture> = {};
  let loadedCount = 0;

  // Progress tracking
  manager.onProgress = (_url, itemsLoaded, itemsTotal) => {
    loadedCount = itemsLoaded;
    const percent = Math.round((loadedCount / itemsTotal) * 100);
    if (onProgress) onProgress(percent);
  };

  // Promise wrappers for each texture
  const promises = urls.map(
    (url) =>
      new Promise<void>((resolve, reject) => {
        loader.load(
          url,
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.needsUpdate = true;
            textures[url] = texture;
            resolve();
          },
          undefined,
          (err) => {
            console.error(`❌ Failed to load texture: ${url}`, err);
            reject(err);
          }
        );
      })
  );

  // Wait for all textures to load
  await Promise.all(promises);
  if (onProgress) onProgress(100);
  console.log("✅ All textures loaded:", Object.keys(textures));

  return textures;
}
