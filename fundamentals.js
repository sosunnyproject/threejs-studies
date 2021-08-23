import * as THREE from './resources/threejs/three.module.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();

  // add lighting
    {
      const color = 0xFF123FF;
      const intensity = 2;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 5);
      scene.add(light);
    }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  // const material = new THREE.MeshBasicMaterial({color: 0x44aa88});  // greenish blue
  const material = new THREE.MeshPhongMaterial({color: 0x44aa88});  // greenish blue

  // multiple cubes
  const cubes = [
    makeInstance(geometry, 0x44aa88, 0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa4433, 2),
  ]

  // single cube
  // const cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);

  // renderer.render(scene, camera);

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({color});
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
  
    cube.position.x = x;
    return cube;
  }

  function render(time) {
    time *= 0.001; // convert time from milliseconds to seconds
    // cube.rotation.x = time;
    // cube.rotation.y = time;
    cubes.forEach( (cube, index) => {
      const speed = 1 + index * 0.2;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  
  requestAnimationFrame(render);
}



main();

