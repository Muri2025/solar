import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { Lensflare, LensflareElement } from "three/addons/objects/Lensflare.js";
import { SOLAR_BODIES, SUN_DATA } from "../config/solarData.js";
import { createBackground } from "./background.js";
import { createAtmosphereMaterial } from "../shaders/atmosphereShader.js";
import { createRingMaterial } from "../shaders/ringShader.js";
import { getSunRenderRadius, scaleOrbitDistance, scalePlanetRadius } from "../utils/scale.js";
import { createRadialTexture, loadOptionalTexture, loadTextureBundle } from "../utils/textures.js";

const tempVector = new THREE.Vector3();

function createLabel(text) {
    const element = document.createElement("div");
    element.className = "body-label";
    element.textContent = text;
    return new CSS2DObject(element);
}

function createOrbitLine(radius, color = "#6ba2e6") {
    const points = [];
    const segments = 256;

    for (let index = 0; index <= segments; index += 1) {
        const angle = (index / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    return new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: 0.16
        })
    );
}

export class SolarSystem {
    constructor(scene) {
        this.scene = scene;
        this.textureLoader = new THREE.TextureLoader();
        this.selectableMeshes = [];
        this.entries = new Map();
        this.bodyOrder = [];
        this.timeScale = 18;
        this.simulationDays = 0;
        this.baseDate = new Date();
        this.sunLight = null;
        this.sunEntry = null;
    }

    async init(renderer) {
        this.anisotropy = renderer.capabilities.getMaxAnisotropy();

        this.scene.add(createBackground());
        this.setupLighting();

        await this.createSun();
        await Promise.all(SOLAR_BODIES.map((bodyData) => this.createBody(bodyData)));

        this.setSelected("earth");
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight("#18304d", 0.58);
        const softFill = new THREE.HemisphereLight("#4b6f9f", "#06080d", 0.42);
        this.sunLight = new THREE.PointLight("#fff5dc", 8.6, 0, 2);

        this.scene.add(ambientLight);
        this.scene.add(softFill);
        this.scene.add(this.sunLight);
    }

    async createSun() {
        const radius = getSunRenderRadius();
        const group = new THREE.Group();
        const material = new THREE.MeshBasicMaterial({
            color: "#ffd26a"
        });

        const albedo = await loadOptionalTexture(this.textureLoader, SUN_DATA.textures.albedo, {
            anisotropy: this.anisotropy,
            color: true
        });

        if (albedo) {
            material.map = albedo;
        }

        const core = new THREE.Mesh(new THREE.SphereGeometry(radius, 96, 96), material);
        const haloA = new THREE.Mesh(
            new THREE.SphereGeometry(radius * 1.18, 72, 72),
            new THREE.MeshBasicMaterial({
                color: "#ffb347",
                transparent: true,
                opacity: 0.14,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            })
        );
        const haloB = new THREE.Mesh(
            new THREE.SphereGeometry(radius * 1.42, 72, 72),
            new THREE.MeshBasicMaterial({
                color: "#ff8b2c",
                transparent: true,
                opacity: 0.09,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            })
        );

        const label = createLabel(SUN_DATA.name);
        label.position.set(0, radius * 1.6, 0);

        group.add(core, haloA, haloB, label);
        this.scene.add(group);

        this.sunLight.add(this.createLensFlare());

        const entry = {
            key: SUN_DATA.key,
            data: SUN_DATA,
            group,
            orbitRoot: null,
            orbitSpinner: null,
            anchor: group,
            focusTarget: group,
            mesh: core,
            renderRadius: radius,
            orbitRadius: 0,
            label,
            haloA,
            haloB
        };

        core.userData.bodyKey = SUN_DATA.key;
        this.selectableMeshes.push(core);
        this.entries.set(SUN_DATA.key, entry);
        this.bodyOrder.push(SUN_DATA.key);
        this.sunEntry = entry;
    }

    createLensFlare() {
        const lensflare = new Lensflare();
        const flareTexture = createRadialTexture({
            inner: "rgba(255,255,255,1)",
            mid: "rgba(255,214,128,0.55)",
            outer: "rgba(255,255,255,0)"
        });
        const secondaryTexture = createRadialTexture({
            inner: "rgba(255,218,125,0.7)",
            mid: "rgba(255,119,43,0.24)",
            outer: "rgba(0,0,0,0)"
        });

        lensflare.addElement(new LensflareElement(flareTexture, 420, 0, new THREE.Color("#ffd78d")));
        lensflare.addElement(new LensflareElement(secondaryTexture, 120, 0.2, new THREE.Color("#ffc26c")));
        lensflare.addElement(new LensflareElement(secondaryTexture, 200, 0.45, new THREE.Color("#ff914d")));
        lensflare.addElement(new LensflareElement(flareTexture, 78, 0.68, new THREE.Color("#9fd4ff")));

        return lensflare;
    }

    async createBody(bodyData) {
        const renderRadius = scalePlanetRadius(bodyData.radiusEarth);
        const orbitRadius = scaleOrbitDistance(bodyData.orbitAU);

        const orbitRoot = new THREE.Group();
        orbitRoot.rotation.z = THREE.MathUtils.degToRad(bodyData.orbitInclination);
        this.scene.add(orbitRoot);

        const orbitSpinner = new THREE.Group();
        orbitSpinner.rotation.y = this.getInitialOrbitAngle(bodyData.key);
        orbitRoot.add(orbitSpinner);

        const orbitLine = createOrbitLine(orbitRadius);
        orbitRoot.add(orbitLine);

        const anchor = new THREE.Group();
        anchor.position.x = orbitRadius;
        orbitSpinner.add(anchor);

        const tiltGroup = new THREE.Group();
        tiltGroup.rotation.z = THREE.MathUtils.degToRad(bodyData.axialTilt);
        anchor.add(tiltGroup);

        const material = new THREE.MeshPhysicalMaterial({
            color: bodyData.baseColor,
            roughness: bodyData.material.roughness ?? 0.8,
            metalness: bodyData.material.metalness ?? 0.02,
            clearcoat: bodyData.material.clearcoat ?? 0,
            clearcoatRoughness: bodyData.material.clearcoatRoughness ?? 0.5,
            emissive: new THREE.Color(bodyData.baseColor).multiplyScalar(0.12),
            emissiveIntensity: 0.65
        });

        const textures = await loadTextureBundle(this.textureLoader, bodyData.textures, this.anisotropy);
        material.map = textures.albedo ?? null;
        material.normalMap = textures.normal ?? null;
        material.roughnessMap = textures.roughness ?? null;
        material.emissiveMap = textures.emissive ?? null;
        if (textures.emissive) {
            material.emissive = new THREE.Color("#ffb473");
            material.emissiveIntensity = 1.2;
        }

        if (material.normalMap && bodyData.material.bumpScale) {
            material.normalScale.setScalar(bodyData.material.bumpScale);
        }

        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(renderRadius, 80, 80),
            material
        );
        mesh.userData.bodyKey = bodyData.key;
        tiltGroup.add(mesh);

        const label = createLabel(bodyData.name);
        label.position.set(0, renderRadius * 1.6, 0);
        anchor.add(label);

        let atmosphereMaterial = null;
        if (bodyData.atmosphere) {
            atmosphereMaterial = createAtmosphereMaterial({});
            const atmosphere = new THREE.Mesh(
                new THREE.SphereGeometry(renderRadius * 1.075, 80, 80),
                atmosphereMaterial
            );
            tiltGroup.add(atmosphere);
        }

        let cloudLayer = null;
        if (bodyData.clouds && textures.clouds) {
            const cloudMaterial = new THREE.MeshStandardMaterial({
                map: textures.clouds,
                transparent: true,
                opacity: 0.92,
                depthWrite: false
            });
            cloudLayer = new THREE.Mesh(
                new THREE.SphereGeometry(renderRadius * 1.022, 72, 72),
                cloudMaterial
            );
            tiltGroup.add(cloudLayer);
        }

        let ringMaterial = null;
        if (bodyData.rings) {
            ringMaterial = createRingMaterial({
                baseColor: bodyData.rings.tint,
                shadowColor: bodyData.rings.shadow
            });

            const ringMesh = new THREE.Mesh(
                new THREE.RingGeometry(
                    renderRadius * bodyData.rings.innerRadius,
                    renderRadius * bodyData.rings.outerRadius,
                    256
                ),
                ringMaterial
            );
            ringMesh.rotation.x = Math.PI * 0.5;
            tiltGroup.add(ringMesh);
        }

        const entry = {
            key: bodyData.key,
            data: bodyData,
            group: orbitRoot,
            orbitRoot,
            orbitSpinner,
            anchor,
            focusTarget: anchor,
            mesh,
            renderRadius,
            orbitRadius,
            label,
            cloudLayer,
            atmosphereMaterial,
            ringMaterial
        };

        this.entries.set(bodyData.key, entry);
        this.bodyOrder.push(bodyData.key);
        this.selectableMeshes.push(mesh);
    }

    getInitialOrbitAngle(key) {
        const phaseMap = {
            mercury: 0.35,
            venus: 1.15,
            earth: 2.1,
            mars: 2.85,
            jupiter: 0.95,
            saturn: 1.95,
            uranus: 4.05,
            neptune: 5.1
        };

        return phaseMap[key] ?? 0;
    }

    update(deltaSeconds) {
        this.simulationDays += deltaSeconds * this.timeScale;

        if (this.sunEntry) {
            const time = performance.now() * 0.001;
            this.sunEntry.haloA.scale.setScalar(1 + Math.sin(time * 0.8) * 0.02);
            this.sunEntry.haloB.scale.setScalar(1 + Math.cos(time * 0.52) * 0.03);
            this.sunEntry.mesh.rotation.y += deltaSeconds * 0.08;
        }

        for (const key of this.bodyOrder) {
            if (key === "sun") {
                continue;
            }

            const entry = this.entries.get(key);
            const { data } = entry;

            entry.orbitSpinner.rotation.y =
                (this.simulationDays / data.orbitalPeriodDays) * Math.PI * 2;

            entry.mesh.rotation.y =
                (this.simulationDays * 24 / data.rotationHours) * Math.PI * 2;

            if (entry.cloudLayer) {
                entry.cloudLayer.rotation.y += deltaSeconds * 0.045;
            }

            entry.anchor.getWorldPosition(tempVector);
            const lightDirection = tempVector.clone().normalize().multiplyScalar(-1);

            if (entry.atmosphereMaterial) {
                entry.atmosphereMaterial.uniforms.uLightDirection.value.copy(lightDirection);
            }

            if (entry.ringMaterial) {
                entry.ringMaterial.uniforms.uLightDirection.value.copy(lightDirection);
            }
        }
    }

    setTimeScale(value) {
        this.timeScale = value;
    }

    getSimulationDate() {
        return new Date(this.baseDate.getTime() + this.simulationDays * 24 * 60 * 60 * 1000);
    }

    getBodyEntries() {
        return this.bodyOrder.map((key) => this.entries.get(key));
    }

    getEntry(key) {
        return this.entries.get(key);
    }

    getSelectableMeshes() {
        return this.selectableMeshes;
    }

    getBodyFromObject(object) {
        const key = object.userData.bodyKey;
        return this.entries.get(key);
    }

    setSelected(key) {
        for (const entry of this.entries.values()) {
            entry.label.element.classList.toggle("is-selected", entry.key === key);
        }
    }
}
