import * as THREE from "three";

export async function loadOptionalTexture(loader, url, options = {}) {
    if (!url) {
        return null;
    }

    try {
        const texture = await loader.loadAsync(url);
        texture.anisotropy = options.anisotropy ?? 1;

        if (options.color) {
            texture.colorSpace = THREE.SRGBColorSpace;
        }

        if (options.repeat) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(options.repeat.x, options.repeat.y);
        }

        return texture;
    } catch (error) {
        console.warn(`Texture not found: ${url}`);
        return null;
    }
}

export async function loadTextureBundle(loader, textureMap, anisotropy = 1) {
    const entries = await Promise.all(
        Object.entries(textureMap ?? {}).map(async ([key, url]) => {
            const texture = await loadOptionalTexture(loader, url, {
                anisotropy,
                color: key === "albedo" || key === "emissive" || key === "clouds"
            });

            return [key, texture];
        })
    );

    return Object.fromEntries(entries);
}

export function createRadialTexture({
    size = 256,
    inner = "rgba(255,255,255,1)",
    mid = "rgba(255,200,80,0.5)",
    outer = "rgba(0,0,0,0)"
} = {}) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    const gradient = context.createRadialGradient(
        size * 0.5,
        size * 0.5,
        0,
        size * 0.5,
        size * 0.5,
        size * 0.5
    );

    gradient.addColorStop(0, inner);
    gradient.addColorStop(0.35, mid);
    gradient.addColorStop(1, outer);

    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}
