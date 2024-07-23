import * as THREE from  'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {initRenderer, 
        initCamera,
        initDefaultBasicLight,
        setDefaultMaterial,
        InfoBox,
        onWindowResize,
        createGroundPlaneXZ} from "../libs/util/util.js";
import { CSG } from "../libs/other/CSGMesh.js";
import { ConvexGeometry } from '../build/jsm/geometries/ConvexGeometry.js';
import { Vector3 } from '../build/three.module.js';
import { color } from '../libs/util/dat.gui.module.js';

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

// objects
let cylinder1, cylinder2, torus, cube;

cylinder1 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 4));
cylinder2 = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 4));
torus = new THREE.Mesh(new THREE.TorusGeometry(1));
cube = new THREE.Mesh(new THREE.BoxGeometry(2, 5, 2));


// torus
cube.position.set(1,0,0);
cube.matrixAutoUpdate = false;
cube.updateMatrix();

let cubeCSG = CSG.fromMesh(cube);
let torusCSG = CSG.fromMesh(torus);
let csg_aux = torusCSG.subtract(cubeCSG);
let torus_final = CSG.toMesh(csg_aux, new THREE.Matrix4());
torus_final.material = new THREE.MeshPhongMaterial({color:"green"});
torus_final.position.set(0,2,0);

torus_final.castShadow = true;
torus_final.receiveShadow = true;

scene.add(torus_final);

// cylinder
cylinder1.position.set(0, 0.1, 0);
cylinder1.matrixAutoUpdate = false;
cylinder1.updateMatrix();

let cylinder1CSG = CSG.fromMesh(cylinder1);
let cylinder2CSG = CSG.fromMesh(cylinder2);
let csg_aux2 = cylinder2CSG.subtract(cylinder1CSG);
let cylinder_final = CSG.toMesh(csg_aux2, new THREE.Matrix4());
cylinder_final.material = new THREE.MeshPhongMaterial({color:"blue"});
cylinder_final.position.set(1.7,2,0);

cylinder_final.castShadow = true;
cylinder_final.receiveShadow = true;

scene.add(cylinder_final);




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