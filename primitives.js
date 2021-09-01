import * as THREE from './resources/threejs/three.module.js';

import { GUI } from './resources/dat.gui.module.js';

const params = {
  width: 10,
  height: 12.0
}
let cube;

function main() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 1000 );
  scene.background = new THREE.Color(0xAAAAAA)

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  cube = new THREE.Mesh( geometry, material );
  scene.add( cube );

  camera.position.z = 5;


  const gui = new GUI();
  const guiBox = gui.addFolder('guiBox');
  guiBox.add(params, 'width', 1, 20).onChange(updateGeom)
  guiBox.add(params, 'height', 1.0, 20.0).name('Detail').onChange(updateGeom)

  function updateGeom() {
    if(cube !== undefined) {
      cube.geometry.dispose();
      scene.remove(cube)
    }

    const geometry = new THREE.BoxGeometry(params.width, params.height);
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
  }

  const animate = function () {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
  };

  animate()

}

main()