import vec3 from 'gl-vec3';

export function intersectTriangle(out, pt, dir, tri) {
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

  if (det < EPSILON) return null;
  vec3.subtract(tvec, pt, tri[0]);
  const u = vec3.dot(tvec, pvec);
  if (u < 0 || u > det) return null;
  vec3.cross(qvec, tvec, edge1);
  const v = vec3.dot(dir, qvec);
  if (v < 0 || u + v > det) return null;

  const t = vec3.dot(edge2, qvec) / det;
  // it's js, just return the goddamn array or something

  out[0] = pt[0] + t * dir[0];
  out[1] = pt[1] + t * dir[1];
  out[2] = pt[2] + t * dir[2];
  return t;
}

export default {
  intersectTriangle,
};
