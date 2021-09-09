// https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_teapot.html
// https://threejs.org/docs/#api/en/math/Color.setStyle
// https://github.com/dataarts/dat.gui/blob/master/API.md#GUI+addColor

import * as THREE from '../resources/threejs/three.module.js';

import { GUI } from '../resources/dat.gui.module.js';

const params = {
  width: 10,
  height: 12.0,
  cameraZ: 5,
  xpos: 1,
  ypos: 1,
  color: '#00ff00'
}
let cube, material;
let col;

function main() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 1000 );
  scene.background = new THREE.Color(0xAAAAAA)

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  const geometry = new THREE.BoxGeometry();
  col = params.color
  material = new THREE.MeshBasicMaterial( { color: col } );
  cube = new THREE.Mesh( geometry, material );

  cube.position.x = params.xpos
  cube.position.y = params.ypos

  scene.add( cube );

  camera.position.z = params.cameraZ

  const gui = new GUI();
  const guiBox = gui.addFolder('guiBox');
  guiBox.add(params, 'cameraZ', 1, 30).onChange(updateGeom)
  guiBox.add(params, 'width', 1, 20).onChange(updateGeom)
  guiBox.add(params, 'xpos', -10, 10).onChange(updateGeom)
  guiBox.add(params, 'ypos', -10, 10).onChange(updateGeom)
  guiBox.add(params, 'height', 1.0, 20.0).onChange(updateGeom)
  guiBox.addColor(params, 'color').onChange(updateColor)

  function updateColor(e) {
    const newCol = e
    params.color = newCol
    material.color.setStyle(newCol)
  }

  function updateGeom() {
    if(cube !== undefined) {
      cube.geometry.dispose();
      scene.remove(cube)
    }

    const geometry = new THREE.BoxGeometry(params.width, params.height);
    material = new THREE.MeshBasicMaterial( { color: params.color } );
    cube = new THREE.Mesh( geometry, material );
    cube.position.x = params.xpos
    cube.position.y = params.ypos

    scene.add( cube );
    camera.position.z = params.cameraZ;
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