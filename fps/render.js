// https://threejsfundamentals.org/threejs/lessons/threejs-cameras.html
import * as THREE from '../resources/threejs/three.module.js';
import { GUI } from '../resources/dat.gui.module.js';
import { WEBGL } from '../resources/WebGL.js';
import Stats from '../resources/stats.module.js';
import { OrbitControls } from '../resources/OrbitControls.js';
import { FirstPersonControls } from '../resources/FirstPersonControls.js';

function main() {
  var clock = new THREE.Clock();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0xAAAAAA)

  // create a camera, which defines where we're looking at.
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // create a render and set the size
  const canvas = document.querySelector('#c');
  var webGLRenderer = new THREE.WebGLRenderer({ canvas });
  webGLRenderer.setClearColor(new THREE.Color(0x000, 1.0));
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.shadowMap.enabled = true;

  var axes = new THREE.AxesHelper(20);
  scene.add(axes);

  var planeGeometry = new THREE.PlaneGeometry(60, 60, 1, 1);
  var planeMat = new THREE.MeshBasicMaterial({ color: 0xccccc });
  var plane = new THREE.Mesh(planeGeometry, planeMat);

  plane.rotation.x = -0.25*Math.PI;
  plane.position.x = 20;
  plane.position.y = 0;
  plane.position.z = 0;

  scene.add(plane)
  // position and point the camera to the center of the scene
  camera.position.x = 100;
  camera.position.y = 10;
  camera.position.z = 10;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // var camControls = new FirstPersonControls(camera);

  const animate = function () {
    requestAnimationFrame( animate );

    webGLRenderer.render( scene, camera );
  };

  animate()
}

if(!WEBGL.isWebGLAvailable()) {
  const warning = WEBGL.getWebGLErrorMessage();
	 document.getElementById( 'container' ).appendChild( warning );
} else {
  main();
}

function initStats() {
  var stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.getElementById("stats-output").append(stats.domElement);
  return stats;
}
