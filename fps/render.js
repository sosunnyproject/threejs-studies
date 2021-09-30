// https://threejsfundamentals.org/threejs/lessons/threejs-cameras.html
import * as THREE from '../resources/threejs/three.module.js';
import { GUI } from '../resources/dat.gui.module.js';
import { WEBGL } from '../resources/WebGL.js';
import Stats from '../resources/stats.module.js';
import { OrbitControls } from '../resources/OrbitControls.js';
import { FirstPersonControls } from '../resources/FirstPersonControls.js';

const treeParams = {
  radius: 7,
  detail: 5,
  xpos: 20,
  ypos: 11,
  color: '#00ff00'
}

const params = {
  fov: 20,
  aspect: 1.5, 
  zNear: 5,
  zFar: 1000
}

const WIDTH = window.innerWidth, HEIGHT = window.innerHeight

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
  camera.position.set(8, 4, 10).multiplyScalar(1);
  camera.lookAt(0, 0, 0);

  // create a render and set the size
  const canvas = document.querySelector('#c');
  var renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setClearColor(new THREE.Color(0x000, 1.0));
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;

  var axes = new THREE.AxesHelper(20);
  scene.add(axes);

  var groundGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
  var groundMaterial = new THREE.MeshBasicMaterial({ color: 0xccccc, side: THREE.DoubleSide });
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
  for(let i = 0; i < 100; i++){
    const x = getRandomArbitrary(-200, 200)
    const tree = makeTree(x, 15, getRandomArbitrary(-100, 100))
    scene.add(tree);  
  }

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

function makeTree(xpos, ypos, zpos) {

  const tree = new THREE.Object3D();
  
  const grassColors = ["rgb(227, 101, 91)", "rgb(220, 214, 247)", "rgb(217, 237, 146)", "rgb(181,228,140)", "rgb(153,217,140)", "rgb(118,200,147)", "rgb(82,182,154)", "rgb(52,160,164)"]
  const grassInd = getRandomInt(0, grassColors.length)
  const grassGeometry = new THREE.DodecahedronGeometry(getRandomArbitrary(4.0, 10.0), getRandomInt(0, 3))
  const grassMaterial = new THREE.MeshBasicMaterial( { color: grassColors[grassInd] } );
  const grassMesh = new THREE.Mesh( grassGeometry, grassMaterial );
  grassMesh.position.x = xpos
  grassMesh.position.y = ypos
  grassMesh.position.z = zpos
  tree.add(grassMesh)

  const trunkColors = [ "rgb(232, 174, 183)", "rgb(115, 72, 48)", "rgb(94, 116, 127)", "rgb(197, 152, 73)", "rgb(156, 179, 128)" ]
  const colorIndex = getRandomInt(0, trunkColors.length)
  const trunkGeometry = new THREE.CylinderGeometry(1, 2, 6, 12)
  const trunkMaterial = new THREE.MeshBasicMaterial({ color: trunkColors[colorIndex] })
  const trunkMesh = new THREE.Mesh( trunkGeometry, trunkMaterial );
  trunkMesh.position.x = xpos
  trunkMesh.position.y = ypos - 10
  trunkMesh.position.z = zpos
  tree.add(trunkMesh);

  return tree
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

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}