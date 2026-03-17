import * as THREE from "three";

const TIMEOUT_MS = 10_000;  // how long before a stuck texture triggers a retry
const MAX_RETRIES = 3;

/**
 * Loads a single texture with timeout + retry logic.
 */
function loadTextureWithRetry(
  loader: THREE.TextureLoader,
  url: string,
  retries = MAX_RETRIES
): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    let settled = false;

    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;

      if (retries > 0) {
        console.warn(`⏱ Texture load timed out, retrying (${retries} left): ${url}`);
        loadTextureWithRetry(loader, url, retries - 1).then(resolve).catch(reject);
      } else {
        reject(new Error(`Texture load timed out after ${MAX_RETRIES} retries: ${url}`));
      }
    }, TIMEOUT_MS);

    loader.load(
      url,
      (texture) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        resolve(texture);
      },
      undefined,
      (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);

        if (retries > 0) {
          console.warn(`❌ Texture load failed, retrying (${retries} left): ${url}`, err);
          loadTextureWithRetry(loader, url, retries - 1).then(resolve).catch(reject);
        } else {
          reject(err);
        }
      }
    );
  });
}

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
  loader.crossOrigin = "anonymous";

  const textures: Record<string, THREE.Texture> = {};
  let loadedCount = 0;

  manager.onProgress = (_url, itemsLoaded, itemsTotal) => {
    loadedCount = itemsLoaded;
    const percent = Math.round((loadedCount / itemsTotal) * 100);
    if (onProgress) onProgress(percent);
  };

  const promises = urls.map(async (url) => {
    const texture = await loadTextureWithRetry(loader, url);
    textures[url] = texture;
  });

  await Promise.all(promises);
  if (onProgress) onProgress(100);

  return textures;
}