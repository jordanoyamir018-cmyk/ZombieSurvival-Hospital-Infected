
import * as THREE from 'three';

import { PointerLockControls } from
'three/addons/controls/PointerLockControls.js';

export function createPlayer(camera, renderer, colliders, getZombies) {

    const controls = new PointerLockControls(
        camera,
        renderer.domElement
    );

    const keys = {
        forward: false,
        backward: false,
        left: false,
        right: false
    };

    const speed = 5;
    const playerRadius = 0.35;
    const zombieRadius = 0.55;

    // CONTROLES

    document.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'KeyW': keys.forward = true; break;
            case 'KeyS': keys.backward = true; break;
            case 'KeyA': keys.left = true; break;
            case 'KeyD': keys.right = true; break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch (event.code) {
            case 'KeyW': keys.forward = false; break;
            case 'KeyS': keys.backward = false; break;
            case 'KeyA': keys.left = false; break;
            case 'KeyD': keys.right = false; break;
        }
    });

    // COLISIONES CON ESCENARIO Y ZOMBIS

    function checkCollision(x, z) {

        // Objetos del escenario
        for (const collider of colliders) {

            const collisionX =
                x + playerRadius > collider.minX &&
                x - playerRadius < collider.maxX;

            const collisionZ =
                z + playerRadius > collider.minZ &&
                z - playerRadius < collider.maxZ;

            if (collisionX && collisionZ) {
                return true;
            }
        }

        // Zombis
        const zombies = getZombies ? getZombies() : [];

        for (const zombie of zombies) {

            if (zombie.dead) continue;

            const zombiePosition = zombie.model.position;

            const dx = x - zombiePosition.x;
            const dz = z - zombiePosition.z;

            const distance = Math.sqrt(dx * dx + dz * dz);

            if (distance < playerRadius + zombieRadius) {
                return true;
            }
        }

        return false;
    }

    // ACTUALIZACIÓN DEL JUGADOR

    function update(delta) {

        if (!controls.isLocked) return;

        let forward = 0;
        let sideways = 0;

        if (keys.forward) forward += 1;
        if (keys.backward) forward -= 1;
        if (keys.right) sideways += 1;
        if (keys.left) sideways -= 1;

        const movementLength = Math.sqrt(
            forward * forward + sideways * sideways
        );

        if (movementLength === 0) return;

        forward /= movementLength;
        sideways /= movementLength;

        const movement = speed * delta;

        const direction = controls.getDirection(
            new THREE.Vector3()
        );

        const rightX = Math.cos(camera.rotation.y);
        const rightZ = -Math.sin(camera.rotation.y);

        const moveX =
            forward * direction.x +
            sideways * rightX;

        const moveZ =
            forward * direction.z +
            sideways * rightZ;

        const finalX =
            camera.position.x + moveX * movement;

        const finalZ =
            camera.position.z + moveZ * movement;

        // Movimiento horizontal
        if (
            finalX >= -4.3 &&
            finalX <= 4.3 &&
            !checkCollision(finalX, camera.position.z)
        ) {
            camera.position.x = finalX;
        }

        // Movimiento hacia adelante y atrás
        if (
            finalZ >= -62 &&
            finalZ <= 8 &&
            !checkCollision(camera.position.x, finalZ)
        ) {
            camera.position.z = finalZ;
        }
    }

    return {
        controls,
        update
    };
}
