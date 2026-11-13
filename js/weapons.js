
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function createWeapons(camera) {

    const loader = new GLTFLoader();
    const weaponHolder = new THREE.Group();

    weaponHolder.position.set(0.35, -0.30, -0.85);
    camera.add(weaponHolder);

    const weapons = {};
    let currentWeapon = null;
    let currentWeaponName = null;

    const ammo = {
        pistol: 12,
        rifle: 30
    };

    const weaponPaths = {
        pistol: './assets/models/pistol.glb',
        rifle: './assets/models/rifle.glb'
    };

    function loadWeapon(name, path, targetSize) {

        loader.load(path, (gltf) => {

            const model = gltf.scene;

            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();

            box.getSize(size);
            box.getCenter(center);

            const maxDimension = Math.max(
                size.x,
                size.y,
                size.z
            );

            if (maxDimension === 0) {
                console.error('Modelo vacío:', name);
                return;
            }

            const scale = targetSize / maxDimension;

            model.scale.setScalar(scale);

            model.position.set(
                -center.x * scale,
                -center.y * scale,
                -center.z * scale
            );

            if (name === 'pistol') {
                model.rotation.set(0, Math.PI / 2, 0);
            } else {
                model.rotation.set(0, 0, 0);
            }

            model.traverse((object) => {

                if (object.isMesh) {

                    object.visible = true;
                    object.frustumCulled = false;

                    const materials = Array.isArray(object.material)
                        ? object.material
                        : [object.material];

                    materials.forEach((material) => {
                        material.side = THREE.DoubleSide;
                        material.needsUpdate = true;
                    });

                    object.castShadow = true;
                }
            });

            weapons[name] = model;

            console.log('Arma cargada:', name);

            if (name === 'pistol' && currentWeapon === null) {
                switchWeapon('pistol');
            }

        }, undefined, (error) => {
            console.error('Error cargando arma:', name, error);
        });
    }

    loadWeapon('pistol', weaponPaths.pistol, 0.65);
    loadWeapon('rifle', weaponPaths.rifle, 0.90);

    function switchWeapon(name) {

        if (!weapons[name]) {
            console.warn('Arma todavía no cargada:', name);
            return;
        }

        if (currentWeapon) {
            weaponHolder.remove(currentWeapon);
        }

        currentWeapon = weapons[name];
        currentWeaponName = name;

        weaponHolder.add(currentWeapon);

        console.log('Arma equipada:', name);
    }

    document.addEventListener('keydown', (event) => {

        if (event.repeat) return;

        if (event.code === 'Digit1') {
            switchWeapon('pistol');
        }

        if (event.code === 'Digit2') {
            switchWeapon('rifle');
        }
    });

    function consumeAmmo() {

        if (!currentWeaponName) return false;

        if (ammo[currentWeaponName] <= 0) {
            console.log('Sin munición');
            return false;
        }

        ammo[currentWeaponName]--;

        return true;
    }

    // NUEVO: entregar munición desde las cajas
    function addAmmo(type, amount) {

        if (!Object.prototype.hasOwnProperty.call(ammo, type)) {
            console.warn('Tipo de munición desconocido:', type);
            return false;
        }

        if (!Number.isFinite(amount) || amount <= 0) {
            return false;
        }

        ammo[type] += amount;

        console.log(
            `Munición recogida: ${type}. Total: ${ammo[type]}`
        );

        return true;
    }

    function getAmmo() {
        return { ...ammo };
    }

    function getCurrentWeapon() {
        return currentWeaponName;
    }

    return {
        switchWeapon,
        consumeAmmo,
        addAmmo,
        getAmmo,
        getCurrentWeapon
    };
}
