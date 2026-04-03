import { defineConfig, splitVendorChunkPlugin } from "vite";


export default defineConfig({
    base: "/solar/",
    plugins: [splitVendorChunkPlugin()],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules/three/examples/jsm/postprocessing") || id.includes("node_modules/three/examples/jsm/shaders")) {
                        return "three-postfx";
                    }

                    if (id.includes("node_modules/three/examples/jsm/renderers") || id.includes("node_modules/three/examples/jsm/objects") || id.includes("node_modules/three/examples/jsm/controls")) {
                        return "three-extras";
                    }

                    if (id.includes("node_modules/three")) {
                        return "three-core";
                    }

                    if (id.includes("node_modules/gsap")) {
                        return "gsap-vendor";
                    }
                }
            }
        }
    },
    server: {
        host: "0.0.0.0",
        port: 5173
    },
    preview: {
        host: "0.0.0.0",
        port: 4173
    }
});
