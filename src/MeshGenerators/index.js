/**
 * Helper functions for creating meshes
 *
 * Each of these should return just a plain data object with necessary mesh info
 * this looks like a perfect use case for typescript -.-
 * that info looks like:
 * {
 *   positions: [[x, y, z]],
 *   normals: [[x, y, z]?] -> same size as positions, no idea what these are yet
 *   elements: [[0, 1, 2]], -> faces
 * }
 */
import createCube from './Cube';

export default {
  primitives: {
    createCube,
  },
};
