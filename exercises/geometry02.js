import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";
import { GLTFLoader } from '../build/jsm/loaders/GLTFLoader.js';
import { ConvexGeometry } from '../build/jsm/geometries/ConvexGeometry.js';
import { Vector3 } from '../build/three.module.js';

let scene, renderer, camera, material, light, orbit; // Initial variables
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // Init a basic renderer
camera = initCamera(new THREE.Vector3(0, 15, 30)); // Init camera in this position
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
let plane = createGroundPlaneXZ(20, 20)
plane.receiveShadow = true;
scene.add(plane);


let loader = new GLTFLoader();
loader.load("../assets/objects/tank.glb",
  function(glb)
  {
    let obj = glb.scene;
    obj.traverse( function(child){
      if(child)
      {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(obj);

  },
  null, null
);



light = new THREE.DirectionalLight();
light.position.set(10, 15, 10);
light.castShadow = true;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 25;
light.shadow.camera.top = 10;
light.shadow.camera.right = 10;
light.shadow.camera.left = -10;
light.shadow.camera.bottom = -10;
light.shadow.mapSize.set(256, 256);
scene.add(light);



render();
function render()
{
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}