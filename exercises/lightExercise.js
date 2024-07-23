import * as THREE from  'three';
import GUI from '../libs/util/dat.gui.module.js'
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        setDefaultMaterial,
        initDefaultBasicLight,        
        onWindowResize, 
        createLightSphere} from "../libs/util/util.js";
import {loadLightPostScene} from "../libs/util/utilScenes.js";

let scene, renderer, camera, orbit;
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer();    // View function in util/utils
   renderer.setClearColor("rgb(30, 30, 42)");
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
   camera.lookAt(0, 0, 0);
   camera.position.set(5, 5, 5);
   camera.up.set( 0, 1, 0 );
orbit = new OrbitControls( camera, renderer.domElement ); // Enable mouse rotation, pan, zoom etc.

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

// Show axes (parameter is size of each axis)
let axesHelper = new THREE.AxesHelper( 3 );
  axesHelper.visible = false;
scene.add( axesHelper );

// directional light
let dirPosition = new THREE.Vector3(2, 2, 4)
const dirLight = new THREE.DirectionalLight('white', 0.05);
dirLight.position.copy(dirPosition);
 //mainLight.castShadow = true;
scene.add(dirLight);  

// objects
let cylinder1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1, 25), setDefaultMaterial());
cylinder1.position.set(0, 0.5, 4);
scene.add(cylinder1);
let cylinder2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1, 25), setDefaultMaterial());
cylinder2.position.set(1.5, 0.5, -1.5);
scene.add(cylinder2);

let square1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.5), setDefaultMaterial());
square1.position.set(3, 0.5, 2);
scene.add(square1);
let square2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.5), setDefaultMaterial());
square2.position.set(3, 0.5, 0);
scene.add(square2);


// spotlight
let position = new THREE.Vector3(1.25, 3, 0);
let target = new THREE.Vector3(2, 0, 0);

let spotlight = new THREE.SpotLight('white', 8);
spotlight.position.copy(position);
spotlight.angle = THREE.MathUtils.degToRad(40);
spotlight.castShadow = true;
spotlight.target.position.copy(target);
spotlight.penumbra = 0.5;
scene.add(spotlight);

let spotLightHelper = new THREE.SpotLightHelper( spotlight );
scene.add( spotLightHelper );

// ambient light
let ambient_light = new THREE.AmbientLight('rgb(50,50,50)');
scene.add(ambient_light);


// Load default scene
loadLightPostScene(scene)

// REMOVA ESTA LINHA APÓS CONFIGURAR AS LUZES DESTE EXERCÍCIO
// initDefaultBasicLight(scene);

//---------------------------------------------------------
// Load external objects
buildInterface();
render();

function buildInterface()
{
  // GUI interface
  let gui = new GUI();

  // position and target
  let obj = {positionX:position.x, positionY:position.y, positionZ:position.z,
             targetX:target.x, targetY:target.y, targetZ:target.z,
             showAxes:false, showDirLight:true, showSpotLight:true, showAmbientLight:true};
  
  let positionFolder = gui.addFolder('Position');
  positionFolder.add(obj, 'positionX', -10, 10)
    .name("X")
    .onChange(function(e) { 
      spotlight.position.x = e;
      spotlight.target.updateMatrixWorld();
    });
  positionFolder.add(obj, 'positionY', 0, 10)
    .name("Y")
    .onChange(function(e) {
      spotlight.position.y = e;
      spotlight.target.updateMatrixWorld();
    });

  positionFolder.add(obj, 'positionZ', -10, 10)
    .name("Z")
    .onChange(function(e) {
      spotlight.position.z = e;
      spotlight.target.updateMatrixWorld();
    });

  let targetFolder = gui.addFolder('Target');
  targetFolder.add(obj, 'targetX', -10, 10)
    .name("X")
    .onChange(function(e) {
      spotlight.target.position.x = e;
      spotlight.target.updateMatrixWorld();
    });
  targetFolder.add(obj, 'targetY', 0, 10)
    .name("Y")
    .onChange(function(e) {
      spotlight.target.position.y = e;
      spotlight.target.updateMatrixWorld();
    });

  targetFolder.add(obj, 'targetZ', -10, 10)
    .name("Z")
    .onChange(function(e) {
      spotlight.target.position.z = e;
      spotlight.target.updateMatrixWorld();
    });

  // desligar luzes
  gui.add(obj, 'showDirLight', true)
    .name('Show Directional Light')
    .onChange(function(e) { dirLight.visible = e; });
  gui.add(obj, 'showSpotLight', true)
    .name('Show Spotlight')
    .onChange(function(e) { spotlight.visible = e; });
  gui.add(obj, 'showAmbientLight', true)
    .name('Show Ambient Light')
    .onChange(function(e) { ambient_light.visible = e; });
}

function render()
{
  requestAnimationFrame(render);  
  renderer.render(scene, camera)
}
