import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import { div, canvas } from '@cycle/dom';
import isolate from '@cycle/isolate';
import REGL from 'regl';
import mat4 from 'gl-mat4';
import { nth, prop } from 'ramda';

import ReglScene from './Components/ReglScene';
import Geometries from './Geometries';
import Raycast, { getRayHits } from './Utils/Raycast';
import { createTransformMatrix } from './Utils/MatrixHelpers';
import { createRenderState, createMeshDraw, createSimpleDraw } from './Utils/DrawHelpers';

import page1 from './Pages/TempPage';
import { propsModule } from '../node_modules/snabbdom/modules/props';

const cubeMesh = Geometries.primitives.createCube();

// WTF IS THIS SHIT
const viewMat = new Float32Array([
  1, -0, 0, 0,
  0, 0.876966655254364, 0.48055124282836914, 0,
  -0, -0.48055124282836914, 0.876966655254364, 0,
  0, 0, -11.622776985168457, 1,
]);
const projMat = new Float32Array(16);

function view(children$) {
  return children$.map(children => div('#current-page', [
    // set these values from json anyway
    canvas('#panel-1', { attrs: { width: 400, height: 400 } }),
    children,
  ]));
}

function main(sources) {
  const { DOM, Time } = sources;
  const frame$ = Time.animationFrames();

  // Just testing the json for now
  const scene1$ = xs.of(page1.scenes[1])
    .map(sceneProps => isolate(ReglScene)({ DOM, frame$, props: sceneProps }));

  const scene1Dom$ = scene1$.map(prop('DOM')).flatten();

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
    meshMatrix: createTransformMatrix([0.0, 0.0, 0.0], [2, 2, 2]),
  }]);

  const state$ = cubeHits$.compose(sampleCombine(meshes$))
    .map(([ray, meshes]) => getRayHits(meshes, ray.proj, viewMat, ray.x, ray.y));

  // Create a reusable regl context
  const regl$ = DOM.select('#panel-1').elements().map(([e]) => REGL(e));

  const render$ = state$.compose(sampleCombine(regl$))
    .map(([state, regl]) => {
      // these could probably be created in another stream to be combined with
      // the state so the functions don't need to change
      const globalScope = createRenderState(regl, viewMat, projMat);
      const drawSimple = createSimpleDraw(regl);
      const drawMesh = createMeshDraw(regl);

      // have this function accept some game params that can change camera and shit
      return () => {
        regl.clear({
          depth: 1,
          color: [0, 0, 0, 1],
        });
        const cubeColor = state[0] < Infinity ? [0.0, 0.0, 0.6] : [0.6, 0.0, 0.0];

        globalScope(() => {
          // Why do they go in this order
          // I guess it just sets the shaders -.-
          drawSimple(() => {
            // the params here kind equal props I think?
            drawMesh({
              scale: [2.0, 2.0, 2.0],
              translate: [0.0, 0.0, 0.0],
              color: cubeColor,
              mesh: cubeMesh,
            });
          });
        });
      };
    });

  // Render stream, find a better place for this
  // create an initial state so this renders properly
  frame$.compose(sampleCombine(render$))
    .subscribe({
      next: ([_, render]) => {
        render();
      },
    });

  const sinks = {
    // pass the children into the view
    DOM: view(scene1Dom$),
  };
  return sinks;
}

export default main;
