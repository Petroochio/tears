import { createTransformMatrix } from './MatrixHelpers';

export function createRenderState(reglCtx, viewMat, projMat) {
  // keeps track of all global state.
  return reglCtx({
    uniforms: {
      lightDir: [0.39, 0.87, 0.29],
      view: () => viewMat,
      projection: projMat,
    },
  });
}

export function createMeshDraw(reglCtx) {
  return reglCtx({
    uniforms: {
      model: (_, props) => createTransformMatrix(props.translate, props.scale),
      ambientLightAmount: 0.3,
      diffuseLightAmount: 0.9,
      color: reglCtx.prop('color'),
      isRound: false,
    },
    attributes: {
      position: (_, props) => props.mesh.position,
      normal: (_, props) => props.mesh.normal,
    },
    elements: (_, props) => props.mesh.elements,
    cull: {
      enable: true,
    },
  });
}

export function createSimpleDraw(reglCtx) {
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

export default {
  createRenderState,
  createMeshDraw,
  createSimpleDraw,
};
