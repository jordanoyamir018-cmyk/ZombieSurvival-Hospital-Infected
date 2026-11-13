
import * as THREE from 'three';

export function createShooting(
    camera,
    renderer,
    weapons,
    zombieSystem,
    controls,
    status
) {

    const raycaster = new THREE.Raycaster();

    raycaster.far = 80;

    const screenCenter = new THREE.Vector2(0, 0);

    let canShoot = true;

    function updateHUD() {

        const ammo = weapons.getAmmo();
        const current = weapons.getCurrentWeapon();

        const currentName =
            current === 'pistol' ? 'PISTOLA' :
            current === 'rifle' ? 'ESCOPETA' :
            'CARGANDO';

        status.textContent =
            `ARMA: ${currentName} | ` +
            `PISTOLA: ${ammo.pistol} | ` +
            `ESCOPETA: ${ammo.rifle}`;
    }

    function shoot(event) {

        // Solo clic izquierdo
        if (event.button !== 0) return;

        // Solo disparar durante la partida
        if (!controls.isLocked) return;

        if (!canShoot) return;

        const currentWeapon = weapons.getCurrentWeapon();

        if (!currentWeapon) return;

        // Comprobar munición
        if (!weapons.consumeAmmo()) {
            updateHUD();
            return;
        }

        canShoot = false;

        // Preparar rayo desde el centro de la cámara
        raycaster.setFromCamera(screenCenter, camera);

        // Obtener modelos de zombis vivos
        const zombieModels = zombieSystem
            ? zombieSystem.zombies
                .filter(zombie => !zombie.dead)
                .map(zombie => zombie.model)
            : [];

        // Detectar impactos
        const intersections = raycaster.intersectObjects(
            zombieModels,
            true
        );

        if (intersections.length > 0) {

            const firstHit = intersections[0];

            const successfulHit = zombieSystem.hit(
                firstHit.object
            );

            if (successfulHit) {
                console.log('¡IMPACTO!');
            }

        } else {
            console.log('Disparo fallido');
        }

        updateHUD();

        // Evitar disparos repetidos por mantener pulsado
        setTimeout(() => {
            canShoot = true;
        }, 180);
    }

    renderer.domElement.addEventListener(
        'mousedown',
        shoot
    );

    updateHUD();

    return {
        updateHUD
    };
}
