// Decision system is nowhere to be seen
// Could make a live JSON editor .... O.O
export default {
  scenes: [
    {
      // should I remove the hash?
      // don't need ids if I have the styles included
      id: '#panel-1',
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
        },
      ],
    },

    {
      id: '#panel-2',
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
        },
      ],
    },
  ],
};
