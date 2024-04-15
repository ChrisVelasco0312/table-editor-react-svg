const SVGContainer = ({ width, height, children }) => {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {children}
    </svg>
  );
};

export default SVGContainer;
