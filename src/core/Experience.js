import * as THREE from "three";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import { CameraDirector } from "./CameraDirector.js";
import { createComposer } from "./postprocessing.js";
import { SolarSystem } from "../scene/SolarSystem.js";
import { HUD } from "../ui/HUD.js";

export class Experience {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.pointer = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.hovered = null;
        this.selectedKey = "earth";
        this.leftCollapsed = false;
        this.rightCollapsed = false;

        this.camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.05, 5000);
        this.cameraFillLight = new THREE.DirectionalLight("#9fc4ff", 0.9);
        this.cameraFillLight.position.set(22, 16, 28);
        this.camera.add(this.cameraFillLight);
        this.scene.add(this.camera);

        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            logarithmicDepthBuffer: true
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.08;

        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.domElement.id = "label-layer";
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.labelRenderer.domElement);

        this.cameraDirector = new CameraDirector(this.camera, this.renderer.domElement);
        this.solarSystem = new SolarSystem(this.scene);
        this.hud = new HUD();
        this.composerBundle = createComposer(
            this.renderer,
            this.scene,
            this.camera,
            window.innerWidth,
            window.innerHeight
        );
        this.composerBundle.setSize(window.innerWidth, window.innerHeight, this.renderer.getPixelRatio());
    }

    async start() {
        this.hud.bind();
        this.bindUI();
        this.bindEvents();
        this.hud.setPanelState({
            leftCollapsed: this.leftCollapsed,
            rightCollapsed: this.rightCollapsed
        });

        await this.solarSystem.init(this.renderer);

        this.hud.initializeBodies(this.solarSystem.getBodyEntries());
        this.solarSystem.setTimeScale(this.hud.setInitialSpeed());
        this.selectBody(this.selectedKey, false);
        this.cameraDirector.reset(true);

        this.renderer.setAnimationLoop(() => this.update());
    }

    bindUI() {
        this.hud.onBodySelected = (key) => {
            this.selectBody(key, true);
        };

        this.hud.onReset = () => {
            this.cameraDirector.reset();
        };

        this.hud.onTimeScaleChange = (speed) => {
            this.solarSystem.setTimeScale(speed);
        };

        this.hud.onToggleLeftPanel = () => {
            this.leftCollapsed = !this.leftCollapsed;
            document.body.classList.toggle("is-left-collapsed", this.leftCollapsed);
            this.hud.setPanelState({
                leftCollapsed: this.leftCollapsed,
                rightCollapsed: this.rightCollapsed
            });
        };

        this.hud.onToggleRightPanel = () => {
            this.rightCollapsed = !this.rightCollapsed;
            document.body.classList.toggle("is-right-collapsed", this.rightCollapsed);
            this.hud.setPanelState({
                leftCollapsed: this.leftCollapsed,
                rightCollapsed: this.rightCollapsed
            });
        };
    }

    bindEvents() {
        window.addEventListener("resize", () => this.handleResize());
        this.renderer.domElement.addEventListener("pointermove", (event) => this.handlePointerMove(event));
        this.renderer.domElement.addEventListener("click", (event) => this.handleClick(event));
    }

    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const pixelRatio = Math.min(window.devicePixelRatio, 2);

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.setSize(width, height);
        this.labelRenderer.setSize(width, height);
        this.composerBundle.setSize(width, height, pixelRatio);
    }

    handlePointerMove(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const hit = this.getIntersection();
        this.hovered = hit?.object ?? null;
        document.body.classList.toggle("is-hovering", Boolean(this.hovered));
        this.hud.setHovering(Boolean(this.hovered));
    }

    handleClick(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const hit = this.getIntersection();
        if (!hit) {
            return;
        }

        const entry = this.solarSystem.getBodyFromObject(hit.object);
        if (entry) {
            this.selectBody(entry.key, true);
        }
    }

    getIntersection() {
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersections = this.raycaster.intersectObjects(this.solarSystem.getSelectableMeshes(), false);
        return intersections[0] ?? null;
    }

    selectBody(key, animate = true) {
        const entry = this.solarSystem.getEntry(key);
        if (!entry) {
            return;
        }

        this.selectedKey = key;
        this.solarSystem.setSelected(key);
        this.hud.setSelection(entry);

        if (animate) {
            this.cameraDirector.focus(entry);
        }
    }

    update() {
        const deltaSeconds = Math.min(this.clock.getDelta(), 0.05);

        this.solarSystem.update(deltaSeconds);
        this.cameraDirector.update();

        this.composerBundle.composer.render();
        this.labelRenderer.render(this.scene, this.camera);
        this.hud.updateFrame({
            date: this.solarSystem.getSimulationDate(),
            status: this.cameraDirector.getStatusText()
        });
    }
}
