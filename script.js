/* Motor 3D do Planetário Solar (Three.js) - CORES ORIGINAIS */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. SETUP DE CENA, CÂMERA E RENDERER
    const canvas = document.querySelector("#webgl-canvas");
    const scene = new THREE.Scene();
    
    // Câmera (Campo de visão amplo)
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    // Posição inicial visualizando todo o sistema de cima
    camera.position.set(0, 80, 150);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // 2. ORBIT CONTROLS (Navegação Espacial)
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 600;
    controls.minDistance = 5;

    // 3. ILUMINAÇÃO
    // Luz ambiente suave
    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);
    
    // A Luz do Sol (PointLight irradiando do centro)
    const sunLight = new THREE.PointLight(0xffffff, 2, 500);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // 4. FUNDO ESTRELADO (Original procedural de pontos)
    const createStars = () => {
        const starGeom = new THREE.BufferGeometry();
        const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15 });
        const starPositions = [];
        for(let i=0; i<4000; i++) {
            const x = (Math.random() - 0.5) * 1000;
            const y = (Math.random() - 0.5) * 1000;
            const z = (Math.random() - 0.5) * 1000;
            // Evitar estrelas dentro do sistema solar interior
            if (Math.abs(x) > 150 || Math.abs(y) > 150 || Math.abs(z) > 150) {
                starPositions.push(x, y, z);
            }
        }
        starGeom.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
        const stars = new THREE.Points(starGeom, starMat);
        scene.add(stars);
    }
    createStars();

    // 5. BANCO DE DADOS DOS PLANETAS - CORES SÓLIDAS ORIGINAIS
    const systemData = [
        { name: "Mercúrio", radius: 0.38, distance: 15, period: 0.24, color: 0x8c8c8c },
        { name: "Vênus",    radius: 0.95, distance: 22, period: 0.61, color: 0xffd085 },
        { name: "Terra",    radius: 1.0,  distance: 30, period: 1.0,  color: 0x4b9fe3 },
        { name: "Marte",    radius: 0.53, distance: 40, period: 1.88, color: 0xe27b58 },
        { name: "Júpiter",  radius: 6.0,  distance: 65, period: 11.86, color: 0xd39c7e },
        { name: "Saturno",  radius: 5.0,  distance: 90, period: 29.45, color: 0xf5d996, hasRings: true },
        { name: "Urano",    radius: 3.0,  distance: 115,period: 84.0,  color: 0x93cdf1, hasRings: true },
        { name: "Netuno",   radius: 2.8,  distance: 135,period: 164.8, color: 0x3d5ef9 }
    ];

    // O Sol de Cor Sólida com Efeito Fictício
    const sunGeom = new THREE.SphereGeometry(8, 64, 64);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffd11a }); // basic material to always be bright
    const sun = new THREE.Mesh(sunGeom, sunMat);
    scene.add(sun);

    // Glow do Sol
    const glowGeom = new THREE.SphereGeometry(8.5, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xffa500, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
    const sunGlow = new THREE.Mesh(glowGeom, glowMat);
    scene.add(sunGlow);

    // Variáveis da Missão Espacial
    let missionActive = false;
    let currentMissionTween = null;
    let earthLocalPivot = null; 
    let moonMesh = null;
    
    // Construção Procedural e Detalhada do Foguete
    const rocket = new THREE.Group();
    
    // Fuselagem Principal (Cilindro Branco)
    const bodyGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.2, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.3, roughness: 0.4 });
    const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
    bodyMesh.rotation.x = Math.PI / 2; // Gira pra ficar deitado no eixo Z (que é onde o lookAt aponta)
    rocket.add(bodyMesh);

    // Bico do Foguete (Cone Vermelho)
    const noseGeom = new THREE.ConeGeometry(0.04, 0.1, 16);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xdd0000, metalness: 0.2, roughness: 0.5 });
    const noseMesh = new THREE.Mesh(noseGeom, noseMat);
    noseMesh.rotation.x = Math.PI / 2;
    noseMesh.position.z = 0.15; // Anda um pouco pra frente (Z Positivo)
    rocket.add(noseMesh);

    // Aletas/Asas nas bases (Esguias)
    const finGeom = new THREE.BoxGeometry(0.01, 0.1, 0.08); 
    const finMat = new THREE.MeshStandardMaterial({ color: 0xdd0000 });
    
    const fin1 = new THREE.Mesh(finGeom, finMat);
    fin1.position.set(0.04, 0, -0.07);
    const fin2 = new THREE.Mesh(finGeom, finMat);
    fin2.position.set(-0.04, 0, -0.07);
    const fin3 = new THREE.Mesh(finGeom, finMat);
    fin3.rotation.z = Math.PI / 2;
    fin3.position.set(0, 0.04, -0.07);
    const fin4 = new THREE.Mesh(finGeom, finMat);
    fin4.rotation.z = Math.PI / 2;
    fin4.position.set(0, -0.04, -0.07);
    
    rocket.add(fin1, fin2, fin3, fin4);

    // Propulsor Traseiro (Chama Fogo)
    const flameGeom = new THREE.ConeGeometry(0.03, 0.15, 16);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const rocketFlame = new THREE.Mesh(flameGeom, flameMat);
    rocketFlame.rotation.x = -Math.PI / 2; // Aponta pra trás (-Z)
    rocketFlame.position.z = -0.17; 
    rocket.add(rocketFlame);

    let currentPath = null;
    let rocketProgress = { p: 0 };
    let savedTimeMultiplier = 50;

    // Array para segurar as instâncias com a matemática do pivô
    const planetInstances = [];

    // Gerador de Planetas
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

    systemData.forEach(data => {
        // Objeto Pivô
        const orbitObj = new THREE.Group();
        scene.add(orbitObj);

        // O Mesh com Cores SÓLIDAS Originais (Sem Texturas de Imagem)
        const mat = new THREE.MeshStandardMaterial({ 
            color: data.color, 
            roughness: 0.7, 
            metalness: 0.1 
        });
        const planetMesh = new THREE.Mesh(sphereGeometry, mat);
        
        planetMesh.scale.setScalar(data.radius);
        planetMesh.position.x = data.distance;

        // Se tiver anéis (Saturno / Urano)
        if(data.hasRings) {
            const innerR = data.radius * 1.2;
            const outerR = data.radius * 2.2;
            const ringGeom = new THREE.RingGeometry(innerR, outerR, 64);
            const ringMat = new THREE.MeshStandardMaterial({ 
                color: data.color, 
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8
            });
            const ring = new THREE.Mesh(ringGeom, ringMat);
            ring.position.x = data.distance;
            ring.rotation.x = Math.PI / 2 + 0.3; 
            orbitObj.add(ring);
        }

        // Caminhos das órbitas
        const pathGeom = new THREE.RingGeometry(data.distance - 0.1, data.distance + 0.1, 128);
        const pathMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.1 });
        const orbitPath = new THREE.Mesh(pathGeom, pathMat);
        orbitPath.rotation.x = Math.PI / 2;
        scene.add(orbitPath);

        // Sub-sistema Terra/Lua
        if (data.name === "Terra") {
            const earthLocalGroup = new THREE.Group();
            earthLocalGroup.position.x = data.distance; // Move o grupo inteiro para a órbita global
            
            planetMesh.position.x = 0; // Reseta terra dentro do grupo para (0,0)
            earthLocalGroup.add(planetMesh);
            
            // Criar Lua
            moonMesh = new THREE.Mesh(
                new THREE.SphereGeometry(0.25, 32, 32),
                new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.8 })
            );
            moonMesh.position.x = 3.5; // Distância fixa da terra
            earthLocalGroup.add(moonMesh);

            // Adicionar Foguete (oculto por padrão) dentro da terraLocal
            rocket.visible = false;
            earthLocalGroup.add(rocket);

            earthLocalPivot = earthLocalGroup;
            orbitObj.add(earthLocalGroup); // orbitObj gira o grupo terraLocal ao redor do sol
        } else {
            orbitObj.add(planetMesh);
        }
        
        planetInstances.push({
            group: orbitObj,
            mesh: planetMesh,
            data: data
        });
    });

    // 6. ENGINE DE ROTAÇÃO E RENDER
    let timeMultiplier = 50; 
    let timeOffset = 0;
    const clock = new THREE.Clock();

    const speedInput = document.getElementById("timeSpeed");
    const speedValueLabel = document.getElementById("speedValue");
    speedInput.addEventListener("input", (e) => {
        timeMultiplier = parseFloat(e.target.value);
        speedValueLabel.textContent = `${timeMultiplier}x`;
    });

    // Reset Camera
    document.getElementById("resetCamBtn").addEventListener("click", () => {
        gsap.to(camera.position, { x: 0, y: 80, z: 150, duration: 1.5 });
        gsap.to(controls.target, { x: 0, y: 0, z: 0, duration: 1.5 });
    });

    // --- CONTROLE DE MISSÕES ---
    const btnApollo = document.getElementById("btnApollo");
    const btnArtemis = document.getElementById("btnArtemis");
    const btnCancel = document.getElementById("btnCancelMission");
    let pathLineMesh = null;

    const startMission = (missionName) => {
        if(missionActive) return;
        missionActive = true;
        savedTimeMultiplier = timeMultiplier;
        timeMultiplier = 0; // Congela o universo logicamente
        
        btnApollo.style.display = "none";
        btnArtemis.style.display = "none";
        btnCancel.style.display = "inline-block";

        rocketProgress.p = 0;
        rocket.visible = true;

        // Limpar rota antiga caso exista
        if(pathLineMesh) earthLocalPivot.remove(pathLineMesh);

        // Pontos de Controle das Splines
        const curvePoints = [];
        const ePos = new THREE.Vector3(0,0,0); // Posição terra é 0,0,0 no grupo local
        const mPos = moonMesh.position.clone(); // Posição da Lua relativa ao pivot

        if (missionName === 'apollo') {
            // Rota Direta com leve parábola
            curvePoints.push(ePos);
            curvePoints.push(new THREE.Vector3(mPos.x / 2, mPos.y + 0.5, mPos.z + 0.5));
            curvePoints.push(mPos); // Crava na Lua
        } else if (missionName === 'artemis') {
            // Rota Free-Return (Oito - 8)
            const behindMoon = mPos.clone().multiplyScalar(1.2); 
            behindMoon.z += 1;
            curvePoints.push(ePos);
            curvePoints.push(new THREE.Vector3(mPos.x * 0.5, 0.5, 1));
            curvePoints.push(behindMoon); // Passa por trás
            curvePoints.push(new THREE.Vector3(mPos.x * 0.5, -0.5, -1));
            curvePoints.push(ePos); // Volta pra Terra
        }

        currentPath = new THREE.CatmullRomCurve3(curvePoints);
        
        // Desenhar Rota Branca tracejada visual
        const points = currentPath.getPoints(50);
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineDashedMaterial( { color: 0x00ff00, dashSize: 0.1, gapSize: 0.1 } );
        pathLineMesh = new THREE.Line(geo, mat);
        pathLineMesh.computeLineDistances();
        earthLocalPivot.add(pathLineMesh);

        // Foca a câmera na Terra/Lua
        // As posições globais da Terra (group parent) e Lua precisam ser obtidas
        const earthGlobalPos = new THREE.Vector3();
        earthLocalPivot.getWorldPosition(earthGlobalPos);

        gsap.to(camera.position, {
            x: earthGlobalPos.x,
            y: earthGlobalPos.y + 10,
            z: earthGlobalPos.z + 10,
            duration: 2,
            ease: "power2.inOut"
        });

        // Tween o progresso do foguete (p de 0 até 1)
        currentMissionTween = gsap.to(rocketProgress, {
            p: 1,
            duration: missionName === 'apollo' ? 10 : 15,
            ease: "power1.inOut",
            delay: 1.5,
            onComplete: () => {
                alert(`Missão ${missionName.toUpperCase()} Concluída!`);
                abortMission(); // Reinicia
            }
        });
    };

    const abortMission = () => {
        if(!missionActive) return;
        if(currentMissionTween) currentMissionTween.kill();
        missionActive = false;
        timeMultiplier = savedTimeMultiplier;
        
        btnApollo.style.display = "inline-block";
        btnArtemis.style.display = "inline-block";
        btnCancel.style.display = "none";
        rocket.visible = false;
        
        if(pathLineMesh) earthLocalPivot.remove(pathLineMesh);
        document.getElementById("resetCamBtn").click();
    };

    btnApollo.addEventListener("click", () => startMission('apollo'));
    btnArtemis.addEventListener("click", () => startMission('artemis'));
    btnCancel.addEventListener("click", abortMission);


    const animate = () => {
        const dt = clock.getDelta();

        timeOffset += dt * timeMultiplier * 0.01;

        if (!missionActive) {
            // Orbita apenas se não for missão
            planetInstances.forEach(p => {
                const speed = (1.0 / p.data.period);
                p.group.rotation.y = timeOffset * speed;
                p.mesh.rotation.y += 0.01 * timeMultiplier * Math.max((1/p.data.radius), 0.1); 
            });
            // Opcional: Eixo lunar rotacionando se quisermos que a Lua rode em volta da terra
            if (moonMesh && earthLocalPivot) {
                // A lua rodando ao redor do local pivot (Z/X)
                // Ajuste simples para manter a dinâmica (orbit lunar)
                // moonPivot.rotation.y += dt*...
            }
        }

        // --- SISTEMA DA MISSÃO ---
        if (missionActive && currentPath) {
            // Posiciona foguete na spline
            const pos = currentPath.getPointAt(rocketProgress.p);
            rocket.position.copy(pos);
            
            // Foguete aponta para onde está indo
            const tangent = currentPath.getTangentAt(rocketProgress.p).normalize();
            // A matemática de lookAt do cone precisa offset, mas usando um Tetraedro básico ele só vai girar
            rocket.lookAt(pos.clone().add(tangent));

            // Camera Target via GSAP seguindo o foguete Globalmente!
            const rocketGlobalPos = new THREE.Vector3();
            rocket.getWorldPosition(rocketGlobalPos);
            // Faz a camera lentamente focar no foguete
            controls.target.lerp(rocketGlobalPos, 0.1);
        }

        sun.rotation.y += 0.001 * (missionActive ? 0 : timeMultiplier);
        sunGlow.rotation.y -= 0.002 * (missionActive ? 0 : 1);

        controls.update(); 
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    // 7. RESPONSIVIDADE
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
