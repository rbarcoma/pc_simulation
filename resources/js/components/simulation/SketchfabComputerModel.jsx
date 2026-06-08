import { useEffect, useMemo, useState } from 'react';
import { Box3, CanvasTexture, MeshStandardMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const pcPartModels = {
  case: {
    url: '/models/pc-parts/case/scene.gltf',
    targetBox: [4.45, 3.05, 2.1],
    rotation: [0, Math.PI / 2, 0],
    position: [0, 0, 0],
  },
  motherboard: {
    url: '/models/pc-parts/motherboard/scene.gltf',
    fallbackUrls: ['/models/pc-parts/motherboarc/scene.gltf'],
    targetBox: [2.5, 2.0, 0.42],
    rotation: [0, 0, 0],
  },
  cpu: {
    url: '/models/pc-parts/cpu/scene.gltf',
    targetBox: [0.30, 0.30, 0.02],
    rotation: [Math.PI / 2, 0, 0],
  },
  cooler: {
    url: '/models/pc-parts/cooler/scene.gltf',
    targetBox: [1.4, 0.75, 0.42],
    rotation: [Math.PI / 2, 0, 0],
  },
  ram: {
    url: '/models/pc-parts/ram/scene.gltf',
    targetBox: [0.26, 1.1, 0.18],
    rotation: [Math.PI / 2, 0, Math.PI / 2],
  },
  storage: {
    url: '/models/pc-parts/storage/scene.gltf',
    targetBox: [0.88, 0.55, 0.16],
    rotation: [Math.PI / 2, 0, 0],
  },
  psu: {
    url: '/models/pc-parts/psu/scene.gltf',
    targetBox: [1.02, 0.68, 0.72],
    rotation: [0, 0, 0],
  },
  gpu: {
    url: '/models/pc-parts/gpu/scene.gltf',
    targetBox: [1.55, 0.42, 0.28],
    rotation: [Math.PI / 2, 0, 0],
  },
  fan: {
    url: '/models/pc-parts/fans/scene.gltf',
    targetBox: [0.52, 0.52, 0.12],
    rotation: [0, 0, 0],
  },
};

function normalizeScene(scene, { targetSize = 1, targetBox = null, rotation = [0, 0, 0] } = {}) {
  scene.position.set(0, 0, 0);
  scene.rotation.set(rotation[0] || 0, rotation[1] || 0, rotation[2] || 0);
  scene.scale.set(1, 1, 1);
  scene.updateWorldMatrix(true, true);

  const box = new Box3().setFromObject(scene);
  const center = new Vector3();
  const size = new Vector3();

  box.getCenter(center);
  box.getSize(size);

  const scale = targetBox
    ? Math.min(
      targetBox[0] / (size.x || 1),
      targetBox[1] / (size.y || 1),
      targetBox[2] / (size.z || 1),
    )
    : targetSize / (Math.max(size.x, size.y, size.z) || 1);

  scene.scale.setScalar(scale);
  scene.position.sub(center.multiplyScalar(scale));
}

function isGreenDominant(color) {
  return (
    color &&
    color.g > 0.02 &&
    color.g > color.r * 1.18 &&
    color.g > color.b * 1.12
  );
}

function replaceGreenTexture(texture, replacement = '#a855f7') {
  const image = texture?.image;
  if (!image || typeof document === 'undefined') return texture;

  const canvas = document.createElement('canvas');
  const width = image.naturalWidth || image.videoWidth || image.width;
  const height = image.naturalHeight || image.videoHeight || image.height;
  if (!width || !height) return texture;

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, width, height);

  const replacementColor = replacement.replace('#', '');
  const target = [
    parseInt(replacementColor.slice(0, 2), 16),
    parseInt(replacementColor.slice(2, 4), 16),
    parseInt(replacementColor.slice(4, 6), 16),
  ];

  const imageData = context.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  for (let index = 0; index < pixels.length; index += 4) {
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    const isGreenLed = green > 55 && green > red * 1.18 && green > blue * 1.12;

    if (isGreenLed) {
      const brightness = Math.max(green, red, blue) / 255;
      pixels[index] = Math.min(255, target[0] * brightness);
      pixels[index + 1] = Math.min(255, target[1] * brightness);
      pixels[index + 2] = Math.min(255, target[2] * brightness);
    }
  }

  context.putImageData(imageData, 0, 0);

  const nextTexture = new CanvasTexture(canvas);
  nextTexture.flipY = texture.flipY;
  nextTexture.wrapS = texture.wrapS;
  nextTexture.wrapT = texture.wrapT;
  nextTexture.magFilter = texture.magFilter;
  nextTexture.minFilter = texture.minFilter;
  nextTexture.colorSpace = texture.colorSpace;
  nextTexture.needsUpdate = true;

  return nextTexture;
}

function replaceLightTexture(texture, replacement = '#020617') {
  const image = texture?.image;
  if (!image || typeof document === 'undefined') return texture;

  const canvas = document.createElement('canvas');
  const width = image.naturalWidth || image.videoWidth || image.width;
  const height = image.naturalHeight || image.videoHeight || image.height;
  if (!width || !height) return texture;

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, width, height);

  const replacementColor = replacement.replace('#', '');
  const target = [
    parseInt(replacementColor.slice(0, 2), 16),
    parseInt(replacementColor.slice(2, 4), 16),
    parseInt(replacementColor.slice(4, 6), 16),
  ];

  const imageData = context.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  for (let index = 0; index < pixels.length; index += 4) {
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    const alpha = pixels[index + 3];
    const brightness = Math.max(red, green, blue);
    const colorSpread = Math.max(red, green, blue) - Math.min(red, green, blue);
    const isLightNeutral = alpha > 20 && brightness > 118 && colorSpread < 72;

    if (isLightNeutral) {
      pixels[index] = target[0];
      pixels[index + 1] = target[1];
      pixels[index + 2] = target[2];
    }
  }

  context.putImageData(imageData, 0, 0);

  const nextTexture = new CanvasTexture(canvas);
  nextTexture.flipY = texture.flipY;
  nextTexture.wrapS = texture.wrapS;
  nextTexture.wrapT = texture.wrapT;
  nextTexture.magFilter = texture.magFilter;
  nextTexture.minFilter = texture.minFilter;
  nextTexture.colorSpace = texture.colorSpace;
  nextTexture.needsUpdate = true;

  return nextTexture;
}

function prepareScene(scene, {
  active = false,
  activeMeshName = null,
  hiddenMeshName = null,
  replaceGreenWith = null,
  replaceLightWith = null,
  tintColor = null,
  emissiveColor = null,
  emissiveIntensity = 0,
  xray = false,
  opacity = 1,
} = {}) {
  const hiddenMeshNames = Array.isArray(hiddenMeshName) ? hiddenMeshName : [hiddenMeshName].filter(Boolean);

  scene.traverse((child) => {
    if (!child.isMesh) return;

    if (hiddenMeshNames.some((meshName) => child.name.toLowerCase().includes(meshName.toLowerCase()))) {
      child.visible = false;
      return;
    }

    child.castShadow = true;
    child.receiveShadow = true;
    const isActiveMesh = active && (!activeMeshName || child.name.toLowerCase().includes(activeMeshName.toLowerCase()));

    const materials = Array.isArray(child.material) ? child.material : [child.material];
    child.material = materials.map((material) => {
      const nextMaterial = material?.clone?.() || new MeshStandardMaterial({ color: '#cbd5e1' });
      nextMaterial.transparent = xray || opacity < 1;
      nextMaterial.opacity = xray ? 0.34 : opacity;
      nextMaterial.roughness = nextMaterial.roughness ?? 0.45;
      nextMaterial.metalness = nextMaterial.metalness ?? 0.18;

      if (tintColor) {
        nextMaterial.color?.set?.(tintColor);
      }

      if (replaceGreenWith) {
        if (nextMaterial.map) {
          nextMaterial.map = replaceGreenTexture(nextMaterial.map, replaceGreenWith);
        }

        if (nextMaterial.emissiveMap) {
          nextMaterial.emissiveMap = replaceGreenTexture(nextMaterial.emissiveMap, replaceGreenWith);
        }

        if (isGreenDominant(nextMaterial.color)) {
          nextMaterial.color.set(replaceGreenWith);
        }

        if (isGreenDominant(nextMaterial.emissive)) {
          nextMaterial.emissive?.set?.(replaceGreenWith);
          nextMaterial.emissiveIntensity = Math.max(nextMaterial.emissiveIntensity || 0, 0.65);
        }

        if (isGreenDominant(nextMaterial.specular)) {
          nextMaterial.specular.set(replaceGreenWith);
        }

        if (isGreenDominant(nextMaterial.specularColor)) {
          nextMaterial.specularColor.set(replaceGreenWith);
        }
      }

      if (replaceLightWith) {
        const color = nextMaterial.color;
        const colorSpread = color
          ? Math.max(color.r, color.g, color.b) - Math.min(color.r, color.g, color.b)
          : 0;
        const isLightMaterial =
          color &&
          Math.max(color.r, color.g, color.b) > 0.48 &&
          colorSpread < 0.28;

        if (nextMaterial.map) {
          nextMaterial.map = replaceLightTexture(nextMaterial.map, replaceLightWith);
        }

        if (nextMaterial.emissiveMap) {
          nextMaterial.emissiveMap = replaceLightTexture(nextMaterial.emissiveMap, replaceLightWith);
        }

        if (isLightMaterial) {
          nextMaterial.color.set(replaceLightWith);
        }
      }

      if (emissiveColor) {
        nextMaterial.emissive?.set?.(emissiveColor);
        nextMaterial.emissiveIntensity = emissiveIntensity;
      }

      if (isActiveMesh) {
        nextMaterial.emissive?.set?.('#0ea5e9');
        nextMaterial.emissiveIntensity = 0.18;
      }

      return nextMaterial;
    });

    if (child.material.length === 1) {
      child.material = child.material[0];
    }
  });
}

export function SketchfabComputerModel({
  partId,
  active = false,
  activeMeshName = null,
  hiddenMeshName = null,
  xray = false,
  opacity = 1,
  tintColor = null,
  emissiveColor = null,
  emissiveIntensity = 0,
  replaceGreenWith = null,
  replaceLightWith = null,
  fallback = null,
  onLoaded,
  ...transformOverrides
}) {
  const config = pcPartModels[partId];
  const [sourceScene, setSourceScene] = useState(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const urls = [config?.url, ...(config?.fallbackUrls || [])].filter(Boolean);

    if (urls.length === 0) {
      setUnavailable(true);
      return undefined;
    }

    let cancelled = false;
    const loader = new GLTFLoader();
    setUnavailable(false);

    const tryLoad = (index = 0) => {
      loader.load(
        urls[index],
        (gltf) => {
          if (cancelled) return;
          setSourceScene(gltf.scene);
          onLoaded?.();
        },
        undefined,
        () => {
          if (cancelled) return;

          if (index + 1 < urls.length) {
            tryLoad(index + 1);
            return;
          }

          setSourceScene(null);
          setUnavailable(true);
        },
      );
    };

    tryLoad();

    return () => {
      cancelled = true;
    };
  }, [config, onLoaded]);

  const scene = useMemo(() => {
    if (!sourceScene || unavailable) return null;

    const clonedScene = sourceScene.clone(true);

    const modelRotation = transformOverrides.rotation ?? config.rotation ?? [0, 0, 0];

    normalizeScene(clonedScene, {
      targetSize: transformOverrides.targetSize ?? config.targetSize,
      targetBox: transformOverrides.targetBox ?? config.targetBox,
      rotation: modelRotation,
    });
    prepareScene(clonedScene, {
      active,
      activeMeshName,
      hiddenMeshName,
      replaceGreenWith,
      replaceLightWith,
      tintColor,
      emissiveColor,
      emissiveIntensity,
      xray,
      opacity,
    });
    return clonedScene;
  }, [active, activeMeshName, config, emissiveColor, emissiveIntensity, hiddenMeshName, opacity, replaceGreenWith, replaceLightWith, sourceScene, tintColor, transformOverrides.rotation, transformOverrides.targetBox, transformOverrides.targetSize, unavailable, xray]);

  if (!scene) return fallback;

  return (
    <group
      position={transformOverrides.position ?? config.position ?? [0, 0, 0]}
      scale={transformOverrides.scale ?? config.scale ?? 1}
    >
      <primitive object={scene} />
    </group>
  );
}
