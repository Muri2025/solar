import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const fragmentShader = `
uniform vec3 uLightDirection;
uniform vec3 uBaseColor;
uniform vec3 uShadowColor;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

float bandNoise(float radius) {
    return 0.58
        + 0.18 * sin(radius * 140.0)
        + 0.1 * sin(radius * 325.0 + 0.45)
        + 0.05 * sin(radius * 710.0 + 1.2);
}

void main() {
    vec2 centerUv = vUv - 0.5;
    float radius = length(centerUv) * 2.0;

    float disc = smoothstep(0.36, 0.4, radius) * (1.0 - smoothstep(0.88, 0.96, radius));
    float cassini = smoothstep(0.62, 0.66, radius) - smoothstep(0.67, 0.71, radius);
    float rings = clamp(bandNoise(radius), 0.18, 1.0);
    float alpha = disc * rings * (1.0 - cassini * 0.92);

    if (alpha <= 0.01) discard;

    vec3 normalDirection = normalize(vWorldNormal);
    vec3 lightDirection = normalize(uLightDirection);
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float diffuse = max(dot(normalDirection, lightDirection), 0.0);
    float forwardScatter = pow(1.0 - abs(dot(viewDirection, normalDirection)), 1.4);

    vec3 color = mix(uShadowColor, uBaseColor, diffuse * 0.85 + 0.15);
    color += uBaseColor * forwardScatter * 0.18;

    gl_FragColor = vec4(color, alpha * 0.88);
}
`;

export function createRingMaterial({
    baseColor = "#ead4a5",
    shadowColor = "#6b5734"
} = {}) {
    return new THREE.ShaderMaterial({
        uniforms: {
            uLightDirection: { value: new THREE.Vector3(1, 0, 0) },
            uBaseColor: { value: new THREE.Color(baseColor) },
            uShadowColor: { value: new THREE.Color(shadowColor) }
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
    });
}
