import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import { div, canvas } from '@cycle/dom';
import REGL from 'regl';
import mat4 from 'gl-mat4';
import { nth } from 'ramda';

import MeshGenerators from './MeshGenerators';
import Raycast, { getRayHits } from './Utils/Raycast';
import { createTransformMatrix } from './Utils/MatrixHelpers';

const cubeMesh = MeshGenerators.primitives.createCube();

// WTF IS THIS SHIT
const viewMat = new Float32Array([
  1, -0, 0, 0,
  0, 0.876966655254364, 0.48055124282836914, 0,
  -0, -0.48055124282836914, 0.876966655254364, 0,
  0, 0, -11.622776985168457, 1,
]);
const projMat = new Float32Array(16);

function view() {
  return xs.of(div('#current-page', [
    // set these values from json anyway
    canvas('#panel-1', { attrs: { width: 400, height: 400 } }),
    canvas('#panel-2'),
  ]));
}

function makeSimpleDraw(reglCtx) {
  return reglCtx({
    frag: `
      precision mediump float;
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float ambientLightAmount;
      uniform float diffuseLightAmount;
      uniform vec3 color;
      uniform vec3 lightDir;
      void main () {
        vec3 ambient = ambientLightAmount * color;
        float cosTheta = dot(vNormal, lightDir);
        vec3 diffuse = diffuseLightAmount * color * clamp(cosTheta , 0.0, 1.0 );
        gl_FragColor = vec4((ambient + diffuse), 1.0);
    }`,

    vert: `
      precision mediump float;
      attribute vec3 position;
      attribute vec3 normal;
      varying vec3 vPosition;
      varying vec3 vNormal;
      uniform mat4 projection, view, model;
      void main() {
        vec4 worldSpacePosition = model * vec4(position, 1);
        vPosition = worldSpacePosition.xyz;
        vNormal = normal;
        gl_Position = projection * view * worldSpacePosition;
    }`,
  });
}

function makeModelDraw(reglCtx) {
  return reglCtx({
    uniforms: {
      model: (_, props) => createTransformMatrix(props.translate, props.scale),
      ambientLightAmount: 0.3,
      diffuseLightAmount: 0.7,
      color: reglCtx.prop('color'),
      isRound: false,
    },
    attributes: {
      position: cubeMesh.position,
      normal: cubeMesh.normal,
    },
    elements: cubeMesh.elements,
    cull: {
      enable: true,
    },
  });
}

function initializeGlobalState(reglCtx) {
  // WTF IS THIS SHIT
  // keeps track of all global state.
  return reglCtx({
    uniforms: {
      lightDir: [0.39, 0.87, 0.29],
      view: () => viewMat,
      projection: projMat,
    },
  });
}

function main(sources) {
  const { DOM, Time } = sources;
  const frame$ = Time.animationFrames();

  const cubeHits$ = DOM
    .select('#panel-1')
    .events('mousemove')
    .map(e => ({
      x: e.offsetX / e.target.clientWidth,
      y: e.offsetY / e.target.clientHeight,
      // find a better place to do this?
      proj: mat4.perspective(
        projMat,
        Math.PI / 4,
        e.target.clientWidth / e.target.clientHeight,
        0.01,
        1000
      ),
    }));

  // This is ugly AF, needs to be changed
  const meshes$ = xs.of([{
    geometry: cubeMesh,
    scale: 2.0,
    position: [0.0, 0.0, 0.0],
    rotation: [0.0, 0.0, 0.0],
    // do this right
    meshMatrix: createTransformMatrix([0.0, 0.0, 0.0], [0.0, 0.0, 0.0]),
  }]);

  const state$ = cubeHits$.compose(sampleCombine(meshes$))
    .map(([ray, meshes]) => getRayHits(meshes, ray.proj, viewMat, ray.x, ray.y))
    .debug();

  const regl$ = DOM.select('#panel-1').elements().map(([e]) => REGL(e));

  const render$ = state$.compose(sampleCombine(regl$))
    .map(([state, regl]) => {
      const globalScope = initializeGlobalState(regl);
      const drawSimple = makeSimpleDraw(regl);
      const drawModel = makeModelDraw(regl);

      // have this function accept some game params that can change camera and shit
      return () => {
        regl.clear({
          depth: 1,
          color: [0, 0, 0, 1],
        });
        const cubeColor = [0.6, 0.0, 0.0]; // cubeHit ?  : [0.0, 0.0, 0.6];
        globalScope(() => {
          drawSimple(() => {
            drawModel({ scale: 2.0, translate: [0.0, 0.0, 0.0], color: cubeColor });
          });
        });
      };
    });

  // Render stream, find a better place for this
  frame$.compose(sampleCombine(render$))
    .subscribe({
      next: ([_, render]) => {
        render();
        // console.log(render);
      },
      error: (err) => {
        console.error('The Stream gave me an error: ', err);
      },
      complete: () => {
        console.log('The Stream told me it is done.');
      },
    });


  const sinks = {
    DOM: view().debug(),
  };
  return sinks;
}

export default main;
