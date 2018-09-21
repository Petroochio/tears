// Decision system is nowhere to be seen
// Could make a live JSON editor .... O.O
export default {
  scenes: [
    {
      // should I remove the hash?
      // don't need ids if I have the styles included
      id: '#panel-1',
      width: 400,
      height: 400,
      style: {
        position: 'absolute',
        background: '#000000',
        overflow: 'hidden',
        clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)',
      },
      // -webkit-clip-path: polygon(0 0, 100% 0, 80% 100%, 0 100%);
      // styles should go right here
      objects: [
        {
          // I wonder if there is a better way to do this?
          geometry: {
            category: 'PRIMITIVE',
            type: 'CUBE',
            params: [],
          },
          // This will get messy quick
          interaction: {
            type: 'HOVER-COLOR',
            color: [[0.6, 0, 0], [0, 0, 0.6]],
          },
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [2, 2, 2],
          color: [0, 0.6, 0.6],
        },
      ],
    },

    {
      id: '#panel-2',
      width: 400,
      height: 400,
      style: {
        position: 'absolute',
        left: '340px',
        background: '#000000',
        overflow: 'hidden',
        clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)',
      },
      //   -webkit-clip-path: polygon(20% 0, 100% 0, 100% 100%, 0 100%);
      objects: [
        {
          geometry: {
            category: 'PRIMITIVE',
            type: 'CUBE',
            params: [],
          },
          interaction: {
            type: 'HOVER-COLOR',
            color: [[0, 0.6, 0], [0, 1, 0]],
          },
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [2, 2, 2],
          color: [0, 0.6, 0],
        },

        {
          // I wonder if there is a better way to do this?
          geometry: {
            category: 'PRIMITIVE',
            type: 'CUBE',
            params: [],
          },
          // This will get messy quick
          interaction: {
            type: 'HOVER-COLOR',
            color: [[0.6, 0, 0], [0, 0, 0.6]],
          },
          position: [2, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          color: [0.6, 0, 0],
        },
      ],
    },

    {
      // should I remove the hash?
      // don't need ids if I have the styles included
      id: '#panel-3',
      width: 733,
      height: 400,
      style: {
        position: 'absolute',
        background: '#000000',
        overflow: 'hidden',
        top: '420px',
      },
      // styles should go right here
      objects: [
        {
          // I wonder if there is a better way to do this?
          geometry: {
            category: 'PRIMITIVE',
            type: 'CUBE',
            params: [],
          },
          // This will get messy quick
          interaction: {
            type: 'HOVER-COLOR',
            color: [[0.6, 0, 0], [0, 0, 0.6]],
          },
          position: [0.2, 0, 0],
          rotation: [0, 0, 0],
          scale: [5, 2, 2],
          color: [0.8, 0.6, 0],
        },
      ],
    },
  ],
};
