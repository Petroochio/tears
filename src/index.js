import xs from 'xstream';
// import * as THREE from 'three';
import { add, zipWith } from 'ramda';
import REGL from 'regl';
import mat4 from 'gl-mat4';

import CubeMesh from './CubeMesh';

// Try doing renderer scissor
function main() {
  const panel1 = document.querySelector('#panel-1');
  const panel2 = document.querySelector('#panel-2');
  // const panel3 = document.querySelector('#panel-3');

  const reglFrame1 = REGL(panel1);

  const draw = reglFrame1({
    frag: `
      precision mediump float;
      uniform vec2 resolution;

      vec3 colorA = vec3(1, 0.0, 1);
      vec3 colorB = vec3(1, 1, 1);

      void main() {
        vec2 st = gl_FragCoord.xy/resolution.xy;
        vec3 color = vec3(0.0);
        color = mix(colorA, colorB, vec3(st.x));
        gl_FragColor = vec4(color, 1);
      }`,

    vert: `
      precision mediump float;
      attribute vec3 position;
      uniform mat4 model, view, projection;
      void main() {
        gl_Position = projection * view * model * vec4(position, 1);
      }`,

    attributes: {
      position: CubeMesh.position,
    },
    elements: CubeMesh.elements,

    uniforms: {
      // the batchId parameter gives the index of the command
      resolution: ({ viewportWidth, viewportHeight }) => [viewportWidth, viewportHeight],
      model: mat4.identity([]),
      view: ({ tick }) => {
        const t = 0.01 * tick;
        return mat4.lookAt(
          [],
          [3 * Math.cos(t), Math.tan(t), 3 * Math.sin(t)],
          [0, 0, 0],
          [0, 1, 0]
        );
      },
      projection: ({ viewportWidth, viewportHeight }) =>
        mat4.perspective(
          [],
          Math.PI / 4,
          viewportWidth / viewportHeight,
          0.01,
          1000
        ),
    },
  });

  // draw();
  reglFrame1.frame(() => {
    reglFrame1.clear({
      depth: 1,
      color: [0, 0, 0, 1],
    });

    draw();
  });
}

window.onload = main;

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

  const rot$ = xs.combine(
    xs.merge(mouseDown$.mapTo(true), xs.merge(mouseUp$, mouseOut$).mapTo(false)),
    mouseMove$
  )
    .filter(([isDown]) => isDown)
    .mapTo(angle)
    .fold(zipWith(add), [0, 0, 0]);
    // .subscribe({
    //   next: ([x, y, z]) => { entity.rotation.set(x, y, z); render(); },
    // });
}
