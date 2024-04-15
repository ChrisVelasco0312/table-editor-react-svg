import SVGContainer from "./SVGContainer";

const SVGTableEditor = ({
  boundingPoly,
  verticalLines,
  horizontalLines,
  width,
  height,
}) => {
  const { vertices } = boundingPoly;
  const boundingBox = {
    minX: Math.min(...vertices.map((vertex) => vertex.x)),
    minY: Math.min(...vertices.map((vertex) => vertex.y)),
    maxX: Math.max(...vertices.map((vertex) => vertex.x)),
    maxY: Math.max(...vertices.map((vertex) => vertex.y)),
  };
  boundingBox.width = boundingBox.maxX - boundingBox.minX;
  boundingBox.height = boundingBox.maxY - boundingBox.minY;

  const handleVerticalLineMouseDown = (event) => {
    const startX = event.clientX;
    console.log(startX, event);
  };

  return (
    <SVGContainer width={width} height={height}>
      {/* Render bounding rectangle */}
      <rect
        x={boundingBox.minX * width}
        y={boundingBox.minY * height}
        width={boundingBox.width * width}
        height={boundingBox.height * height}
        fill="none"
        stroke="red"
        strokeWidth="2"
      />

      {verticalLines.map((line, index) => (
        <line
          key={`vertical-${index}`}
          x1={line.first.x * width}
          y1={line.first.y * height}
          x2={line.last.x * width}
          y2={line.last.y * height}
          stroke="black"
          strokeWidth="1"
          onMouseDown={handleVerticalLineMouseDown}
        />
      ))}
      {horizontalLines.map((line, index) => (
        <line
          key={`horizontal-${index}`}
          x1={line.first.x * width}
          y1={line.first.y * height}
          x2={line.last.x * width}
          y2={line.last.y * height}
          stroke="black"
          strokeWidth="1"
        />
      ))}
    </SVGContainer>
  );
};

export default SVGTableEditor;
