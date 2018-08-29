import mat4 from 'gl-mat4';

// Where is rotation
export function createTransformMatrix(translate, scale) {
  const m = mat4.identity([]);

  mat4.scale(m, m, scale);
  // rotation here
  mat4.translate(m, m, translate);

  return m;
}

export default {
  createTransformMatrix,
};
