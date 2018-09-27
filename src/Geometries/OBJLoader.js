import { isEmpty } from 'ramda';
import * as Vec3 from '../Utils/Vector3';

// Idk what's the right way to calculate normals!!!
function compileCrosses(verts) {
  return (crosses, face) => {
    const [a, b, c] = face;
    // do cross of side (b - a).normalized and (c - a).normalized
    const cross = Vec3.cross(
      // Vec3.normalize(Vec3.sub(verts[b], verts[a])),
      // Vec3.normalize(Vec3.sub(verts[c], verts[a]))
      Vec3.sub(verts[b], verts[a]),
      Vec3.sub(verts[c], verts[a])
    );

    crosses[a].push(cross);
    crosses[b].push(cross);
    crosses[c].push(cross);
    return crosses;
  };
}

function averageNormals(normals) {
  const nTotal = normals.reduce(Vec3.add, [0, 0, 0]);
  return Vec3.normalize(nTotal);
  // return Vec3.scale(nTotal, 1 / normals.length);
}

function parseObj(file) {
  const lines = file.split('\n');
  const verts = lines
    .filter(s => s[0] === 'v')
    .map(f =>
      f.split(' ')
        // this should be regex
        .filter(v => v !== 'v' && !isEmpty(v))
        .map(parseFloat));

  const faces = lines
    .filter(s => s[0] === 'f')
    .map(f =>
      f.split(' ')
        // this should be regex
        .filter(v => v !== 'f' && !isEmpty(v))
        .map(x => parseInt(x, 10))
        // something up with faces
        .map(x => x - 1));

  const normalSeed = verts.map(() => []);
  const n = faces.reduce(compileCrosses(verts), normalSeed);
  const normal = n.map(averageNormals);

  return {
    normal,
    elements: faces,
    position: verts,
  };
}

export function importOBJ(filename) {
  return fetch(new Request(filename))
    .then(resp => resp.text())
    .then(parseObj);
}

export default {
  importOBJ,
};
