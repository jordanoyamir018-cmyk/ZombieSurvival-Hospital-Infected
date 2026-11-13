
import * as THREE from 'three';

import { createScene } from './scene.js';
import { createPlayer } from './player.js';
import { createWeapons } from './weapons.js';
import { createZombies } from './zombies.js';
import { createShooting } from './shooting.js';
import { createAmmoPickups } from './ammunition.js';
import { createMission } from './mission.js';

// =====================================================
// ESCENARIO
// =====================================================

const {
    scene,
    camera,
    renderer,
    colliders
} = createScene();

// =====================================================
// ARMAS
// =====================================================

const weapons = createWeapons(camera);

// =====================================================
// ZOMBIS
// =====================================================

let zombieSystem = null;

try {
    zombieSystem = createZombies(scene);
} catch (error) {
    console.error('Error creando zombis:', error);
}

// =====================================================
// JUGADOR
// =====================================================

const player = createPlayer(
    camera,
    renderer,
    colliders,
    () => zombieSystem ? zombieSystem.zombies : []
);

// =====================================================
// INTERFAZ
// =====================================================

const menu = document.getElementById('menu');
const startButton = document.getElementById('start-button');
const crosshair = document.getElementById('crosshair');
const status = document.getElementById('status');
const victoryScreen = document.getElementById('victory-screen');

// =====================================================
// SISTEMA DE DISPAROS
// =====================================================

const shooting = createShooting(
    camera,
    renderer,
    weapons,
    zombieSystem,
    player.controls,
    status
);

// =====================================================
// SISTEMA DE MUNICIÓN
// =====================================================

const ammoPickups = createAmmoPickups(
    scene,
    camera,
    weapons,
    () => {
        shooting.updateHUD();
    }
);

// =====================================================
// SISTEMA DE MISIÓN
// =====================================================

let gameWon = false;

const mission = createMission(
    scene,
    camera,
    () => {

        if (gameWon) return;

        gameWon = true;

        player.controls.unlock();

        menu.style.display = 'none';
        victoryScreen.style.display = 'flex';

        crosshair.style.display = 'none';
        status.style.display = 'none';
    }
);

// =====================================================
// INICIAR PARTIDA
// =====================================================

startButton.addEventListener('click', () => {

    if (!gameWon) {
        player.controls.lock();
    }
});

player.controls.addEventListener('lock', () => {

    if (gameWon) return;

    menu.style.display = 'none';
    crosshair.style.display = 'block';
    status.style.display = 'block';
});

player.controls.addEventListener('unlock', () => {

    if (gameWon) return;

    menu.style.display = 'flex';
    crosshair.style.display = 'none';
    status.style.display = 'none';
});

// =====================================================
// RELOJ
// =====================================================

const clock = new THREE.Clock();

let gameOverShown = false;

// =====================================================
// BUCLE PRINCIPAL
// =====================================================

function animate() {

    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);

    // Movimiento del jugador
    player.update(delta);

    // Recoger cajas de munición
    if (player.controls.isLocked && !gameWon) {
        ammoPickups.update(delta);
    }

    // Actualización de zombis
    if (zombieSystem && !gameWon && !gameOverShown) {

        const gameOver = zombieSystem.update(
            delta,
            camera.position
        );

        if (
            gameOver &&
            player.controls.isLocked
        ) {

            gameOverShown = true;

            player.controls.unlock();

            alert('GAME OVER: un zombi te ha alcanzado.');
        }
    }

    // Actualización de la misión
    if (
        player.controls.isLocked &&
        !gameWon &&
        !gameOverShown
    ) {
        mission.update(delta);
    }

    renderer.render(scene, camera);
}

animate();

// =====================================================
// AJUSTAR TAMAÑO DE VENTANA
// =====================================================

window.addEventListener('resize', () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );
});
