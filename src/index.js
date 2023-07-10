import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";
import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";
import texture from "./textures/sky.jpg";

const gui = new dat.GUI({width: 300});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const skyTexture = textureLoader.load(texture);
scene.background = skyTexture;

// Geometry
const geometry = new THREE.PlaneGeometry(10, 10,  512, 512);

// color
const colorOject = {};
colorOject.depthColor = "#2d81ae";
colorOject.surfaceColor = "#66c1f9";

// Material
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uWaveLength : { value: 0.38 },
    uFrequency: { value: new THREE.Vector2(6.6, 3.5)},
    uTime: { value: 0.0 },
    uWaveSpeed: { value: 0.75 },
    uDepthColor: { value: new THREE.Color(colorOject.depthColor)},
    uSurfaceColor: { value: new THREE.Color(colorOject.surfaceColor)},
    uColorOffset: { value: 0.03 },
    uColorMutiplier: { value: 9.0 },
    uSmallWaveElevation: { value: 0.15 },
    uSmallWaveFrequency : { value: 3.0 },
    uSmallDWaveSpeed: { value: 0.2 },
  },
  transparent: true,
});

// デバッグ
gui.add(material.uniforms.uWaveLength, "value", 0, 1, 0.001).name("uWaveLength").listen();
gui.add(material.uniforms.uFrequency.value, "x", 0, 20, 0.001).name("uFrequencyX").listen();
gui.add(material.uniforms.uFrequency.value, "y", 0, 20, 0.001).name("uFrequencyY").listen();
gui.add(material.uniforms.uWaveSpeed, "value", 0, 10, 0.001).name("uWaveSpeed").listen();
gui.addColor(colorOject, "depthColor").onChange(() => {
  material.uniforms.uDepthColor.value.set(colorOject.depthColor)
});
gui.addColor(colorOject, "surfaceColor").onChange(() => {
  material.uniforms.uSurfaceColor.value.set(colorOject.surfaceColor)
});
gui.add(material.uniforms.uColorOffset, "value", 0, 0.1, 0.001).name("uColorOffset").listen();
gui.add(material.uniforms.uColorMutiplier, "value", 0, 100, 0.001).name("uColorMutiplier").listen();

gui.add(material.uniforms.uSmallWaveElevation, "value", 0, 1, 0.001).name("uSmallWaveElevation").listen();
gui.add(material.uniforms.uSmallWaveFrequency, "value", 0, 10, 0.01).name("uSmallWaveFrequency").listen();
gui.add(material.uniforms.uSmallDWaveSpeed, "value", 0, 1, 0.001).name("uSmallDWaveSpeed").listen();
gui.show(false);

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;
scene.add(mesh);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0.0, 0.23, 0);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;

  // camera postion
  camera.position.x = Math.sin(elapsedTime * 0.17) * 3.0;
  camera.position.z = Math.cos(elapsedTime * 0.17) * 3.0;
  // camera.lookAt(0, 0, 0);
  camera.lookAt(
    Math.cos(elapsedTime), 
    Math.sin(elapsedTime) * 0.5, 
    Math.sin(elapsedTime) * 0.4, 
  );

  // controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};

animate();
