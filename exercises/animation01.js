import * as THREE from  'three';
import GUI from '../libs/util/dat.gui.module.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
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

let sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

let sphereMaterial = new THREE.MeshPhongMaterial({color:"red", shininess:"200"});

let sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial);
let sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial);

sphere1.position.set(-8, 1, -5);
sphere2.position.set(-8, 1, 5);


scene.add(sphere1);
scene.add(sphere2);

let lerpConfig1 = {
  destination: new THREE.Vector3(8, 1, -5),
  alpha: 0.1,
  move: false
}

let lerpConfig2 = {
  destination: new THREE.Vector3(8, 1, 5),
  alpha: 0.05,
  move: false
}



buildInterface();
render();

function buildInterface()
{
  var controls = new function () {
    this.move1 = function () {
       lerpConfig1.move = true;
    };
    this.move2 = function () {
       lerpConfig2.move = true;
    };
    this.reset = function () {
      lerpConfig1.move = false;
      lerpConfig2.move = false;
      sphere1.position.set(-8, 1, -5);
      sphere2.position.set(-8, 1, 5);
    }
 };


 let gui = new GUI();
 let animationFolder = gui.addFolder("Animation Options");
 animationFolder.open();
 animationFolder.add(controls, 'move1').name("Sphere 1");
 animationFolder.add(controls, 'move2').name("Sphere 2");
  animationFolder.add(controls, 'reset').name("Reset");
}


function render()
{
  if(lerpConfig1.move)  sphere1.position.lerp(lerpConfig1.destination, lerpConfig1.alpha);
  if(lerpConfig2.move)  sphere2.position.lerp(lerpConfig2.destination, lerpConfig2.alpha);

  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}