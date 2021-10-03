// https://threejsfundamentals.org/threejs/lessons/threejs-cameras.html
import * as THREE from '../resources/threejs/three.module.js';
import { GUI } from '../resources/dat.gui.module.js';
import { WEBGL } from '../resources/WebGL.js';
import Stats from '../resources/stats.module.js';
import { OrbitControls } from '../resources/OrbitControls.js';
import { FirstPersonControls } from '../resources/FirstPersonControls.js';
import vertexShader from './shaders/vertex.glsl.js'
import fragmentShader from './shaders/fragment.glsl.js'
import Perlin from '../resources/perlin.js';
import { getRandomArbitrary, getRandomInt } from './globalfunctions.js';
import { generateShaderTree, generateTree } from './trees.js';
import { generateMushroom } from './mushrooms.js';
import { generateGround } from './ground.js';

const treeParams = {
  radius: 7,
  detail: 5,
  xpos: 20,
  ypos: 11,
  color: '#00ff00'
}

const params = {
  fov: 20,
  aspect: 2, 
  zNear: 5,
  zFar: 1000
}

const WIDTH = window.innerWidth, HEIGHT = window.innerHeight
var clock = new THREE.Clock();
let stats, scene, camera, renderer;

function main() {
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xAAAAAA)

  // create a camera, which defines where we're looking at.
  function makeCamera() {
    const { fov, aspect, zNear, zFar} = params;  // the canvas default
    return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
  }
  camera = makeCamera();
  camera.position.set(8, 4, 10).multiplyScalar(1);
  camera.lookAt(0, 0, 0);

  // create a render and set the size
  const canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setClearColor(new THREE.Color(0x000, 1.0));
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;

  const shaderTree = generateShaderTree(10, 15, 0)
  scene.add(shaderTree)

  // mushrooms
  const m = generateMushroom()
  scene.add(m)
  
  // orbit controls
  const controls = new OrbitControls( camera, renderer.domElement);
  controls.enableZoom = true;
  controls.enableDamping = true;
  controls.update();

  // tree object
  for(let i = 0; i < 100; i++){
    const x = getRandomArbitrary(-200, 200)
    const tree = generateTree(x, 15, getRandomArbitrary(-100, 100))
    scene.add(tree);  
  }

  var axes = new THREE.AxesHelper(20);
  scene.add(axes);

  {
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);

    const spotlight = new THREE.SpotLight(0xffffff, 0.3)
    spotlight.position.set(-40, 100, -10);
    spotlight.castShadow = true;
    scene.add(light);
    scene.add(spotlight)
  }

  const groundMesh = generateGround();
  scene.add(groundMesh)

  // position and point the camera to the center of the scene
  camera.position.x = 100;
  camera.position.y = 10;
  camera.position.z = 10;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // var camControls = new FirstPersonControls(camera);
  
  // camera gui
  const gui = new GUI();
  const guiBox = gui.addFolder('guiBox');
  guiBox.add(params, 'fov', 1, 100).onChange(makeCamera)
  guiBox.add(params, 'aspect', 1, 20).onChange(makeCamera)
  guiBox.add(params, 'zNear', 0.1, 1).onChange(makeCamera)
  guiBox.add(params, 'zFar', 500, 2000).onChange(makeCamera)

}

function animate() {
  requestAnimationFrame( animate );
  render();
  stats.update();

};

function render() {

  const time = performance.now();

  // send time data to shaders
  const treeMesh = scene.children[ 0 ].children[0];
  const mushroomMesh = scene.children[ 1 ];

  treeMesh.rotation.y = time * 0.00075;
  treeMesh.material.uniforms.u_time.value = time * 0.00075;

  mushroomMesh.rotation.z = time * 0.00075;
  mushroomMesh.material.uniforms.u_time.value = time * 0.01;

  renderer.render( scene, camera );
}


if(!WEBGL.isWebGLAvailable()) {
  const warning = WEBGL.getWebGLErrorMessage();
	 document.getElementById( 'container' ).appendChild( warning );
} else {
  initStats();
  main();
  animate();
}

function initStats() {
  stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.querySelector("#stats-output").append(stats.domElement);
  return stats;
}