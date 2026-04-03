import * as THREE from "three";

export async function loadOptionalTexture(loader, url, options = {}) {
    if (!url) {
        return null;
    }

    try {
        const normalizedUrl = url.startsWith("/")
            ? `${import.meta.env.BASE_URL}${url.replace(/^\/+/, "")}`
            : url;
        const texture = await loader.loadAsync(normalizedUrl);
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

function mulberry32(seed) {
    let value = seed;
    return function random() {
        value |= 0;
        value = (value + 0x6d2b79f5) | 0;
        let temp = Math.imul(value ^ (value >>> 15), 1 | value);
        temp = (temp + Math.imul(temp ^ (temp >>> 7), 61 | temp)) ^ temp;
        return ((temp ^ (temp >>> 14)) >>> 0) / 4294967296;
    };
}

function hashString(text) {
    let hash = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
        hash ^= text.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function makeCanvas(size) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    return canvas;
}

function textureFromCanvas(canvas, { anisotropy = 8, color = true } = {}) {
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = anisotropy;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    if (color) {
        texture.colorSpace = THREE.SRGBColorSpace;
    }
    return texture;
}

function paintVignette(context, size, opacity = 0.36) {
    const vignette = context.createRadialGradient(
        size * 0.45,
        size * 0.38,
        size * 0.08,
        size * 0.5,
        size * 0.5,
        size * 0.72
    );
    vignette.addColorStop(0, "rgba(255,255,255,0.18)");
    vignette.addColorStop(0.45, "rgba(255,255,255,0.03)");
    vignette.addColorStop(1, `rgba(0,0,0,${opacity})`);
    context.fillStyle = vignette;
    context.fillRect(0, 0, size, size);
}

function drawBands(context, random, size, palette, bandHeight = 24, blur = 0, alpha = 0.85) {
    for (let y = 0; y < size; y += bandHeight) {
        const pick = palette[Math.floor(random() * palette.length)];
        const height = Math.max(8, bandHeight * (0.7 + random() * 1.2));
        context.filter = blur > 0 ? `blur(${blur}px)` : "none";
        context.fillStyle = pick.replace("__A__", alpha.toFixed(2));
        context.fillRect(-6, y, size + 12, height);
    }
    context.filter = "none";
}

function drawCraterField(context, random, size, fills, strokes, density = 900) {
    for (let index = 0; index < density; index += 1) {
        const radius = 1 + Math.pow(random(), 2) * 18;
        const x = random() * size;
        const y = random() * size;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = fills[Math.floor(random() * fills.length)];
        context.fill();
        context.lineWidth = Math.max(0.8, radius * 0.16);
        context.strokeStyle = strokes[Math.floor(random() * strokes.length)];
        context.stroke();
    }
}

function drawSpeckles(context, random, size, count, hue, satBase, lightBase, alphaBase = 0.18) {
    for (let index = 0; index < count; index += 1) {
        const x = random() * size;
        const y = random() * size;
        const radius = 0.5 + random() * 6;
        const lightness = lightBase + (random() - 0.5) * 22;
        const saturation = satBase + (random() - 0.5) * 20;
        context.fillStyle = `hsla(${hue + (random() - 0.5) * 18} ${saturation}% ${lightness}% / ${alphaBase + random() * 0.2})`;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
    }
}

function drawContinents(context, random, size, ocean, landPalette, beachColor) {
    context.fillStyle = ocean;
    context.fillRect(0, 0, size, size);

    for (let layer = 0; layer < 6; layer += 1) {
        context.beginPath();
        const startX = random() * size;
        const startY = random() * size;
        context.moveTo(startX, startY);

        const points = 16 + Math.floor(random() * 10);
        for (let point = 0; point <= points; point += 1) {
            const angle = (point / points) * Math.PI * 2;
            const radius = size * (0.08 + random() * 0.18);
            const x = startX + Math.cos(angle) * radius * (0.7 + random() * 0.9);
            const y = startY + Math.sin(angle) * radius * (0.7 + random() * 1.25);
            context.lineTo(x, y);
        }

        context.closePath();
        context.fillStyle = landPalette[Math.floor(random() * landPalette.length)];
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = beachColor;
        context.stroke();
    }
}

function drawCloudMap(context, random, size) {
    context.clearRect(0, 0, size, size);
    for (let index = 0; index < 520; index += 1) {
        const x = random() * size;
        const y = random() * size;
        const radiusX = 16 + random() * 90;
        const radiusY = 8 + random() * 26;
        context.beginPath();
        context.ellipse(x, y, radiusX, radiusY, random() * Math.PI, 0, Math.PI * 2);
        context.fillStyle = `rgba(255,255,255,${0.03 + random() * 0.16})`;
        context.fill();
    }
}

function drawNightLights(context, random, size) {
    context.clearRect(0, 0, size, size);
    for (let index = 0; index < 1600; index += 1) {
        const x = random() * size;
        const y = random() * size;
        const radius = 0.6 + random() * 1.8;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(255,${180 + Math.floor(random() * 40)},${90 + Math.floor(random() * 40)},${0.05 + random() * 0.35})`;
        context.fill();
    }
}

function buildRockySet(key, baseColor, size, random, options = {}) {
    const color = new THREE.Color(baseColor);
    const hsl = {};
    color.getHSL(hsl);

    const albedoCanvas = makeCanvas(size);
    const albedo = albedoCanvas.getContext("2d");
    albedo.fillStyle = `hsl(${hsl.h * 360} ${Math.max(hsl.s * 100, 20)}% ${Math.max(hsl.l * 100, 22)}%)`;
    albedo.fillRect(0, 0, size, size);
    drawSpeckles(albedo, random, size, options.speckleCount ?? 1800, hsl.h * 360, 18 + hsl.s * 40, 38 + hsl.l * 20);
    drawCraterField(
        albedo,
        random,
        size,
        options.craterFills ?? ["rgba(255,255,255,0.04)", "rgba(0,0,0,0.06)", "rgba(120,85,60,0.08)"],
        options.craterStrokes ?? ["rgba(255,255,255,0.06)", "rgba(0,0,0,0.09)"],
        options.craterDensity ?? 700
    );
    paintVignette(albedo, size, 0.28);

    const bumpCanvas = makeCanvas(size);
    const bump = bumpCanvas.getContext("2d");
    bump.fillStyle = "rgb(120,120,120)";
    bump.fillRect(0, 0, size, size);
    drawCraterField(
        bump,
        random,
        size,
        ["rgba(220,220,220,0.16)", "rgba(65,65,65,0.12)"],
        ["rgba(250,250,250,0.08)", "rgba(15,15,15,0.12)"],
        options.craterDensity ?? 700
    );

    const roughnessCanvas = makeCanvas(size);
    const rough = roughnessCanvas.getContext("2d");
    rough.fillStyle = options.roughnessBase ?? "rgb(210,210,210)";
    rough.fillRect(0, 0, size, size);
    drawSpeckles(rough, random, size, 1400, 0, 0, 70, 0.04);

    return {
        albedo: textureFromCanvas(albedoCanvas),
        bump: textureFromCanvas(bumpCanvas, { color: false }),
        roughness: textureFromCanvas(roughnessCanvas, { color: false })
    };
}

function buildEarthSet(size, random) {
    const albedoCanvas = makeCanvas(size);
    const albedo = albedoCanvas.getContext("2d");
    drawContinents(
        albedo,
        random,
        size,
        "#1b5eaa",
        ["#2b7b42", "#507d2f", "#8d7c4f", "#4e6931"],
        "rgba(222,205,156,0.45)"
    );
    drawSpeckles(albedo, random, size, 2200, 195, 42, 52, 0.08);
    paintVignette(albedo, size, 0.2);

    const bumpCanvas = makeCanvas(size);
    const bump = bumpCanvas.getContext("2d");
    bump.fillStyle = "rgb(112,112,112)";
    bump.fillRect(0, 0, size, size);
    drawSpeckles(bump, random, size, 3600, 0, 0, 70, 0.05);

    const roughnessCanvas = makeCanvas(size);
    const rough = roughnessCanvas.getContext("2d");
    rough.fillStyle = "rgb(150,150,150)";
    rough.fillRect(0, 0, size, size);
    drawSpeckles(rough, random, size, 1600, 0, 0, 62, 0.04);

    const cloudsCanvas = makeCanvas(size);
    drawCloudMap(cloudsCanvas.getContext("2d"), random, size);

    const emissiveCanvas = makeCanvas(size);
    drawNightLights(emissiveCanvas.getContext("2d"), random, size);

    return {
        albedo: textureFromCanvas(albedoCanvas),
        bump: textureFromCanvas(bumpCanvas, { color: false }),
        roughness: textureFromCanvas(roughnessCanvas, { color: false }),
        clouds: textureFromCanvas(cloudsCanvas),
        emissive: textureFromCanvas(emissiveCanvas)
    };
}

function buildVenusSet(size, random) {
    const albedoCanvas = makeCanvas(size);
    const albedo = albedoCanvas.getContext("2d");
    albedo.fillStyle = "#b98d57";
    albedo.fillRect(0, 0, size, size);
    drawBands(albedo, random, size, [
        "hsla(35 48% 68% / __A__)",
        "hsla(31 36% 58% / __A__)",
        "hsla(42 52% 74% / __A__)"
    ], 34, 8, 0.52);
    drawSpeckles(albedo, random, size, 900, 34, 48, 62, 0.08);
    paintVignette(albedo, size, 0.24);

    const roughnessCanvas = makeCanvas(size);
    const rough = roughnessCanvas.getContext("2d");
    rough.fillStyle = "rgb(168,168,168)";
    rough.fillRect(0, 0, size, size);

    return {
        albedo: textureFromCanvas(albedoCanvas),
        roughness: textureFromCanvas(roughnessCanvas, { color: false })
    };
}

function buildGasGiantSet(key, size, random) {
    const palettes = {
        jupiter: ["hsla(28 44% 70% / __A__)", "hsla(22 28% 54% / __A__)", "hsla(36 52% 78% / __A__)", "hsla(14 34% 46% / __A__)"],
        saturn: ["hsla(40 52% 74% / __A__)", "hsla(34 38% 62% / __A__)", "hsla(48 62% 80% / __A__)", "hsla(28 24% 54% / __A__)"],
        uranus: ["hsla(184 44% 74% / __A__)", "hsla(190 28% 66% / __A__)", "hsla(178 36% 80% / __A__)"],
        neptune: ["hsla(217 68% 54% / __A__)", "hsla(208 52% 42% / __A__)", "hsla(225 74% 63% / __A__)"]
    };

    const albedoCanvas = makeCanvas(size);
    const albedo = albedoCanvas.getContext("2d");
    albedo.fillStyle = key === "neptune" ? "#2d5de8" : key === "uranus" ? "#84d5dc" : key === "saturn" ? "#d2ba81" : "#c99b76";
    albedo.fillRect(0, 0, size, size);
    drawBands(albedo, random, size, palettes[key], key === "saturn" ? 28 : 22, key === "uranus" ? 5 : 3, 0.72);

    if (key === "jupiter") {
        albedo.fillStyle = "rgba(181,96,64,0.6)";
        albedo.beginPath();
        albedo.ellipse(size * 0.64, size * 0.58, size * 0.12, size * 0.075, -0.1, 0, Math.PI * 2);
        albedo.fill();
    }

    if (key === "neptune") {
        albedo.fillStyle = "rgba(210,230,255,0.24)";
        albedo.beginPath();
        albedo.ellipse(size * 0.44, size * 0.43, size * 0.11, size * 0.06, 0.25, 0, Math.PI * 2);
        albedo.fill();
    }

    paintVignette(albedo, size, 0.2);

    const roughnessCanvas = makeCanvas(size);
    const rough = roughnessCanvas.getContext("2d");
    rough.fillStyle = key === "jupiter" ? "rgb(146,146,146)" : "rgb(138,138,138)";
    rough.fillRect(0, 0, size, size);
    drawBands(rough, random, size, ["rgba(90,90,90,__A__)", "rgba(210,210,210,__A__)"], 30, 2, 0.08);

    return {
        albedo: textureFromCanvas(albedoCanvas),
        roughness: textureFromCanvas(roughnessCanvas, { color: false })
    };
}

export function createProceduralPlanetMaps({
    key,
    baseColor,
    size = 1024
}) {
    const random = mulberry32(hashString(key));

    switch (key) {
        case "earth":
            return buildEarthSet(size, random);
        case "venus":
            return buildVenusSet(size, random);
        case "jupiter":
        case "saturn":
        case "uranus":
        case "neptune":
            return buildGasGiantSet(key, size, random);
        case "mars":
            return buildRockySet(key, baseColor, size, random, {
                craterDensity: 540,
                speckleCount: 2600,
                craterFills: ["rgba(255,255,255,0.03)", "rgba(90,40,25,0.08)", "rgba(180,110,70,0.07)"],
                roughnessBase: "rgb(200,200,200)"
            });
        case "mercury":
            return buildRockySet(key, baseColor, size, random, {
                craterDensity: 920,
                speckleCount: 2000
            });
        default:
            return buildRockySet(key, baseColor, size, random, {
                craterDensity: 620,
                speckleCount: 1700
            });
    }
}

function canvasFromImage(image) {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    return { canvas, context };
}

export function deriveEarthMaterialMaps(albedoTexture) {
    if (!albedoTexture?.image?.width) {
        return {};
    }

    const { canvas, context } = canvasFromImage(albedoTexture.image);
    const { width, height } = canvas;
    const source = context.getImageData(0, 0, width, height);
    const bumpData = new ImageData(width, height);
    const roughnessData = new ImageData(width, height);

    for (let index = 0; index < source.data.length; index += 4) {
        const red = source.data[index];
        const green = source.data[index + 1];
        const blue = source.data[index + 2];
        const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
        const waterMask = blue > green + 12 && blue > red + 18 ? 1 : 0;
        const landHeight = Math.max(0, green - blue) * 0.7 + luminance * 0.22;
        const bumpValue = THREE.MathUtils.clamp(waterMask ? 108 + luminance * 0.08 : 128 + landHeight * 0.55, 0, 255);
        const roughValue = THREE.MathUtils.clamp(waterMask ? 38 + luminance * 0.05 : 132 + (255 - luminance) * 0.18, 0, 255);

        bumpData.data[index] = bumpValue;
        bumpData.data[index + 1] = bumpValue;
        bumpData.data[index + 2] = bumpValue;
        bumpData.data[index + 3] = 255;

        roughnessData.data[index] = roughValue;
        roughnessData.data[index + 1] = roughValue;
        roughnessData.data[index + 2] = roughValue;
        roughnessData.data[index + 3] = 255;
    }

    const bumpCanvas = makeCanvas(width);
    bumpCanvas.height = height;
    bumpCanvas.getContext("2d").putImageData(bumpData, 0, 0);

    const roughCanvas = makeCanvas(width);
    roughCanvas.height = height;
    roughCanvas.getContext("2d").putImageData(roughnessData, 0, 0);

    return {
        bump: textureFromCanvas(bumpCanvas, { color: false }),
        roughness: textureFromCanvas(roughCanvas, { color: false })
    };
}

export function deriveRockyMaterialMaps(albedoTexture) {
    if (!albedoTexture?.image?.width) {
        return {};
    }

    const { canvas, context } = canvasFromImage(albedoTexture.image);
    const { width, height } = canvas;
    const source = context.getImageData(0, 0, width, height);
    const bumpData = new ImageData(width, height);
    const roughnessData = new ImageData(width, height);

    for (let index = 0; index < source.data.length; index += 4) {
        const red = source.data[index];
        const green = source.data[index + 1];
        const blue = source.data[index + 2];
        const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
        const contrast = Math.abs(red - green) + Math.abs(green - blue) + Math.abs(red - blue);
        const bumpValue = THREE.MathUtils.clamp(90 + luminance * 0.35 + contrast * 0.22, 0, 255);
        const roughValue = THREE.MathUtils.clamp(148 + (255 - luminance) * 0.24 + contrast * 0.08, 0, 255);

        bumpData.data[index] = bumpValue;
        bumpData.data[index + 1] = bumpValue;
        bumpData.data[index + 2] = bumpValue;
        bumpData.data[index + 3] = 255;

        roughnessData.data[index] = roughValue;
        roughnessData.data[index + 1] = roughValue;
        roughnessData.data[index + 2] = roughValue;
        roughnessData.data[index + 3] = 255;
    }

    const bumpCanvas = makeCanvas(width);
    bumpCanvas.height = height;
    bumpCanvas.getContext("2d").putImageData(bumpData, 0, 0);

    const roughCanvas = makeCanvas(width);
    roughCanvas.height = height;
    roughCanvas.getContext("2d").putImageData(roughnessData, 0, 0);

    return {
        bump: textureFromCanvas(bumpCanvas, { color: false }),
        roughness: textureFromCanvas(roughCanvas, { color: false })
    };
}
