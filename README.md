# 🧟 Zombie Survival: Hospital Infected

## Descripción
Zombie Survival: Hospital Infected es un videojuego de supervivencia en primera persona (FPS), desarrollado con HTML, CSS, JavaScript y Three.js.

El jugador debe sobrevivir dentro de un hospital infestado de zombis, administrar sus municiones, eliminar o evitar enemigos y llegar a la zona de extracción para completar la misión.

## Tecnologías utilizadas
- HTML5
- CSS3
- JavaScript
- Three.js
- WebGL
- Modelos 3D en formato GLB

## Características principales
- Movimiento en primera persona.
- Cámara controlada mediante el mouse.
- Dos armas: pistola y escopeta.
- Cambio de armas mediante las teclas 1 y 2.
- Munición limitada y cajas de munición coleccionables.
- Zombis con modelos 3D y animación de movimiento.
- Detección y persecución del jugador.
- Sistema de disparos mediante Raycaster.
- Los zombis necesitan dos impactos para ser eliminados.
- Colisiones con obstáculos y enemigos.
- Zona de extracción y pantalla de victoria.
- Pantalla de derrota al ser alcanzado por un zombi.

## Estructura del proyecto

```text
ZombieSurvival/
├── index.html
├── style.css
├── README.md
├── js/
│   ├── main.js
│   ├── scene.js
│   ├── player.js
│   ├── weapons.js
│   ├── zombies.js
│   ├── shooting.js
│   ├── collisions.js
│   ├── ammunition.js
│   ├── mission.js
│   └── ui.js
└── assets/
    └── models/
        ├── pistol.glb
        ├── rifle.glb
        └── zombie.glb
```

## Requisitos
- Navegador web actualizado (Chrome, Edge o Firefox).
- Visual Studio Code.
- Extensión Live Server.
- Conexión a Internet para cargar Three.js desde CDN.

## Instalación y ejecución

1. Descargar o clonar el repositorio.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Comprobar que los modelos 3D estén dentro de `assets/models/`.
4. Instalar la extensión Live Server si todavía no está instalada.
5. Abrir `index.html`.
6. Hacer clic derecho y seleccionar **Open with Live Server**.
7. En el navegador, presionar **INICIAR PARTIDA**.

No es necesario instalar Three.js manualmente, ya que se carga mediante CDN en el archivo `index.html`.

## Controles

| Tecla / Acción | Función |
|---|---|
| W | Avanzar |
| S | Retroceder |
| A | Moverse a la izquierda |
| D | Moverse a la derecha |
| Mouse | Mirar alrededor |
| Clic izquierdo | Disparar |
| 1 | Seleccionar pistola |
| 2 | Seleccionar escopeta |
| ESC | Liberar el mouse |

## Objetivo del videojuego

Sobrevivir a los zombis dentro del hospital, recoger municiones cuando sea necesario y llegar a la zona de extracción para completar la misión.

## Recursos externos

Los modelos 3D y recursos utilizados deben acreditarse aquí:

- Pistola: [Agregar enlace de procedencia del modelo].
- Escopeta: [Agregar enlace de procedencia del modelo].
- Zombi: [Agregar enlace de procedencia del modelo].
- Three.js: https://threejs.org/

## Autoría

Proyecto académico desarrollado como parte de un trabajo universitario.

