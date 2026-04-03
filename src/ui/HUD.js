import { formatTilt } from "../utils/scale.js";

function speedFromSlider(value) {
    if (value <= 0) {
        return 0;
    }

    return Number((Math.pow(1.085, value) * 0.42).toFixed(2));
}

function formatSpeedLabel(daysPerSecond) {
    if (daysPerSecond <= 0) {
        return "Pausado";
    }

    if (daysPerSecond < 1) {
        return `${(daysPerSecond * 24).toFixed(1)} h/s`;
    }

    if (daysPerSecond < 30) {
        return `${daysPerSecond.toFixed(1)} d/s`;
    }

    if (daysPerSecond < 365) {
        return `${(daysPerSecond / 30).toFixed(1)} mo/s`;
    }

    return `${(daysPerSecond / 365).toFixed(1)} a/s`;
}

export class HUD {
    constructor() {
        this.refs = {
            appStatus: document.getElementById("appStatus"),
            simDate: document.getElementById("simDate"),
            timeSpeed: document.getElementById("timeSpeed"),
            timeSpeedValue: document.getElementById("timeSpeedValue"),
            focusReset: document.getElementById("focusReset"),
            toggleLeftPanel: document.getElementById("toggleLeftPanel"),
            toggleRightPanel: document.getElementById("toggleRightPanel"),
            bodyList: document.getElementById("bodyList"),
            selectionHint: document.getElementById("selectionHint"),
            infoCategory: document.getElementById("infoCategory"),
            infoName: document.getElementById("infoName"),
            infoSubtitle: document.getElementById("infoSubtitle"),
            infoDescription: document.getElementById("infoDescription"),
            infoStats: document.getElementById("infoStats")
        };

        this.bodyButtons = new Map();
        this.onBodySelected = null;
        this.onReset = null;
        this.onTimeScaleChange = null;
        this.onToggleLeftPanel = null;
        this.onToggleRightPanel = null;
    }

    bind() {
        this.refs.timeSpeed.addEventListener("input", () => {
            const speed = speedFromSlider(Number(this.refs.timeSpeed.value));
            this.refs.timeSpeedValue.textContent = formatSpeedLabel(speed);

            if (this.onTimeScaleChange) {
                this.onTimeScaleChange(speed);
            }
        });

        this.refs.focusReset.addEventListener("click", () => {
            if (this.onReset) {
                this.onReset();
            }
        });

        this.refs.toggleLeftPanel.addEventListener("click", () => {
            if (this.onToggleLeftPanel) {
                this.onToggleLeftPanel();
            }
        });

        this.refs.toggleRightPanel.addEventListener("click", () => {
            if (this.onToggleRightPanel) {
                this.onToggleRightPanel();
            }
        });
    }

    initializeBodies(entries) {
        this.refs.bodyList.innerHTML = "";
        this.bodyButtons.clear();

        for (const entry of entries) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "body-chip";
            button.innerHTML = `<strong>${entry.data.name}</strong><span>${entry.data.category}</span>`;
            button.addEventListener("click", () => {
                if (this.onBodySelected) {
                    this.onBodySelected(entry.key);
                }
            });

            this.refs.bodyList.appendChild(button);
            this.bodyButtons.set(entry.key, button);
        }
    }

    setSelection(entry) {
        this.refs.infoCategory.textContent = entry.data.category;
        this.refs.infoName.textContent = entry.data.name;
        this.refs.infoSubtitle.textContent = entry.data.subtitle;
        this.refs.infoDescription.textContent = entry.data.description;
        this.refs.infoStats.innerHTML = "";

        const stats = {
            escala: entry.key === "sun" ? "Fonte central" : `${entry.orbitRadius.toFixed(1)} u orbitais`,
            raio: `${entry.renderRadius.toFixed(2)} u`,
            inclinacao: entry.data.axialTilt != null ? formatTilt(entry.data.axialTilt) : "N/A",
            ...entry.data.stats
        };

        for (const [label, value] of Object.entries(stats)) {
            const row = document.createElement("div");
            row.innerHTML = `<dt>${label}</dt><dd>${value}</dd>`;
            this.refs.infoStats.appendChild(row);
        }

        for (const [key, button] of this.bodyButtons) {
            button.classList.toggle("is-active", key === entry.key);
        }
    }

    updateFrame({ date, status }) {
        this.refs.simDate.textContent = new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "full"
        }).format(date);
        this.refs.appStatus.textContent = status;
    }

    setHovering(isHovering) {
        this.refs.selectionHint.textContent = isHovering ? "Alvo detectado" : "Raycast ativo";
    }

    setInitialSpeed() {
        const speed = speedFromSlider(Number(this.refs.timeSpeed.value));
        this.refs.timeSpeedValue.textContent = formatSpeedLabel(speed);
        return speed;
    }

    setPanelState({ leftCollapsed, rightCollapsed }) {
        this.refs.toggleLeftPanel.classList.toggle("is-active", leftCollapsed);
        this.refs.toggleRightPanel.classList.toggle("is-active", rightCollapsed);
        this.refs.toggleLeftPanel.setAttribute("aria-pressed", String(leftCollapsed));
        this.refs.toggleRightPanel.setAttribute("aria-pressed", String(rightCollapsed));
        this.refs.toggleLeftPanel.textContent = leftCollapsed ? "Mostrar esquerda" : "Ocultar esquerda";
        this.refs.toggleRightPanel.textContent = rightCollapsed ? "Mostrar direita" : "Ocultar direita";
    }
}
