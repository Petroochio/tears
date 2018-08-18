import { curry } from 'ramda';
import vec3 from 'gl-vec3';
import mat4 from 'gl-mat4';

const MAX_DIST = Infinity;

// This is copy pasta
// Probs want to refactor to my taste
//
// what I don't understand is why did they use an "out" var if they were
// worried about the gc, but they use these throwaway arrays at the top?
export function intersectTriangle(pt, dir, tri) {
  const EPSILON = 0.000001;
  const edge1 = [0, 0, 0];
  const edge2 = [0, 0, 0];
  const tvec = [0, 0, 0];
  const pvec = [0, 0, 0];
  const qvec = [0, 0, 0];

  vec3.subtract(edge1, tri[1], tri[0]);
  vec3.subtract(edge2, tri[2], tri[0]);

  vec3.cross(pvec, dir, edge2);
  const det = vec3.dot(edge1, pvec);

  // I don't like this
  if (det < EPSILON) return null;
  vec3.subtract(tvec, pt, tri[0]);
  const u = vec3.dot(tvec, pvec);
  if (u < 0 || u > det) return null;
  vec3.cross(qvec, tvec, edge1);
  const v = vec3.dot(dir, qvec);
  if (v < 0 || u + v > det) return null;

  const t = vec3.dot(edge2, qvec) / det;

  return t;
}

function getRayDistance(rayPoint, rayDirection, target) {
  const { geometry, meshMatrix } = target;

  // We must check all triangles of the mesh.
  return geometry.elements.reduce((dist, face) => {
    // This applies translation and scale to the mesh so raycast cna calc properly
    const tri = [
      vec3.transformMat4([], geometry.position[face[0]], meshMatrix),
      vec3.transformMat4([], geometry.position[face[1]], meshMatrix),
      vec3.transformMat4([], geometry.position[face[2]], meshMatrix),
    ];

    // returns distance if hit
    const t = intersectTriangle(rayPoint, rayDirection, tri);

    // gross
    if (t !== null && t < dist) {
      return t;
    }

    return dist;
  }, MAX_DIST);
}

/**
 * Returns of mirrored objects that show distance from ray. 10000 means no hit
 *
 * @param {array[model]} targets : array of targets with model information
 * @param {mat4} projectionMatrix
 * @param {mat4} viewMatrix
 * @param {num} screenX : X position of ray relative to the container
 * @param {num} screenY : Y position of ray relative to the container
 */
export function getRayHits(targets, projectionMatrix, viewMatrix, screenX, screenY) {
  const vp = mat4.multiply([], projectionMatrix, viewMatrix);
  const invVp = mat4.invert([], vp);

  // get a single point on the camera ray.
  // using temp shit here
  const rayPoint = vec3.transformMat4(
    [],
    [(2.0 * screenX) - 1.0, (-2.0 * screenY) + 1.0, 0.0],
    invVp
  );

  // get the position of the camera.
  const rayOrigin = vec3.transformMat4([], [0, 0, 0], mat4.invert([], viewMatrix));
  const rayDir = vec3.normalize([], vec3.subtract([], rayPoint, rayOrigin));

  // now we iterate through all the targets and return the hit distance of each
  return targets.map(curry(getRayDistance)(rayPoint, rayDir));
}

export default {
  getRayHits,
};
