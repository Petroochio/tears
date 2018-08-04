// Hold my code while I set up raycasting
// const drawCube = regl({
//   frag: `
//     precision mediump float;
//     uniform vec2 resolution;

//     vec3 colorA = vec3(1, 0.0, 1);
//     vec3 colorB = vec3(1, 1, 1);

//     void main() {
//       vec2 st = gl_FragCoord.xy/resolution.xy;
//       vec3 color = vec3(0.0);
//       color = mix(colorA, colorB, vec3(st.x));
//       gl_FragColor = vec4(color, 1);
//     }`,

//   vert: `
//     precision mediump float;
//     attribute vec3 position;
//     uniform mat4 model, view, projection;
//     void main() {
//       gl_Position = projection * view * model * vec4(position, 1);
//     }`,

//   attributes: {
//     position: CubeMesh.position,
//   },
//   elements: CubeMesh.elements,

//   uniforms: {
//     // the batchId parameter gives the index of the command
//     resolution: ({ viewportWidth, viewportHeight }) => [viewportWidth, viewportHeight],
//     model: mat4.identity([]),
//     view: ({ tick }) => {
//       const t = 0.01 * tick;
//       return mat4.lookAt(
//         [],
//         [3 * Math.cos(t), 0, 3 * Math.sin(t)],
//         [0, 0, 0],
//         [0, 1, 0]
//       );
//     },
//     projection: ({ viewportWidth, viewportHeight }) =>
//       mat4.perspective(
//         [],
//         Math.PI / 4,
//         viewportWidth / viewportHeight,
//         0.01,
//         1000
//       ),
//   },
// });

const position = [
  [-0.5, +0.5, +0.5], [+0.5, +0.5, +0.5], [+0.5, -0.5, +0.5], [-0.5, -0.5, +0.5], // positive z face
  [+0.5, +0.5, +0.5], [+0.5, +0.5, -0.5], [+0.5, -0.5, -0.5], [+0.5, -0.5, +0.5], // positive x face
  [+0.5, +0.5, -0.5], [-0.5, +0.5, -0.5], [-0.5, -0.5, -0.5], [+0.5, -0.5, -0.5], // negative z face
  [-0.5, +0.5, -0.5], [-0.5, +0.5, +0.5], [-0.5, -0.5, +0.5], [-0.5, -0.5, -0.5], // negative x face
  [-0.5, +0.5, -0.5], [+0.5, +0.5, -0.5], [+0.5, +0.5, +0.5], [-0.5, +0.5, +0.5], // top face
  [-0.5, -0.5, -0.5], [+0.5, -0.5, -0.5], [+0.5, -0.5, +0.5], [-0.5, -0.5, +0.5], // bottom face
];

const normal = [
  [0.0, 0.0, +1.0], [0.0, 0.0, +1.0], [0.0, 0.0, +1.0], [0.0, 0.0, +1.0],
  [+1.0, 0.0, 0.0], [+1.0, 0.0, 0.0], [+1.0, 0.0, 0.0], [+1.0, 0.0, 0.0],
  [0.0, 0.0, -1.0], [0.0, 0.0, -1.0], [0.0, 0.0, -1.0], [0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.0], [-1.0, 0.0, 0.0], [-1.0, 0.0, 0.0], [-1.0, 0.0, 0.0],
  // top
  [0.0, +1.0, 0.0], [0.0, +1.0, 0.0], [0.0, +1.0, 0.0], [0.0, +1.0, 0.0],
  // bottom
  [0.0, -1.0, 0.0], [0.0, -1.0, 0.0], [0.0, -1.0, 0.0], [0.0, -1.0, 0.0],
];

const elements = [
  [2, 1, 0], [2, 0, 3], // positive z face.
  [6, 5, 4], [6, 4, 7], // positive x face.
  [10, 9, 8], [10, 8, 11], // negative z face.
  [14, 13, 12], [14, 12, 15], // negative x face.
  [18, 17, 16], [18, 16, 19], // top face.
  [20, 21, 22], [23, 20, 22], // bottom face
];

const cube = {
  position,
  elements,
  normal,
};

export default cube;
