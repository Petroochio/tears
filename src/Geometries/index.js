/**
 * Helper functions for creating meshes
 *
 * Each of these should return just a plain data object with necessary mesh info
 * this looks like a perfect use case for typescript -.-
 * ALSO greate use case for sub repo
 * that info looks like:
 * {
 *   positions: [[x, y, z]],
 *   normals: [[x, y, z]?] -> same size as positions, no idea what these are yet
 *   elements: [[0, 1, 2]], -> faces
 * }
 */
import createCube from './Cube';
import { CATEGORIES, PRIMITIVE_TYPES } from './GeometryTypes';

function getPrimitve(type, params) {
  // Switch, hash map?
  if (type === PRIMITIVE_TYPES.CUBE) {
    createCube(...params);
  }
}

export function getGeometry(options) {
  const { category, type, params } = options;
  if (category === CATEGORIES.PRIMITIVES) {
    return getPrimitve(type, params);
  }

  return createCube();
}

export default {
  getGeometry,

  primitives: {
    createCube,
  },

  importers: {
    importOBJ: () => ':p',
  },
};
