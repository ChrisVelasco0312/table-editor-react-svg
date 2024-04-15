const Lines = ({ vertices, width, height }) => (
  <>
    {vertices.map((vertex, index) => {
      const nextVertex = vertices[(index + 1) % vertices.length];
      const x1 = vertex.x * width;
      const y1 = vertex.y * height;
      const x2 = nextVertex.x * width;
      const y2 = nextVertex.y * height;

      return (
        <line
          key={index}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="black"
          strokeWidth="2"
        />
      );
    })}
  </>
);

export default Lines;
