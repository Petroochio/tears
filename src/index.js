import xs from 'xstream';
import REGL from 'regl';
import mat4 from 'gl-mat4';

import CubeMesh from './CubeMesh';
import { getRayHits } from './Raycast';

// WTF IS THIS SHIT
const viewMatrix = new Float32Array([
  1, -0, 0, 0,
  0, 0.876966655254364, 0.48055124282836914, 0,
  -0, -0.48055124282836914, 0.876966655254364, 0,
  0, 0, -11.622776985168457, 1,
]);
const projectionMatrix = new Float32Array(16);

function createModelMatrix(props) {
  const m = mat4.identity([]);

  mat4.translate(m, m, props.translate);

  const s = props.scale;
  mat4.scale(m, m, [s, s, s]);

  return m;
}

// Do we wanna add cycle? YES!!!! Do it tomorrow once you have raycasting going
function main() {
  const panel1 = document.querySelector('#panel-1');
  const panel2 = document.querySelector('#panel-2');
  // const panel3 = document.querySelector('#panel-3');

  // This will get weird with a vdom
  const regl = REGL(panel1);

  // WTF IS THIS SHIT
  // keeps track of all global state.
  const globalScope = regl({
    uniforms: {
      lightDir: [0.39, 0.87, 0.29],
      view: () => viewMatrix,
      projection: ({ viewportWidth, viewportHeight }) =>
        mat4.perspective(
          projectionMatrix,
          Math.PI / 4,
          viewportWidth / viewportHeight,
          0.01,
          1000
        ),
    },
  });

  const drawSimple = regl({
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

  const drawModel = regl({
    uniforms: {
      model: (_, props, batchId) => createModelMatrix(props),
      ambientLightAmount: 0.3,
      diffuseLightAmount: 0.7,
      color: regl.prop('color'),
      isRound: false,
    },
    attributes: {
      position: CubeMesh.position,
      normal: CubeMesh.normal,
    },
    elements: CubeMesh.elements,
    cull: {
      enable: true,
    },
  });

  // !!!
  let cubeHit = false;

  // Raycast shit
  panel1.addEventListener('mousemove', (e) => {
    // Generate this somewhere else plx
    // Cycle would be nice :3
    const meshData = { scale: 2.0, translate: [0.0, 0.0, 0.0] };

    const meshMatrix = createModelMatrix(meshData);
    const targets = [{ mesh: CubeMesh, meshMatrix }];
    const screenX = e.offsetX / 400; // Get actual div size
    const screenY = e.offsetY / 400; // Get actual div size

    if (getRayHits(targets, projectionMatrix, viewMatrix, screenX, screenY)[0] < 10000) {
      cubeHit = true;
    } else {
      cubeHit = false;
    }
  });

  // draw();
  regl.frame(() => {
    regl.clear({
      depth: 1,
      color: [0, 0, 0, 1],
    });

    const cubeColor = cubeHit ? [0.6, 0.0, 0.0] : [0.0, 0.0, 0.6];
    globalScope(() => {
      drawSimple(() => {
        drawModel({ scale: 2.0, translate: [0.0, 0.0, 0.0], color: cubeColor });
      });
    });
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
