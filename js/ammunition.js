
import * as THREE from 'three';

export function createAmmoPickups(scene, camera, weapons, onPickup) {

    const pickups = [];

    const pickupPositions = [
        { x: 3.7, z: -12, type: 'pistol', amount: 12 },
        { x: -3.7, z: -25, type: 'rifle', amount: 15 },
        { x: 3.7, z: -38, type: 'pistol', amount: 12 },
        { x: 0, z: -55, type: 'rifle', amount: 15 }
    ];

    function createBox(type) {

        const group = new THREE.Group();

        const boxMaterial = new THREE.MeshStandardMaterial({
            color: type === 'pistol' ? 0x2471a3 : 0x922b21,
            roughness: 0.7
        });

        const detailMaterial = new THREE.MeshStandardMaterial({
            color: 0xf1c40f,
            metalness: 0.3,
            roughness: 0.5
        });

        const body = new THREE.Mesh(
            new THREE.BoxGeometry(0.65, 0.45, 0.5),
            boxMaterial
        );

        body.position.y = 0.25;
        body.castShadow = true;
        body.receiveShadow = true;

        group.add(body);

        const band = new THREE.Mesh(
            new THREE.BoxGeometry(0.68, 0.09, 0.53),
            detailMaterial
        );

        band.position.y = 0.25;
        group.add(band);

        const cross = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 0.25, 0.06),
            detailMaterial
        );

        cross.position.set(0, 0.25, 0.27);
        group.add(cross);

        const crossHorizontal = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.07, 0.06),
            detailMaterial
        );

        crossHorizontal.position.set(0, 0.25, 0.27);
        group.add(crossHorizontal);

        return group;
    }

    pickupPositions.forEach((data) => {

        const box = createBox(data.type);

        box.position.set(data.x, 0, data.z);

        scene.add(box);

        pickups.push({
            model: box,
            type: data.type,
            amount: data.amount,
            collected: false
        });
    });

    function update(delta) {

        pickups.forEach((pickup) => {

            if (pickup.collected) return;

            // Pequeña rotación para distinguir las cajas
            pickup.model.rotation.y += delta * 0.5;

            const dx = camera.position.x - pickup.model.position.x;
            const dz = camera.position.z - pickup.model.position.z;

            const distance = Math.sqrt(dx * dx + dz * dz);

            // Recoger automáticamente al acercarse
            if (distance < 1.5) {

                const success = weapons.addAmmo(
                    pickup.type,
                    pickup.amount
                );

                if (!success) return;

                pickup.collected = true;
                scene.remove(pickup.model);

                console.log(
                    `Caja recogida: ${pickup.amount} balas para ${pickup.type}`
                );

                if (onPickup) {
                    onPickup(pickup.type, pickup.amount);
                }
            }
        });
    }

    return {
        update
    };
}
