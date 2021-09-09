// https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_teapot.html
// https://threejs.org/docs/#api/en/math/Color.setStyle
// https://github.com/dataarts/dat.gui/blob/master/API.md#GUI+addColor

import * as THREE from '../resources/threejs/three.module.js';

import { GUI } from '../resources/dat.gui.module.js';

const params = {
  radius: 5,
  detail: 2,
  cameraZ: 10,
  xpos: 1,
  ypos: 1,
  color: '#00ff00'
}
let dode, material, line;
let col;

function main() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 130, window.innerWidth / window.innerHeight, 0.1, 1000 );
  scene.background = new THREE.Color(0xAAAAAA)

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  const geometry = new THREE.DodecahedronGeometry(params.radius, Math.floor(params.detail));
  col = params.color
  material = new THREE.MeshBasicMaterial( { color: col } );
  dode = new THREE.Mesh( geometry, material );

  dode.position.x = params.xpos
  dode.position.y = params.ypos
  scene.add( dode );

  const edges = new THREE.EdgesGeometry( geometry );
  line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
  scene.add( line )

  camera.position.z = params.cameraZ

  const gui = new GUI();
  const guiBox = gui.addFolder('guiBox');
  guiBox.add(params, 'cameraZ', 1, 30).onChange(updateGeom)
  guiBox.add(params, 'radius', 1, 40).onChange(updateGeom)
  guiBox.add(params, 'xpos', -10, 10).onChange(updateGeom)
  guiBox.add(params, 'ypos', -10, 10).onChange(updateGeom)
  guiBox.add(params, 'detail', 0, 10).onChange(updateGeom)
  guiBox.addColor(params, 'color').onChange(updateColor)

  function updateColor(e) {
    const newCol = e
    params.color = newCol
    material.color.setStyle(newCol)
  }

  function updateGeom() {
    if(dode !== undefined) {
      dode.geometry.dispose();
      scene.remove(dode)
      scene.remove(line)
    }

    const geometry = new THREE.DodecahedronGeometry(params.radius, Math.floor(params.detail));
    material = new THREE.MeshBasicMaterial( { color: params.color } );
    dode = new THREE.Mesh( geometry, material );
    dode.position.x = params.xpos
    dode.position.y = params.ypos

    scene.add( dode );

    const edges = new THREE.EdgesGeometry( geometry );
    line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
    scene.add( line )

    camera.position.z = params.cameraZ;
  }

  const animate = function () {
    requestAnimationFrame( animate );

    dode.rotation.x += 0.01;
    dode.rotation.y += 0.01;

    renderer.render( scene, camera );
  };

  animate()

}

main()