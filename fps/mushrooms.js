import * as THREE from '../resources/threejs/three.module.js';
import { GUI } from '../resources/dat.gui.module.js';
import vertexShader from './shaders/vertex.glsl.js'
import fragmentShader from './shaders/fragment.glsl.js'
import Perlin from '../resources/perlin.js';
import { getRandomArbitrary, getRandomInt } from './globalfunctions.js';

export function generateMushroom() {
 const points = [];
 for ( let i = 0; i < 10; i ++ ) {
   points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 2, ( i - 5 ) * 2 ) );
 }
 const geometry = new THREE.LatheGeometry( points, 15, 0, 2 * Math.PI );
 // const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
 const shader = new THREE.ShaderMaterial( {
  uniforms: {
    u_time: { value: 1.0 },
    u_resolution: { value: new THREE.Vector2() }
  },
  vertexShader: vertexShader,  
  fragmentShader: fragmentShader
} );  

 const lathe = new THREE.Mesh( geometry, shader );

 lathe.position.y = 50;
 lathe.position.x = 120;
 lathe.rotation.z = 60

 return lathe
}

export function updateMushroom() {
  
}