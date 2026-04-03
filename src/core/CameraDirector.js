import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { gsap } from "gsap";

const tempTarget = new THREE.Vector3();
const tempView = new THREE.Vector3();

export class CameraDirector {
    constructor(camera, domElement) {
        this.camera = camera;
        this.controls = new OrbitControls(camera, domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.06;
        this.controls.rotateSpeed = 0.65;
        this.controls.zoomSpeed = 0.85;
        this.controls.panSpeed = 0.45;
        this.controls.minDistance = 8;
        this.controls.maxDistance = 320;
        this.controls.maxPolarAngle = Math.PI * 0.94;

        this.homePosition = new THREE.Vector3(118, 54, 136);
        this.homeTarget = new THREE.Vector3(0, 0, 0);
        this.statusText = "Panorama orbital";

        this.camera.position.copy(this.homePosition);
        this.controls.target.copy(this.homeTarget);
        this.controls.update();
    }

    focus(entry, instant = false) {
        entry.focusTarget.getWorldPosition(tempTarget);

        const currentDirection = tempView
            .copy(this.camera.position)
            .sub(this.controls.target)
            .normalize();

        const solarDirection = tempTarget.lengthSq() > 0.0001
            ? tempTarget.clone().normalize().negate()
            : currentDirection.clone();

        const direction = solarDirection.multiplyScalar(0.65).add(currentDirection.multiplyScalar(0.35)).normalize();
        const radius = entry.renderRadius;
        const desiredDistance = THREE.MathUtils.clamp(radius * 9.5, 14, radius * 15 + 26);
        const destination = tempTarget.clone()
            .add(direction.multiplyScalar(desiredDistance))
            .add(new THREE.Vector3(radius * 0.45, radius * 0.18, radius * 0.32));

        this.controls.minDistance = Math.max(radius * 3.2, 12);
        this.controls.maxDistance = Math.max(desiredDistance * 3.4, radius * 28);
        this.statusText = `Travando camera em ${entry.data.name}`;

        if (instant) {
            this.camera.position.copy(destination);
            this.controls.target.copy(tempTarget);
            this.controls.update();
            return;
        }

        gsap.killTweensOf(this.camera.position);
        gsap.killTweensOf(this.controls.target);

        gsap.to(this.camera.position, {
            x: destination.x,
            y: destination.y,
            z: destination.z,
            duration: 1.6,
            ease: "power3.inOut",
            onUpdate: () => this.controls.update()
        });

        gsap.to(this.controls.target, {
            x: tempTarget.x,
            y: tempTarget.y,
            z: tempTarget.z,
            duration: 1.6,
            ease: "power3.inOut",
            onUpdate: () => this.controls.update()
        });
    }

    reset(instant = false) {
        this.controls.minDistance = 8;
        this.controls.maxDistance = 320;
        this.statusText = "Panorama orbital";

        if (instant) {
            this.camera.position.copy(this.homePosition);
            this.controls.target.copy(this.homeTarget);
            this.controls.update();
            return;
        }

        gsap.killTweensOf(this.camera.position);
        gsap.killTweensOf(this.controls.target);

        gsap.to(this.camera.position, {
            x: this.homePosition.x,
            y: this.homePosition.y,
            z: this.homePosition.z,
            duration: 1.45,
            ease: "power3.inOut",
            onUpdate: () => this.controls.update()
        });

        gsap.to(this.controls.target, {
            x: this.homeTarget.x,
            y: this.homeTarget.y,
            z: this.homeTarget.z,
            duration: 1.45,
            ease: "power3.inOut",
            onUpdate: () => this.controls.update()
        });
    }

    update() {
        this.controls.update();
    }

    getStatusText() {
        return this.statusText;
    }
}
