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
import xs from 'xstream';

import createCube from './Cube';
import { CATEGORIES, PRIMITIVE_TYPES } from './GeometryTypes';
import { importOBJ } from './OBJLoader';

function getPrimitve(type, params) {
  // Switch, hash map?
  if (type === PRIMITIVE_TYPES.CUBE) {
    return createCube(...params);
  }

  return createCube(...params);
}

/**
 * Returns an observable with a single item that contains the geometry
 * @param {} options : { category, type, params }
 */
export function getGeometry(options) {
  const { category, type, params } = options;
  if (category === CATEGORIES.PRIMITIVE) {
    return xs.of(getPrimitve(type, params));
  } else if (category === CATEGORIES.FILE) {
    return xs.fromPromise(importOBJ(params));
  }

  return createCube();
}

export default {
  primitives: {
    createCube,
  },

  importers: {
    importOBJ,
  },
};
