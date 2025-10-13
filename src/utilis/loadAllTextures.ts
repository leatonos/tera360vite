import * as THREE from "three";

/**
 * Preloads all textures and returns a dictionary { url: THREE.Texture }.
 * @param urls - Array of texture URLs (e.g., from S3)
 * @returns Promise<Record<string, THREE.Texture>>
 */
export async function loadAllTextures(urls: string[]): Promise<Record<string, THREE.Texture>> {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.crossOrigin = "anonymous"; // required for S3 or external URLs

  const textures: Record<string, THREE.Texture> = {};

  const promises = urls.map(
    (url) =>
      new Promise<void>((resolve, reject) => {
        textureLoader.load(
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

  await Promise.all(promises);
  console.log("✅ All textures loaded:", Object.keys(textures));

  return textures;
}
