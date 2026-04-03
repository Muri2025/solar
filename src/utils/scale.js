export function scaleOrbitDistance(orbitAU) {
    return 16 + Math.log2(orbitAU * 3.6 + 1) * 36;
}

export function scalePlanetRadius(radiusEarth) {
    return Math.max(0.68, Math.pow(radiusEarth, 0.53) * 2.05);
}

export function getSunRenderRadius() {
    return 13.5;
}

export function formatTilt(degrees) {
    return `${Math.abs(degrees).toFixed(1)} deg`;
}
