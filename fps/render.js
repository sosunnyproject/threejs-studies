// https://threejsfundamentals.org/threejs/lessons/threejs-cameras.html
import * as THREE from '../resources/threejs/three.module.js';
import { GUI } from '../resources/dat.gui.module.js';
import { WEBGL } from '../resources/WebGL.js';
import Stats from '../resources/stats.module.js';
import { OrbitControls } from '../resources/OrbitControls.js';
import { FirstPersonControls } from '../resources/FirstPersonControls.js';
import { getRandomArbitrary, getRandomInt } from './globalfunctions.js';
import { generateShaderTree, generateTree } from './trees.js';
import { generateMushroom } from './mushrooms.js';
import { generateGround } from './ground.js';
import { OBJLoader } from '../resources/loaders/OBJLoader.js';
import { MTLLoader } from '../resources/loaders/MTLLoader.js';
import { GLTFLoader } from '../resources/loaders/GLTFLoader.js';
import { PointerLockControls } from '../resources/PointerLockControls.js';

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

let stats, scene, camera, renderer, camControls;

let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

export let shaderTree;

const gui = new GUI();
const WIDTH = window.innerWidth, HEIGHT = window.innerHeight
var clock = new THREE.Clock();

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

  shaderTree = generateShaderTree(10, 15, 0, gui)
  scene.add(shaderTree)

  // mushrooms
  const m = generateMushroom()
  scene.add(m)

  // ground plane
  const groundMesh = generateGround();
  scene.add(groundMesh)
  
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

  // torus knot
  const torusKnotGeom = new THREE.TorusKnotGeometry( 10, 6, 100, 20 );
  const torusKnotMat = new THREE.MeshPhongMaterial( {color: 0x00d4ff });
  const torusKnot = new THREE.Mesh( torusKnotGeom, torusKnotMat );
  torusKnot.position.y = 60;
  torusKnot.position.x = -40;
  scene.add(torusKnot);

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

  // position and point the camera to the center of the scene
  camera.position.x = 100;
  camera.position.y = 10;
  camera.position.z = 10;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // fps control
  camControls = new PointerLockControls(camera, document.body);
  const instructions = document.getElementById( 'c' );

  instructions.addEventListener( 'click', function () {

    camControls.lock();

  } );


  scene.add( camControls.getObject() );

  const onKeyDown = function ( event ) {

    switch ( event.code ) {

      case 'ArrowUp':
      case 'KeyW':
        moveForward = true;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = true;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = true;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = true;
        break;

      case 'Space':
        if ( canJump === true ) velocity.y += 350;
        canJump = false;
        break;

    }

  };

  const onKeyUp = function ( event ) {

    switch ( event.code ) {

      case 'ArrowUp':
      case 'KeyW':
        moveForward = false;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = false;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = false;
        break;

    }

  };

  document.addEventListener( 'keydown', onKeyDown );
  document.addEventListener( 'keyup', onKeyUp );

  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

  // camera gui
  const guiBox = gui.addFolder('guiBox');
  guiBox.add(params, 'fov', 1, 100).onChange(makeCamera)
  guiBox.add(params, 'aspect', 1, 20).onChange(makeCamera)
  guiBox.add(params, 'zNear', 0.1, 1).onChange(makeCamera)
  guiBox.add(params, 'zFar', 500, 2000).onChange(makeCamera)
 
  // 3d model loader
  // https://sbcode.net/threejs/gltf-animation/

  const gltfLoader = new GLTFLoader();
  gltfLoader.load (
    '../resources/threed/cactus.glb',
    onLoad,
    function (xhr) {
      console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    },
    function (error) {
      console.log("error?", error)
    }
  )
  
  gltfLoader.load (
    '../resources/threed/wee.glb',
    (gltf) => onLoad(gltf, 50),
    function (xhr) {
      console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    },
    function (error) {
      console.log("error?", error)
    }
  )

  function onLoad(gltf, x, y) {
    gltf.scene.position.y = y || 30;
    gltf.scene.position.x = x || -50;
    gltf.scene.scale.x = 4;
    gltf.scene.scale.y = 4;
    gltf.scene.scale.z = 4;
    scene.add(gltf.scene);
  }
}

function animate() {

  renderDynamicShader();

  requestAnimationFrame( animate );

  const time = performance.now();

  if ( camControls.isLocked === true ) {

    // raycaster.ray.origin.copy( camControls.getObject().position );
    // raycaster.ray.origin.y -= 10;

    // const intersections = raycaster.intersectObjects( objects, false );

    // const onObject = intersections.length > 0;

    const delta = ( time - prevTime ) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number( moveForward ) - Number( moveBackward );
    direction.x = Number( moveRight ) - Number( moveLeft );
    direction.normalize(); // this ensures consistent movements in all directions

    if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
    if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

    // if ( onObject === true ) {

    //   velocity.y = Math.max( 0, velocity.y );
    //   canJump = true;

    // }

    camControls.moveRight( - velocity.x * delta );
    camControls.moveForward( - velocity.z * delta );

    camControls.getObject().position.y += ( velocity.y * delta ); // new behavior

    if ( camControls.getObject().position.y < 10 ) {

      velocity.y = 0;
      camControls.getObject().position.y = 10;

      canJump = true;

    }

  }

  prevTime = time;

  stats.update();
};

// including animation loop
function renderDynamicShader() {

  const time = performance.now();

  // send time data to shaders
  const mushroomMesh = scene.children[ 1 ].children[0];
  if(shaderTree !== undefined) {
    shaderTree.rotation.y = time * 0.00075;
    shaderTree.material.uniforms.u_time.value = time * 0.00075;  
  }

  mushroomMesh.rotation.y = time * 0.00075;
  // mushroomMesh.material.uniforms.u_time.value = time * 0.01;
  // scene.children[ 1 ].children[1].rotation.y = time * 0.00075
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