export const SUN_DATA = {
    key: "sun",
    name: "Sol",
    category: "Estrela",
    subtitle: "Fonte de iluminacao central com bloom, flare e halo volumetrico.",
    description: "O centro da cena usa emissao elevada, glare cinematografico e camadas de corona para sustentar a leitura do sistema em escala comprimida.",
    stats: {
        temperatura: "5.778 K",
        brilho: "Luminosidade dominante",
        tipo: "Ana amarela",
        papel: "Fonte de energia"
    },
    textures: {
        albedo: "/assets/textures/planets/sun_albedo.jpg"
    }
};

export const SOLAR_BODIES = [
    {
        key: "mercury",
        name: "Mercurio",
        category: "Planeta rochoso",
        subtitle: "Superficie craterada com relevo agressivo e transito rapido ao redor do Sol.",
        description: "Mercurio recebe reflexos duros e contraste alto para reforcar a proximidade extrema com a estrela central.",
        radiusEarth: 0.383,
        orbitAU: 0.39,
        orbitalPeriodDays: 87.97,
        rotationHours: 1407.6,
        axialTilt: 0.034,
        orbitInclination: 7.0,
        baseColor: "#a7a7a5",
        stats: {
            temperatura: "167 C media",
            diametro: "4.879 km",
            gravidade: "3.7 m/s²",
            tipo: "Silicato"
        },
        material: {
            roughness: 0.92,
            metalness: 0.02,
            bumpScale: 0.22
        },
        textures: {
            albedo: "/assets/textures/planets/mercury_albedo.jpg"
        }
    },
    {
        key: "venus",
        name: "Venus",
        category: "Planeta atmosferico",
        subtitle: "Envelope denso de nuvens com resposta especular controlada e brilho quente.",
        description: "Venus aparece como um globo quase opaco, com nuvens altamente refletivas e rotacao retrograda.",
        radiusEarth: 0.949,
        orbitAU: 0.72,
        orbitalPeriodDays: 224.7,
        rotationHours: -5832.5,
        axialTilt: 177.4,
        orbitInclination: 3.4,
        baseColor: "#d9b689",
        stats: {
            temperatura: "464 C media",
            diametro: "12.104 km",
            gravidade: "8.87 m/s²",
            atmosfera: "CO2 denso"
        },
        material: {
            roughness: 0.78,
            metalness: 0.01,
            clearcoat: 0.12
        },
        textures: {
            albedo: "/assets/textures/planets/venus_albedo.jpg"
        }
    },
    {
        key: "earth",
        name: "Terra",
        category: "Planeta oceanico",
        subtitle: "Atmosfera baseada em espalhamento Rayleigh/Mie e camada de nuvens independente.",
        description: "A Terra combina materiais PBR, emissao noturna opcional, nuvens semi-transparentes e um shell atmosferico customizado para destacar o limbo azul.",
        radiusEarth: 1,
        orbitAU: 1,
        orbitalPeriodDays: 365.25,
        rotationHours: 24,
        axialTilt: 23.4,
        orbitInclination: 0,
        baseColor: "#4ea7ff",
        atmosphere: true,
        clouds: true,
        stats: {
            temperatura: "15 C media",
            diametro: "12.742 km",
            agua: "71% da superficie",
            atmosfera: "N2 / O2"
        },
        material: {
            roughness: 0.58,
            metalness: 0.02,
            clearcoat: 0.25,
            clearcoatRoughness: 0.42,
            bumpScale: 0.18
        },
        textures: {
            albedo: "/assets/textures/planets/earth_albedo.jpg",
            emissive: "/assets/textures/planets/earth_night.jpg",
            clouds: "/assets/textures/planets/earth_clouds.jpg"
        }
    },
    {
        key: "mars",
        name: "Marte",
        category: "Planeta desertico",
        subtitle: "Detalhe superficial seco com tons ferruginosos e orbitas de transicao cinematica.",
        description: "Marte usa relevo marcado e paleta terrosa para preservar leitura mesmo em enquadramentos distantes.",
        radiusEarth: 0.532,
        orbitAU: 1.52,
        orbitalPeriodDays: 687,
        rotationHours: 24.6,
        axialTilt: 25.2,
        orbitInclination: 1.85,
        baseColor: "#c86a45",
        stats: {
            temperatura: "-63 C media",
            diametro: "6.779 km",
            gravidade: "3.71 m/s²",
            atmosfera: "CO2 tenue"
        },
        material: {
            roughness: 0.88,
            metalness: 0.01,
            bumpScale: 0.16
        },
        textures: {
            albedo: "/assets/textures/planets/mars_albedo.jpg"
        }
    },
    {
        key: "jupiter",
        name: "Jupiter",
        category: "Gigante gasoso",
        subtitle: "Bandas volumosas, especularidade suave e escala comprimida com leitura cinematografica.",
        description: "Jupiter prioriza faixas atmosfericas, brilho quente e movimento calmo para funcionar como ancora visual do sistema externo.",
        radiusEarth: 11.21,
        orbitAU: 5.2,
        orbitalPeriodDays: 4331,
        rotationHours: 9.9,
        axialTilt: 3.1,
        orbitInclination: 1.3,
        baseColor: "#d7a57c",
        stats: {
            temperatura: "-108 C topo",
            diametro: "139.820 km",
            gravidade: "24.79 m/s²",
            destaque: "Grande Mancha"
        },
        material: {
            roughness: 0.67,
            metalness: 0,
            clearcoat: 0.08
        },
        textures: {
            albedo: "/assets/textures/planets/jupiter_albedo.jpg"
        }
    },
    {
        key: "saturn",
        name: "Saturno",
        category: "Gigante anelado",
        subtitle: "Anel procedural sombreado por shader customizado com faixas espectrais e transparencias.",
        description: "Saturno combina material PBR de baixa rugosidade com um shader de aneis em camadas para capturar divisorias e brilho anisotropico.",
        radiusEarth: 9.45,
        orbitAU: 9.58,
        orbitalPeriodDays: 10747,
        rotationHours: 10.7,
        axialTilt: 26.7,
        orbitInclination: 2.5,
        baseColor: "#dfc384",
        rings: {
            innerRadius: 1.48,
            outerRadius: 2.75,
            tint: "#ead4a5",
            shadow: "#6b5734"
        },
        stats: {
            temperatura: "-139 C topo",
            diametro: "116.460 km",
            densidade: "0.687 g/cm³",
            destaque: "Sistema de aneis"
        },
        material: {
            roughness: 0.64,
            metalness: 0,
            clearcoat: 0.04
        },
        textures: {
            albedo: "/assets/textures/planets/saturn_albedo.jpg"
        }
    },
    {
        key: "uranus",
        name: "Urano",
        category: "Gigante de gelo",
        subtitle: "Disco frio com inclinacao extrema e composicao visual de baixa saturacao.",
        description: "Urano gira quase deitado, criando uma silhueta peculiar que contrasta com os demais gigantes gasosos.",
        radiusEarth: 4.01,
        orbitAU: 19.2,
        orbitalPeriodDays: 30589,
        rotationHours: -17.2,
        axialTilt: 97.8,
        orbitInclination: 0.8,
        baseColor: "#8fd5dc",
        rings: {
            innerRadius: 1.62,
            outerRadius: 1.95,
            tint: "#a8edf5",
            shadow: "#4f7e85"
        },
        stats: {
            temperatura: "-197 C topo",
            diametro: "50.724 km",
            gravidade: "8.69 m/s²",
            destaque: "Inclinacao axial"
        },
        material: {
            roughness: 0.7,
            metalness: 0,
            clearcoat: 0.06
        },
        textures: {
            albedo: "/assets/textures/planets/uranus_albedo.jpg"
        }
    },
    {
        key: "neptune",
        name: "Netuno",
        category: "Gigante de gelo",
        subtitle: "Superficie gasosa profunda com bloom controlado nos realces azuis.",
        description: "Netuno fecha o sistema com um material frio e brilhante, mantendo escala legivel sem perder impacto visual.",
        radiusEarth: 3.88,
        orbitAU: 30.05,
        orbitalPeriodDays: 59800,
        rotationHours: 16.1,
        axialTilt: 28.3,
        orbitInclination: 1.8,
        baseColor: "#386df7",
        stats: {
            temperatura: "-201 C topo",
            diametro: "49.244 km",
            gravidade: "11.15 m/s²",
            destaque: "Ventos supersonicos"
        },
        material: {
            roughness: 0.66,
            metalness: 0,
            clearcoat: 0.05
        },
        textures: {
            albedo: "/assets/textures/planets/neptune_albedo.jpg"
        }
    }
];
