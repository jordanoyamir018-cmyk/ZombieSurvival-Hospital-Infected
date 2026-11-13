
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone } from 'three/addons/utils/SkeletonUtils.js';

export function createZombies(scene) {

    const loader = new GLTFLoader();
    const zombies = [];

    const zombiePositions = [
        // Primer sector
        { x: 0, z: -15 },
        { x: -2, z: -8 },

        // Segundo sector
        { x: 2, z: -22 },
        { x: 2, z: -30 },

        // Tercer sector
        { x: -2, z: -38 },
        { x: -2, z: -45 },

        // Último sector
        { x: 2, z: -52 },
        { x: 0, z: -60 }
    ];

    const DETECTION_RANGE = 30;
    const ZOMBIE_SPEED = 1.4;
    const ATTACK_DISTANCE = 1.1;

    let gameOver = false;

    loader.load(
        './assets/models/zombie.glb',

        (gltf) => {

            console.log('Zombis cargados correctamente');

            // Buscar específicamente la animación de caminar
            const animations = gltf.animations;

            console.log(
                'Animaciones disponibles:',
                animations.map(animation => animation.name)
            );

            let walkClip = animations.find(animation =>
                /walk|walking|caminar/i.test(animation.name)
            );

            // Si no existe Walk, buscar una animación de movimiento
            if (!walkClip) {
                walkClip = animations.find(animation =>
                    /locomotion|run|running/i.test(animation.name)
                );
            }

            // Si solamente existe una animación, utilizarla
            if (!walkClip && animations.length === 1) {
                walkClip = animations[0];

                console.warn(
                    'No se encontró una animación llamada Walk. ' +
                    'Se utilizará la única animación disponible:',
                    walkClip.name
                );
            }

            if (!walkClip) {
                console.warn(
                    'No se encontró una animación de caminar. ' +
                    'Revisa los nombres de las animaciones del modelo.'
                );
            } else {
                console.log(
                    'Animación seleccionada:',
                    walkClip.name
                );
            }

            zombiePositions.forEach((position, index) => {

                const model = clone(gltf.scene);

                const box = new THREE.Box3().setFromObject(model);
                const size = new THREE.Vector3();
                const center = new THREE.Vector3();

                box.getSize(size);
                box.getCenter(center);

                if (size.y === 0) return;

                const scale = 1.8 / size.y;

                model.scale.setScalar(scale);

                model.position.set(
                    -center.x * scale + position.x,
                    -box.min.y * scale,
                    -center.z * scale + position.z
                );

                model.rotation.y = 0;

                model.traverse((object) => {

                    if (object.isMesh) {
                        object.visible = true;
                        object.frustumCulled = false;
                        object.castShadow = true;
                        object.receiveShadow = true;
                    }
                });

                scene.add(model);

                let mixer = null;
                let walkAction = null;

                if (walkClip) {

                    mixer = new THREE.AnimationMixer(model);

                    walkAction = mixer.clipAction(walkClip);

                    // No reproducir hasta que el jugador se acerque
                }

                const zombie = {
                    model,
                    mixer,
                    walkAction,
                    walking: false,
                    active: false,
                    dead: false,
                    hits: 0,
                    health: 2
                };

                // Identificar a qué zombi pertenece cada parte del modelo
                model.traverse((object) => {
                    object.userData.zombie = zombie;
                });

                zombies.push(zombie);

                console.log(`Zombi ${index + 1} creado`);
            });
        },

        undefined,

        (error) => {
            console.error('Error cargando zombie.glb:', error);
        }
    );

    // =====================================================
    // RECIBIR DISPAROS
    // =====================================================

    function hit(object) {

        let current = object;
        let zombie = null;

        while (current) {

            if (current.userData && current.userData.zombie) {
                zombie = current.userData.zombie;
                break;
            }

            current = current.parent;
        }

        if (!zombie || zombie.dead) {
            return false;
        }

        zombie.hits++;
        zombie.health--;

        console.log(
            `Zombi impactado: ${zombie.hits}/2`
        );

        if (zombie.health <= 0) {

            zombie.dead = true;

            if (zombie.mixer) {
                zombie.mixer.stopAllAction();
            }

            scene.remove(zombie.model);

            console.log('¡ZOMBI ELIMINADO!');
        }

        return true;
    }

    // =====================================================
    // ACTUALIZAR ZOMBIS
    // =====================================================

    function update(delta, playerPosition) {

        if (gameOver) return true;

        for (const zombie of zombies) {

            if (zombie.dead) continue;

            if (zombie.mixer && zombie.walking) {
                zombie.mixer.update(delta);
            }

            const position = zombie.model.position;

            const dx = playerPosition.x - position.x;
            const dz = playerPosition.z - position.z;

            const distance = Math.sqrt(dx * dx + dz * dz);

            if (distance <= DETECTION_RANGE) {

                zombie.active = true;

                // Activar la animación de caminar
                if (!zombie.walking && zombie.walkAction) {

                    zombie.walkAction.reset();
                    zombie.walkAction.fadeIn(0.2);
                    zombie.walkAction.play();

                    zombie.walking = true;
                }
            }

            if (zombie.active) {

                zombie.model.rotation.y = Math.atan2(dx, dz);

                if (
                    distance > ATTACK_DISTANCE &&
                    distance > 0.001
                ) {

                    const directionX = dx / distance;
                    const directionZ = dz / distance;

                    position.x += directionX * ZOMBIE_SPEED * delta;
                    position.z += directionZ * ZOMBIE_SPEED * delta;
                }

                if (distance <= ATTACK_DISTANCE) {
                    gameOver = true;
                    return true;
                }
            }
        }

        return false;
    }

    return {
        zombies,
        update,
        hit,
        isGameOver: () => gameOver
    };
}
