// https://threejsfundamentals.org/threejs/lessons/threejs-cameras.html
import * as THREE from '../resources/threejs/three.module.js';
import { GUI } from '../resources/dat.gui.module.js';
import { WEBGL } from '../resources/WebGL.js';
import Stats from '../resources/stats.module.js';
import { OrbitControls } from '../resources/OrbitControls.js';
import { FirstPersonControls } from '../resources/FirstPersonControls.js';

const treeParams = {
  radius: 5,
  detail: 1,
  cameraZ: 10,
  xpos: 20,
  ypos: 10,
  color: '#00ff00'
}

const params = {
  fov: 20,
  aspect: 2, 
  zNear: 0.1,
  zFar: 1000
}

function main() {
  var clock = new THREE.Clock();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xAAAAAA)

  // create a camera, which defines where we're looking at.
  function makeCamera() {
    const { fov, aspect, zNear, zFar} = params;  // the canvas default
    return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
  }
  const camera = makeCamera();
  camera.position.set(8, 4, 10).multiplyScalar(3);
  camera.lookAt(0, 0, 0);

  // create a render and set the size
  const canvas = document.querySelector('#c');
  var renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setClearColor(new THREE.Color(0x000, 1.0));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  var axes = new THREE.AxesHelper(20);
  scene.add(axes);

  var groundGeometry = new THREE.PlaneGeometry(60, 60, 1, 1);
  var groundMaterial = new THREE.MeshBasicMaterial({ color: 0xccccc });
  var groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);

  groundMesh.rotation.x = -0.5*Math.PI;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh)

  // position and point the camera to the center of the scene
  camera.position.x = 100;
  camera.position.y = 10;
  camera.position.z = 10;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // var camControls = new FirstPersonControls(camera);
  
  // orbit controls
  const controls = new OrbitControls( camera, renderer.domElement);
  controls.enableZoom = true;
  controls.enableDamping = true;
  controls.update();

  // tree object
  const tree = new THREE.Object3D();
  scene.add(tree);
  
  const grassGeometry = new THREE.DodecahedronGeometry(treeParams.radius, Math.floor(treeParams.detail))
  const grassMaterial = new THREE.MeshBasicMaterial( { color: treeParams.color } );
  const grassMesh = new THREE.Mesh( grassGeometry, grassMaterial );
  grassMesh.position.x = treeParams.xpos
  grassMesh.position.y = treeParams.ypos
  tree.add(grassMesh)

  const trunkGeometry = new THREE.CylinderGeometry(2, 2, 6, 12)
  const trunkMaterial = new THREE.MeshBasicMaterial({ color: "brown"})
  const trunkMesh = new THREE.Mesh( trunkGeometry, trunkMaterial );
  trunkMesh.position.x = treeParams.xpos
  trunkMesh.position.y = treeParams.ypos - 5
  tree.add(trunkMesh);

  // camera gui
  const gui = new GUI();
  const guiBox = gui.addFolder('guiBox');
  guiBox.add(params, 'fov', 1, 100).onChange(makeCamera)
  guiBox.add(params, 'aspect', 1, 20).onChange(makeCamera)
  guiBox.add(params, 'zNear', 0.1, 1).onChange(makeCamera)
  guiBox.add(params, 'zFar', 500, 2000).onChange(makeCamera)

  const animate = function () {
    requestAnimationFrame( animate );

    renderer.render( scene, camera );
  };

  animate()
}

if(!WEBGL.isWebGLAvailable()) {
  const warning = WEBGL.getWebGLErrorMessage();
	 document.getElementById( 'container' ).appendChild( warning );
} else {
  main();
  initStats();
}

function initStats() {
  var stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.querySelector("#stats-output").append(stats.domElement);
  return stats;
}
