import * as THREE from '../resources/threejs/three.module.js';
import { GUI } from '../resources/dat.gui.module.js';
import { WEBGL } from '../resources/WebGL.js';
import Stats from '../resources/stats.module.js';
import { OrbitControls } from '../resources/OrbitControls.js';
import vertexShader from './shaders/vertex.glsl.js'
import fragmentShader from './shaders/fragment.glsl.js'
import Perlin from '../resources/perlin.js';
import { getRandomArbitrary, getRandomInt } from './globalfunctions.js';
import { shaderTree } from './render.js';

export function generateTree(xpos, ypos, zpos) {

 const tree = new THREE.Object3D();
 
 const grassColors = ["rgb(227, 101, 91)", "rgb(220, 214, 247)", "rgb(217, 237, 146)", "rgb(181,228,140)", "rgb(153,217,140)", "rgb(118,200,147)", "rgb(82,182,154)", "rgb(52,160,164)"]
 const grassInd = getRandomInt(0, grassColors.length)
 const grassGeometry = new THREE.DodecahedronGeometry(getRandomArbitrary(4.0, 10.0), getRandomInt(0, 3))
 const grassMaterial = new THREE.MeshPhongMaterial( { color: grassColors[grassInd] } );
 const grassMesh = new THREE.Mesh( grassGeometry, grassMaterial );
 grassMesh.position.x = xpos
 grassMesh.position.y = ypos
 grassMesh.position.z = zpos
 grassMesh.castShadow = true;
 tree.add(grassMesh)

 const trunkColors = [ "rgb(232, 174, 183)", "rgb(115, 72, 48)", "rgb(94, 116, 127)", "rgb(197, 152, 73)", "rgb(156, 179, 128)" ]
 const colorIndex = getRandomInt(0, trunkColors.length)
 const trunkGeometry = new THREE.CylinderGeometry(1, 2, 6, 12)
 const trunkMaterial = new THREE.MeshPhongMaterial({ color: trunkColors[colorIndex] })
 const trunkMesh = new THREE.Mesh( trunkGeometry, trunkMaterial );
 trunkMesh.position.x = xpos
 trunkMesh.position.y = ypos - 10
 trunkMesh.position.z = zpos
 trunkMesh.castShadow = true;
 tree.add(trunkMesh);

 return tree
}

//dodecahedron - shader tree
const data = {
  radius: 20,
  detail: 1
}

export function generateShaderTree(xpos, ypos, zpos, gui) {
  const position = {x: xpos, y: ypos + 30, z: zpos}
  const folder = gui.addFolder('ShaderTree-Dodecahedron');
  folder.add(data, 'radius', 1, 40).onChange(() => draw(position));
  folder.add(data, 'detail', 0, 5).step(1).onChange(() => draw(position))
  // folder.add(data, 'x', 1, 40).onChange(() => draw(position));
  // folder.add(data, 'y', 0, 5).step(1).onChange(() => draw(position))

  const output = draw(position)
  return output;
}

function draw(position) { 
 
  const grassColors = ["rgb(227, 101, 91)", "rgb(220, 214, 247)", "rgb(217, 237, 146)", "rgb(181,228,140)", "rgb(153,217,140)", "rgb(118,200,147)", "rgb(82,182,154)", "rgb(52,160,164)"]
  const grassInd = getRandomInt(0, grassColors.length)
  const grassGeometry = new THREE.DodecahedronGeometry(data.radius, data.detail)
  const grassMaterial = new THREE.MeshPhongMaterial( { color: grassColors[grassInd] } );
  const grassShader = new THREE.ShaderMaterial( {
    uniforms: {
      u_time: { value: 1.0 },
      u_resolution: { value: new THREE.Vector2() }
    },
    vertexShader: vertexShader,  
    fragmentShader: fragmentShader
  } );  
  const grass = new THREE.Mesh( grassGeometry, grassShader );
  const grassMesh = updateGeometry(grass, grassGeometry, position)
 
  //  const trunkColors = [ "rgb(232, 174, 183)", "rgb(115, 72, 48)", "rgb(94, 116, 127)", "rgb(197, 152, 73)", "rgb(156, 179, 128)" ]
  //  const colorIndex = getRandomInt(0, trunkColors.length)
  //  const trunkGeometry = new THREE.CylinderGeometry(2, 4, 18, 12)
  //  const trunkMaterial = new THREE.MeshBasicMaterial({ color: trunkColors[colorIndex] })
  //  const trunkMesh = new THREE.Mesh( trunkGeometry, trunkMaterial );
  //  trunkMesh.position.x = xpos
  //  trunkMesh.position.y = ypos - 5
  //  trunkMesh.position.z = zpos
  //  tree.add(trunkMesh);

  return grassMesh;
 }

function updateGeometry( mesh, newGeometry, pos ) {
  const { x, y, z} = pos

  if(shaderTree !== undefined) {
    shaderTree.geometry.dispose()
    shaderTree.geometry = newGeometry
    shaderTree.position.x = x
    shaderTree.position.y = y
    shaderTree.position.z = z
  } else {
    mesh.position.x = x
    mesh.position.y = y
    mesh.position.z = z
  }

  // these do not update nicely together if shared
  return mesh
}