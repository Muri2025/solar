import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";

export function createComposer(renderer, scene, camera, width, height) {
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.15, 0.75, 0.72);
    bloomPass.threshold = 0.55;
    bloomPass.strength = 1.08;
    bloomPass.radius = 0.72;

    const fxaaPass = new ShaderPass(FXAAShader);
    const outputPass = new OutputPass();

    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(fxaaPass);
    composer.addPass(outputPass);

    return {
        composer,
        setSize(nextWidth, nextHeight, pixelRatio) {
            composer.setSize(nextWidth, nextHeight);
            fxaaPass.material.uniforms.resolution.value.set(
                1 / (nextWidth * pixelRatio),
                1 / (nextHeight * pixelRatio)
            );
        }
    };
}
