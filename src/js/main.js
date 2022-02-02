import * as THREE from "three"

import Stats from 'three/examples/jsm/libs/stats.module.js';

import { Curves } from 'three/examples/jsm/curves/CurveExtras.js';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';
import { ParametricGeometries } from 'three/examples/jsm/geometries/ParametricGeometries.js';


let camera, scene, renderer, stats;

init();
animate();

function init() {

    const container = document.getElementById( 'container' );

    // camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 2000 );
    camera.position.z = 4;

    scene = new THREE.Scene();

    //

    const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );

    const pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );
    scene.add( camera );

    //



    const material = new THREE.MeshPhongMaterial( { color: 0xffffff, side: THREE.DoubleSide} );

    //

    let geometry, object;

    geometry = new ParametricGeometry(virichCyclicSurfaceParameterizedVector, 100, 100 );

    geometry.center();
    object = new THREE.Mesh( geometry, material );
    object.position.set( 0, 0, 0 );
    scene.add( object );



    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    stats = new Stats();
    container.appendChild( stats.dom );

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

}

function render() {

    const timer = Date.now() * 0.0001;

    camera.position.x = Math.cos( timer ) * 800;
    camera.position.z = Math.sin( timer ) * 800;

    camera.lookAt( scene.position );

    scene.traverse( function ( object ) {

        if ( object.isMesh === true ) {

            object.rotation.x = timer * 5;
            object.rotation.y = timer * 2.5;


        }

    } );

    renderer.render( scene, camera );

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