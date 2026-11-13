
import * as THREE from 'three';

export function createMission(scene, camera, onWin) {

    let completed = false;

    // Posición de la zona de extracción
    const extractionPosition = new THREE.Vector3(0, 0, -61);

    // Plataforma de extracción
    const platform = new THREE.Mesh(
        new THREE.CylinderGeometry(2.2, 2.2, 0.12, 48),
        new THREE.MeshStandardMaterial({
            color: 0x159447,
            emissive: 0x08752e,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.8
        })
    );

    platform.position.copy(extractionPosition);
    platform.position.y = 0.05;
    scene.add(platform);

    // Anillo luminoso
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2, 0.09, 12, 48),
        new THREE.MeshStandardMaterial({
            color: 0x39ff88,
            emissive: 0x13cc55,
            emissiveIntensity: 2
        })
    );

    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 0.2, -61);
    scene.add(ring);

    // Columna de luz
    const beacon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 3, 16),
        new THREE.MeshBasicMaterial({
            color: 0x39ff88,
            transparent: true,
            opacity: 0.35
        })
    );

    beacon.position.set(0, 1.5, -61);
    scene.add(beacon);

    // Luz de la extracción
    const extractionLight = new THREE.PointLight(
        0x20ff70,
        4,
        12
    );

    extractionLight.position.set(0, 2, -61);
    scene.add(extractionLight);

    // Texto flotante
    const sign = new THREE.Group();

    const signBase = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.55, 0.12),
        new THREE.MeshStandardMaterial({
            color: 0x123c27,
            emissive: 0x08752e
        })
    );

    signBase.position.y = 3.3;
    sign.add(signBase);

    // Animación visual de la zona
    function update(delta) {

        if (completed) return;

        ring.rotation.z += delta * 0.8;

        beacon.material.opacity =
            0.25 + Math.sin(performance.now() * 0.003) * 0.1;

        platform.material.emissiveIntensity =
            0.6 + Math.sin(performance.now() * 0.003) * 0.3;

        const dx = camera.position.x - extractionPosition.x;
        const dz = camera.position.z - extractionPosition.z;

        const distance = Math.sqrt(dx * dx + dz * dz);

        if (distance < 1.8) {

            completed = true;

            console.log('¡MISIÓN COMPLETADA!');

            if (onWin) {
                onWin();
            }
        }
    }

    return {
        update,
        isCompleted: () => completed
    };
}
