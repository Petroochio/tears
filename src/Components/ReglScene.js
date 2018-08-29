import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import { canvas } from '@cycle/dom';
import REGL from 'regl';
import { prop, map } from 'ramda';

import Geometries, { getGeometry } from '../Geometries';
import { createTransformMatrix } from '../Utils/MatrixHelpers';
import { createRenderState, createMeshDraw, createSimpleDraw } from '../Utils/DrawHelpers';

const cubeMesh = Geometries.primitives.createCube();

// This should be configured in the children somehow
const viewMat = new Float32Array([
  1, -0, 0, 0,
  0, 0.876966655254364, 0.48055124282836914, 0,
  -0, -0.48055124282836914, 0.876966655254364, 0,
  0, 0, -11.622776985168457, 1,
]);
const projMat = new Float32Array(16);

function processMesh(props) {
  return {
    ...props,
    geometry: getGeometry(props.geometry),
    matrix: createTransformMatrix(props.position, props.scale),
  };
}

function view(id) {
  // Later replace id with css
  return xs.of(canvas(`${id}.scene`, { attrs: { width: 400, height: 400 } }));
}

function ReglScene(sources) {
  const { DOM, frame$, props } = sources;

  // should this just hold initial values or change with updates?
  const meshes$ = DOM.select('.scene').elements()
    .mapTo(props.objects)
    .map(map(processMesh));

  // Create a reusable regl context
  const regl$ = DOM.select('.scene').elements().map(([e]) => REGL(e));

  // Combine meshes$ with state$?
  const render$ = meshes$.compose(sampleCombine(regl$)).debug()
    .map(([meshes, regl]) => {
      // these could probably be created in another stream to be combined with
      // the state so the functions don't need to change
      const globalScope = createRenderState(regl, viewMat, projMat);
      const drawSimple = createSimpleDraw(regl);
      // could the mesh be props?
      const drawMesh = createMeshDraw(regl);

      // have this function accept some game params that can change camera and shit
      return () => {
        regl.clear({
          depth: 1,
          color: [0, 0, 0, 1],
        });
        const cubeColor = [1, 1, 1];
        globalScope(() => {
          // Why do they go in this order
          // I guess it just sets the shaders -.-
          drawSimple(() => {
            // the params here kind equal props I think?
            drawMesh({
              mesh: cubeMesh,
              scale: [2.0, 2.0, 2.0],
              translate: [0.0, 0.0, 0.0],
              color: cubeColor,
            });
          });
        });

        // SIDE EFFECTS !!!!!!!!
        // meshes.forEach((mesh) => {
        //   globalScope(() => {
        //     // Why do they go in this order
        //     // I guess it just sets the shaders -.-
        //     drawSimple(() => {
        //       // the params here kind equal props I think?
        //       drawMesh({
        //         mesh: cubeMesh,
        //         scale: [2.0, 2.0, 2.0],
        //         translate: [0.0, 0.0, 0.0],
        //         color: cubeColor,
        //       });
        //     });
        //   });
        // });
      };
    });

  // Render stream, find a better place for this
  // create an initial state so this renders properly
  frame$.compose(sampleCombine(render$))
    .subscribe({
      next: ([_, render]) => {
        render();
        // console.log(render);
      },
    });

  // sinks
  return {
    DOM: view(props.id),
  };
}

export default ReglScene;
