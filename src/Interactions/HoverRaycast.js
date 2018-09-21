import Raycast, { getRayHits } from '../Utils/Raycast';

function getHoverState(ray, target) {
  
}
/* Raycast stuff
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
end raycast */

// Create a reusable regl context
// const regl$ = DOM.select('#panel-1').elements().map(([e]) => REGL(e));

// const render$ = state$.compose(sampleCombine(regl$))
//   .map(([state, regl]) => {
//     // these could probably be created in another stream to be combined with
//     // the state so the functions don't need to change
//     const globalScope = createRenderState(regl, viewMat, projMat);
//     const drawSimple = createSimpleDraw(regl);
//     const drawMesh = createMeshDraw(regl);

//     // have this function accept some game params that can change camera and shit
//     return () => {
//       regl.clear({
//         depth: 1,
//         color: [0, 0, 0, 1],
//       });
//       const cubeColor = state[0] < Infinity ? [0.0, 0.0, 0.6] : [0.6, 0.0, 0.0];

//       globalScope(() => {
//         // Why do they go in this order
//         // I guess it just sets the shaders -.-
//         drawSimple(() => {
//           // the params here kind equal props I think?
//           drawMesh({
//             scale: [2.0, 2.0, 2.0],
//             translate: [0.0, 0.0, 0.0],
//             color: cubeColor,
//             mesh: cubeMesh,
//           });
//         });
//       });
//     };
//   });