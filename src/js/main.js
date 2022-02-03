import * as THREE from "three"

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AnaglyphEffect } from 'three/examples/jsm/effects/AnaglyphEffect.js';


let camera, scene, renderer, stats, controls, effect,  mesh_object;

init();
animate();

function init() {

    const container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 2000 );
    camera.position.set( 400, 200, 0 );

    scene = new THREE.Scene();
    


    //

    const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );

    const pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );
    scene.add( camera );


    const material = new THREE.MeshPhongMaterial( { color: 0xffffff, side: THREE.DoubleSide, wireframe: true} );

    // World

    let geometry;

    geometry = new ParametricGeometry(virichCyclicSurfaceParameterizedVector, 30, 30 );

    geometry.center();
    mesh_object = new THREE.Mesh( geometry, material );
    mesh_object.position.set( 0, 0, 0 );
    scene.add( mesh_object );



    renderer = new THREE.WebGLRenderer( { antialias: true } );

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
    container.appendChild( renderer.domElement );

    stats = new Stats();
    container.appendChild( stats.dom );
    // effect


    const width = window.innerWidth || 2;
    const height = window.innerHeight || 2;

    effect = new AnaglyphEffect( renderer );
    effect.setSize( width, height );

    window.addEventListener( 'resize', onWindowResize );


    // controls

    controls = new OrbitControls( camera, renderer.domElement );
    controls.listenToKeyEvents( window ); // optional

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 100;
    controls.maxDistance = 500;

    controls.maxPolarAngle = Math.PI / 2;


}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    effect.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

}

function render() {

    const timer = Date.now() * 0.0001;

    camera.lookAt( scene.position );

    // scene.traverse( function ( mesh_object ) {

    //     // if ( mesh_object.isMesh === true ) {

    //     //     mesh_object.rotation.x = timer * .5;
    //     //     mesh_object.rotation.y = timer * .2;


    //     // }

    // } );
    controls.update();

    renderer.render( scene, camera );
    // effect.render( scene, camera );

}


function virichCyclicSurfaceParameterizedVector(t, v, target) {
    var a = 1.5;
    var b = 3;
    var c = 2;
    var d = 4;


    t = t * Math.PI * 2;
    v = v * Math.PI * 2;

    var f = (a * b) / Math.sqrt((a * a * Math.sin(v) * Math.sin(v)) + b * b * Math.cos(v) * Math.cos(v));

    var x = ((f * (1 + Math.cos(t))) + ((d * d - c * c) * (1 - Math.cos(t)) / f)) * Math.cos(v) / 2;
    var y = ((f * (1 + Math.cos(t))) + ((d * d - c * c) * (1 - Math.cos(t)) / f)) * Math.sin(v) / 2;
    var z = (f - (d * d - c * c) / f) * Math.sin(t) / 2;

    const scale = 10;
    // return new THREE.Vector3(x * scale, y * scale, z * scale);
    target.set(x * scale, y * scale, z * scale)
}


function getRotationMatrix(alpha, beta, gamma) {
    var degtorad = Math.PI / 180; // Degree-to-Radian conversion
    var _x = beta ? beta * degtorad : 0; // beta value
    var _y = gamma ? gamma * degtorad : 0; // gamma value
    var _z = alpha ? alpha * degtorad : 0; // alpha value
    
    var cX = Math.cos(_x);
    var cY = Math.cos(_y);
    var cZ = Math.cos(_z);
    var sX = Math.sin(_x);
    var sY = Math.sin(_y);
    var sZ = Math.sin(_z);
    
    //
    // ZXY rotation matrix construction.
    
    var m11 = cZ * cY - sZ * sX * sY;
    var m12 = -cX * sZ;
    var m13 = cY * sZ * sX + cZ * sY;
    
    var m21 = cY * sZ + cZ * sX * sY;
    var m22 = cZ * cX;
    var m23 = sZ * sY - cZ * cY * sX;
    
    var m31 = -cX * sY;
    var m32 = sX;
    var m33 = cX * cY;
    
    return [m11, m12, m13, m21, m22, m23, m31, m32, m33];
}
    
var threejs_matrix4 = new THREE.Matrix4();

window.addEventListener('deviceorientation', e => {
    console.log(`GOT EVENT END payload: {e}`)
    var m2 = getRotationMatrix(e.alpha, e.beta, e.gamma);

    threejs_matrix4.set(
        m2[0], m2[1], m2[2], 0,
        m2[3], m2[4], m2[5], 0,
        m2[6], m2[7], m2[8], 0,
        0, 0, 0, 1
    );
    mesh_object.rotation.setFromRotationMatrix(threejs_matrix4);

    renderer.render(scene, camera);
});