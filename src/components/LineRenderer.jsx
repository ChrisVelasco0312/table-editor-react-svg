const LineRenderer = ({ points }) => {
  return (
    <svg id="line-canvas" width="300" height="800">
      {points.map((point, index) => {
        if (index < points.length - 1) {
          const nextPoint = points[index + 1];
          const x1 = point[0];
          const y1 = point[1];
          const x2 = nextPoint[0];
          const y2 = nextPoint[1];

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
        }
        return null;
      })}
    </svg>
  );
};

export default LineRenderer;
