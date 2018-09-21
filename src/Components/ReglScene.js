import xs from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import { canvas } from '@cycle/dom';
import REGL from 'regl';
import { prop, map } from 'ramda';
import mat4 from 'gl-mat4';

import { getGeometry } from '../Geometries';
import { createTransformMatrix } from '../Utils/MatrixHelpers';
import { createRenderState, createMeshDraw, createSimpleDraw } from '../Utils/DrawHelpers';

// WTF IS THIS SHIT???
// This needs to be configured from the JSON and set by what the camera stream is
const viewMat = new Float32Array([
  1, -0, 0, 0,
  0, 0.876966655254364, 0.48055124282836914, 0,
  -0, -0.48055124282836914, 0.876966655254364, 0,
  0, 0, -11.622776985168457, 1,
]);

function processMesh(props) {
  return {
    ...props,
    geometry: getGeometry(props.geometry),
    matrix: createTransformMatrix(props.position, props.scale),
  };
}

function view(id, width, height, style) {
  // Later replace id with css
  return xs.of(canvas(`${id}.scene`, { style, attrs: { width, height } }));
}

function ReglScene(sources) {
  const { DOM, frame$, props } = sources;

  // I guess we need to init the projection matrix here
  // I wish there were a better way to do this,
  // but this is the only way I know how to calc the projection mat
  const projMatrix = new Float32Array(16);
  mat4.perspective(
    projMatrix,
    Math.PI / 4,
    props.width / props.height,
    0.01,
    1000
  );

  // should this just hold initial values or change with updates?
  const meshes$ = DOM.select('.scene').elements()
    .mapTo(props.objects)
    .map(map(processMesh));

  // Create a reusable regl context
  const regl$ = DOM.select('.scene').elements().map(([e]) => REGL(e));
  // Use the interactions from the

  // Combine meshes$ with state$?
  const render$ = meshes$.compose(sampleCombine(regl$))
    .map(([meshes, regl]) => {
      // regl.destroy() when done to save cleanup
      // these could probably be created in another stream to be combined with
      // the state so the functions don't need to change
      const globalScope = createRenderState(regl, viewMat, projMatrix);
      const drawSimple = createSimpleDraw(regl);
      // could the mesh be props?
      const drawMesh = createMeshDraw(regl);

      // have this function accept some game params that can change camera and shit
      return () => {
        regl.clear({
          depth: 1,
          color: [0, 0, 0, 1],
        });

        // SIDE EFFECTS !!!!!!!!
        meshes.forEach((mesh) => {
          globalScope(() => {
            // Why do they go in this order
            // I guess it just sets the shaders -.-
            drawSimple(() => {
              // the params here kind equal props I think?
              drawMesh({
                mesh: mesh.geometry,
                scale: mesh.scale,
                rotate: mesh.rotation,
                translate: mesh.position,
                color: mesh.color,
              });
            });
          });
        });
      };
    });

  // Render stream, find a better place for this
  // create an initial state so this renders properly
  // Should also combine the state stream here
  frame$.compose(sampleCombine(render$))
    .subscribe({
      next: ([_, render]) => {
        render();
        // console.log(render);
      },
    });

  // sinks
  return {
    DOM: view(props.id, props.width, props.height, props.style),
  };
}

export default ReglScene;
