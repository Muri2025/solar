import * as THREE from "three";

const vertexShader = `
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const fragmentShader = `
uniform vec3 uLightDirection;
uniform vec3 uRayleighColor;
uniform vec3 uMieColor;

varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    vec3 normalDirection = normalize(vWorldNormal);
    vec3 lightDirection = normalize(uLightDirection);

    float sunAmount = max(dot(normalDirection, lightDirection), 0.0);
    float fresnel = pow(1.0 - max(dot(viewDirection, normalDirection), 0.0), 3.2);
    float mie = pow(max(dot(viewDirection, lightDirection), 0.0), 4.0);
    float nightWrap = pow(1.0 - sunAmount, 1.8);

    vec3 rayleigh = uRayleighColor * (0.45 + sunAmount * 0.85);
    vec3 mieScattering = uMieColor * (0.1 + mie * 1.6);
    vec3 nightGlow = uRayleighColor * 0.16 * nightWrap;

    float alpha = clamp(fresnel * 0.95 + nightWrap * 0.06, 0.0, 0.95);
    vec3 color = rayleigh * fresnel + mieScattering + nightGlow;

    gl_FragColor = vec4(color, alpha);
}
`;

export function createAtmosphereMaterial({
    rayleighColor = "#73b7ff",
    mieColor = "#f7d89c"
} = {}) {
    return new THREE.ShaderMaterial({
        uniforms: {
            uLightDirection: { value: new THREE.Vector3(1, 0, 0) },
            uRayleighColor: { value: new THREE.Color(rayleighColor) },
            uMieColor: { value: new THREE.Color(mieColor) }
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
}
