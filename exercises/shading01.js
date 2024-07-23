import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import { TeapotGeometry } from '../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";
import { color } from '../libs/util/dat.gui.module.js';

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(5, 15, 20)); // Init camera in this position
material = setDefaultMaterial(); // create a basic material
light = initDefaultBasicLight(scene); // Create a basic light to illuminate the scene
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
scene.add(plane);


let cylinder_geometry = new THREE.CylinderGeometry(0.5, 2, 5);
let cylinder_material = new THREE.MeshPhongMaterial({color:"lightblue", flatShading: true});
let cylinder = new THREE.Mesh(cylinder_geometry, cylinder_material);

let teapot_geometry = new TeapotGeometry(1.5);
let teapot_material = new THREE.MeshPhongMaterial({color:"red", shininess:"100", specular:"rgb(255,255,255)"});
let teapot = new THREE.Mesh(teapot_geometry, teapot_material);

let sphere_geometry = new THREE.SphereGeometry(1);
let sphere_material = new THREE.MeshLambertMaterial({color:"lightgreen"});
let sphere = new THREE.Mesh(sphere_geometry, sphere_material);

cylinder.position.set(7.5, 2.5, 7.5);
teapot.position.set(2.5, 1.4, 2.5);
sphere.position.set(-2.5, 1, -2.5);

scene.add(cylinder);
scene.add(teapot);
scene.add(sphere);






// Use this to show information onscreen
let controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  // controls.show();

render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}