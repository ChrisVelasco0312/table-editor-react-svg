import SVGContainer from "./SVGContainer";

const SVGTable = ({ data, width, height }) => {
  const { verticalLines, horizontalLines } = data;

  return (
    <SVGContainer width={width} height={height}>
      {verticalLines.map((line, index) => (
        <line
          key={`vertical-${index}`}
          x1={line.first.x * width}
          y1={line.first.y * height}
          x2={line.last.x * width}
          y2={line.last.y * height}
          stroke="black"
          strokeWidth="1"
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

export default SVGTable;
