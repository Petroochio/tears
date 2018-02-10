import xs from 'xstream';
import * as THREE from 'three';
import { add, zipWith } from 'ramda';

// Try doing renderer scissor
const cam = new THREE.PerspectiveCamera(70, 400 / 400, 1, 1000);
cam.position.z = 10;
const renderer1 = new THREE.WebGLRenderer();
const renderer2 = new THREE.WebGLRenderer();

const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();

function makeCube(color) {
  const geo = new THREE.BoxGeometry(2, 2, 2);
  const mat = new THREE.MeshBasicMaterial({ color });

  return new THREE.Mesh(geo, mat);
}
const cube1 = makeCube(0x00ff00);
const cube2 = makeCube(0xff0000);
scene1.add(cube1);
scene2.add(cube2);

const panel1 = document.querySelector('#panel-1');
const panel2 = document.querySelector('#panel-2');
const panel3 = document.querySelector('#panel-3');

renderer1.setPixelRatio(window.devicePixelRatio);
renderer1.setSize(400, 400);
document.querySelector('#panel-1').appendChild(renderer1.domElement);

renderer2.setPixelRatio(window.devicePixelRatio);
renderer2.setSize(400, 400);
document.querySelector('#panel-2').appendChild(renderer2.domElement);

function render() {
  renderer1.render(scene1, cam);
  renderer2.render(scene2, cam);
}
window.onload = render;

function DomEventProducer(eventName, element) {
  const producer = {
    start: listener => element.addEventListener(eventName, e => listener.next(e)),
    stop: () => false,
  };
  return producer;
}

function setRotControls(angle, panel, entity) {
  const mouseDown$ = xs.create(DomEventProducer('mousedown', panel));
  const mouseUp$ = xs.create(DomEventProducer('mouseup', panel));
  const mouseOut$ = xs.create(DomEventProducer('mouseout', panel));
  const mouseMove$ = xs.create(DomEventProducer('mousemove', panel));

  const rot$ = xs.combine(xs.merge(mouseDown$.mapTo(true), xs.merge(mouseUp$, mouseOut$).mapTo(false)), mouseMove$)
    .filter(([isDown]) => isDown)
    .mapTo(angle)
    .fold(zipWith(add), [0, 0, 0])
    .subscribe({
      next: ([x, y, z]) => { entity.rotation.set(x, y, z); render(); },
    });
} // [0.01, 0.01, 0]

setRotControls([0.01, 0.01, 0], panel1, cube1);
setRotControls([-0.01, -0.01, 0], panel2, cube2);

console.log('Joe better cry when this is done');
