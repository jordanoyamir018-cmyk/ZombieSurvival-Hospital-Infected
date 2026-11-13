
import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x252b2b);
    scene.fog = new THREE.Fog(0x252b2b, 20, 75);

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    camera.position.set(0, 1.7, 8);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    document.getElementById('game-container').appendChild(renderer.domElement);

    // Iluminación general
    const ambientLight = new THREE.HemisphereLight(
        0xffffff,
        0x333333,
        2
    );
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
        0xffffff,
        1.2
    );

    directionalLight.position.set(0, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Lista de objetos que bloquearán el movimiento del jugador
    const colliders = [];

    // Materiales
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x555b5b,
        roughness: 0.9
    });

    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x777d7d,
        roughness: 0.9
    });

    const ceilingMaterial = new THREE.MeshStandardMaterial({
        color: 0x333838
    });

    // Función para crear objetos
    function createBox(width, height, depth, color, x, y, z) {
        const geometry = new THREE.BoxGeometry(width, height, depth);

        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.85
        });

        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        scene.add(mesh);

        return mesh;
    }

    // =====================================================
    // ESTRUCTURA PRINCIPAL DEL HOSPITAL
    // =====================================================

    // Piso
    const floor = new THREE.Mesh(
        new THREE.BoxGeometry(10, 0.3, 80),
        floorMaterial
    );

    floor.position.set(0, -0.15, -25);
    floor.receiveShadow = true;
    scene.add(floor);

    // Pared izquierda
    const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 5, 80),
        wallMaterial
    );

    leftWall.position.set(-5, 2.5, -25);
    scene.add(leftWall);

    // Pared derecha
    const rightWall = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 5, 80),
        wallMaterial
    );

    rightWall.position.set(5, 2.5, -25);
    scene.add(rightWall);

    // Techo
    const ceiling = new THREE.Mesh(
        new THREE.BoxGeometry(10, 0.3, 80),
        ceilingMaterial
    );

    ceiling.position.set(0, 5, -25);
    scene.add(ceiling);

    // =====================================================
    // PUERTAS
    // =====================================================

    for (let z = 0; z >= -55; z -= 10) {

        createBox(
            0.15, 2.7, 1.8,
            0x493329,
            -4.8, 1.35, z
        );

        createBox(
            0.15, 2.7, 1.8,
            0x493329,
            4.8, 1.35, z - 5
        );
    }

    // =====================================================
    // ILUMINACIÓN DEL PASILLO
    // =====================================================

    for (let z = 0; z >= -60; z -= 10) {

        const lamp = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.12, 1),
            new THREE.MeshStandardMaterial({
                color: 0xe0e0c0,
                emissive: 0x777755,
                emissiveIntensity: 0.7
            })
        );

        lamp.position.set(0, 4.75, z);
        scene.add(lamp);

        const pointLight = new THREE.PointLight(
            0xddeeff,
            12,
            12
        );

        pointLight.position.set(0, 4.3, z);
        scene.add(pointLight);
    }

    // =====================================================
    // COLUMNAS
    // =====================================================

    for (let z = -5; z >= -55; z -= 10) {

        createBox(
            0.5, 4.5, 0.5,
            0x555b5b,
            -4.3, 2.25, z
        );

        createBox(
            0.5, 4.5, 0.5,
            0x555b5b,
            4.3, 2.25, z
        );
    }

    // =====================================================
    // RECEPCIÓN
    // =====================================================

    const reception = new THREE.Group();

    const receptionCounter = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 1.2, 0.8),
        new THREE.MeshStandardMaterial({
            color: 0x60412e
        })
    );

    receptionCounter.position.set(0, 0.6, 0);

    reception.add(receptionCounter);
    reception.position.set(-2.5, 0, -7);

    scene.add(reception);

    colliders.push({
        minX: -4,
        maxX: -1,
        minZ: -7.5,
        maxZ: -6.5
    });

    // =====================================================
    // CAMAS DE HOSPITAL
    // =====================================================

    function createHospitalBed(x, z) {

        const bed = new THREE.Group();

        // Estructura
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(1.8, 0.2, 2.8),
            new THREE.MeshStandardMaterial({
                color: 0x777777
            })
        );

        frame.position.y = 0.6;
        bed.add(frame);

        // Colchón
        const mattress = new THREE.Mesh(
            new THREE.BoxGeometry(1.7, 0.25, 2.6),
            new THREE.MeshStandardMaterial({
                color: 0xd9d9d9
            })
        );

        mattress.position.y = 0.8;
        bed.add(mattress);

        // Almohada
        const pillow = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 0.2, 0.6),
            new THREE.MeshStandardMaterial({
                color: 0xffffff
            })
        );

        pillow.position.set(0, 1, -0.85);
        bed.add(pillow);

        // Cabecera
        const headboard = new THREE.Mesh(
            new THREE.BoxGeometry(1.8, 1, 0.15),
            new THREE.MeshStandardMaterial({
                color: 0x555555
            })
        );

        headboard.position.set(0, 0.9, -1.4);
        bed.add(headboard);

        // Patas
        for (let px of [-0.7, 0.7]) {
            for (let pz of [-1.1, 1.1]) {

                const leg = new THREE.Mesh(
                    new THREE.BoxGeometry(0.12, 0.6, 0.12),
                    new THREE.MeshStandardMaterial({
                        color: 0x444444
                    })
                );

                leg.position.set(px, 0.3, pz);
                bed.add(leg);
            }
        }

        bed.position.set(x, 0, z);

        bed.traverse((object) => {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });

        scene.add(bed);

        colliders.push({
            minX: x - 0.8,
            maxX: x + 0.8,
            minZ: z - 1.4,
            maxZ: z + 1.4
        });
    }

    createHospitalBed(-3.5, -17);
    createHospitalBed(3.5, -29);
    createHospitalBed(-3.5, -41);

    // =====================================================
    // CAJAS DEL HOSPITAL
    // =====================================================

    function createHospitalBox(x, z, color = 0x777755) {

        const box = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshStandardMaterial({
                color: color
            })
        );

        box.position.set(x, 0.5, z);
        box.castShadow = true;
        box.receiveShadow = true;

        scene.add(box);

        colliders.push({
            minX: x - 0.5,
            maxX: x + 0.5,
            minZ: z - 0.5,
            maxZ: z + 0.5
        });
    }

    createHospitalBox(-3.7, -11, 0x777755);
    createHospitalBox(3.7, -23, 0x777755);
    createHospitalBox(-3.7, -35, 0x777755);

    // =====================================================
    // BANCAS
    // =====================================================

    function createBench(x, z) {

        const bench = new THREE.Group();

        const seat = new THREE.Mesh(
            new THREE.BoxGeometry(2.2, 0.2, 0.8),
            new THREE.MeshStandardMaterial({
                color: 0x493329
            })
        );

        seat.position.y = 0.6;
        bench.add(seat);

        const back = new THREE.Mesh(
            new THREE.BoxGeometry(2.2, 0.9, 0.15),
            new THREE.MeshStandardMaterial({
                color: 0x493329
            })
        );

        back.position.set(0, 1.05, -0.35);
        bench.add(back);

        bench.position.set(x, 0, z);

        scene.add(bench);

        colliders.push({
            minX: x - 1.1,
            maxX: x + 1.1,
            minZ: z - 0.4,
            maxZ: z + 0.4
        });
    }

    createBench(2.7, -5);
    createBench(2.7, -47);

    // =====================================================
    // RETORNO DE ELEMENTOS
    // =====================================================

    return {
        scene,
        camera,
        renderer,
        colliders
    };
}
