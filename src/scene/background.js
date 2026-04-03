import * as THREE from "three";

function createStarLayer({
    count,
    radius,
    size,
    hue = 0.58,
    saturation = 0.25,
    lightness = 0.92
}) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i += 1) {
        const stride = i * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
        const distance = radius + Math.random() * radius * 0.45;

        positions[stride] = distance * Math.sin(phi) * Math.cos(theta);
        positions[stride + 1] = distance * Math.cos(phi);
        positions[stride + 2] = distance * Math.sin(phi) * Math.sin(theta);

        color.setHSL(
            hue + THREE.MathUtils.randFloatSpread(0.06),
            saturation + Math.random() * 0.15,
            lightness - Math.random() * 0.15
        );

        colors[stride] = color.r;
        colors[stride + 1] = color.g;
        colors[stride + 2] = color.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    return new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
            size,
            vertexColors: true,
            transparent: true,
            opacity: 0.95,
            sizeAttenuation: true,
            depthWrite: false
        })
    );
}

export function createBackground() {
    const group = new THREE.Group();

    const backdrop = new THREE.Mesh(
        new THREE.SphereGeometry(2600, 64, 64),
        new THREE.ShaderMaterial({
            side: THREE.BackSide,
            depthWrite: false,
            uniforms: {
                uTop: { value: new THREE.Color("#081120") },
                uBottom: { value: new THREE.Color("#010308") },
                uNebulaA: { value: new THREE.Color("#183b6b") },
                uNebulaB: { value: new THREE.Color("#672b2a") }
            },
            vertexShader: `
                varying vec3 vPosition;
                void main() {
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 uTop;
                uniform vec3 uBottom;
                uniform vec3 uNebulaA;
                uniform vec3 uNebulaB;
                varying vec3 vPosition;

                void main() {
                    vec3 direction = normalize(vPosition);
                    float vertical = smoothstep(-0.5, 0.95, direction.y);
                    float nebulaA = smoothstep(0.26, 0.92, sin(direction.x * 4.5 + direction.z * 2.5) * 0.5 + 0.5);
                    float nebulaB = smoothstep(0.35, 0.95, sin(direction.z * 5.5 - direction.y * 3.0 + 1.3) * 0.5 + 0.5);
                    vec3 color = mix(uBottom, uTop, vertical);
                    color += uNebulaA * nebulaA * 0.18;
                    color += uNebulaB * nebulaB * 0.11;
                    gl_FragColor = vec4(color, 1.0);
                }
            `
        })
    );

    group.add(backdrop);
    group.add(createStarLayer({ count: 4200, radius: 620, size: 1.55 }));
    group.add(createStarLayer({ count: 2200, radius: 900, size: 1.15, hue: 0.12, saturation: 0.12, lightness: 0.97 }));

    return group;
}
