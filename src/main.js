import { Experience } from "./core/Experience.js";

const canvas = document.getElementById("scene-canvas");
const experience = new Experience(canvas);

experience.start().catch((error) => {
    console.error("Falha ao iniciar a simulacao orbital.", error);
    const status = document.getElementById("appStatus");
    if (status) {
        status.textContent = "Falha ao inicializar";
    }
});
