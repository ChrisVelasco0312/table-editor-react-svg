import { useEffect, useRef, useState } from "react";
import SVGContainer from "./SVGContainer";

const SVGTableEditor = ({
  boundingPoly,
  verticalLines,
  horizontalLines,
  width,
  height,
  onLinesUpdate,
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

  const [draggedLine, setDraggedLine] = useState(null);
  const [verticalPositions, setVerticalPositions] = useState([]);
  const [horizontalPositions, setHorizontalPositions] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    setVerticalPositions(verticalLines.map((line) => line.vertices[0].x));
    setHorizontalPositions(horizontalLines.map((line) => line.vertices[0].y));
  }, [verticalLines, horizontalLines]);

  const handleLineMouseDown = (_, lineType, index) => {
    setDraggedLine({ lineType, index });
  };

  const handleMouseMove = (event) => {
    if (!draggedLine) return;

    const { lineType, index } = draggedLine;
    const svgRect = svgRef.current.getBoundingClientRect();
    const offsetX = event.clientX - svgRect.left;
    const offsetY = event.clientY - svgRect.top;

    if (lineType === "vertical") {
      const newX = Math.min(
        Math.max(offsetX / width, boundingBox.minX),
        boundingBox.maxX,
      );
      setVerticalPositions((prevPositions) => {
        const newPositions = [...prevPositions];
        newPositions[index] = newX;
        return newPositions;
      });
    } else if (lineType === "horizontal") {
      const newY = Math.min(
        Math.max(offsetY / height, boundingBox.minY),
        boundingBox.maxY,
      );
      setHorizontalPositions((prevPositions) => {
        const newPositions = [...prevPositions];
        newPositions[index] = newY;
        return newPositions;
      });
    }
  };

  const handleMouseUp = () => {
    if (draggedLine) {
      const { lineType, index } = draggedLine;
      if (lineType === "vertical") {
        const newVerticalLines = verticalLines.map((line, i) => {
          if (i === index) {
            const newLine = { ...line };
            newLine.vertices = newLine.vertices.map((vertex) => ({
              ...vertex,
              x: verticalPositions[index],
            }));
            return newLine;
          }
          return line;
        });
        onLinesUpdate(newVerticalLines, horizontalLines);
      } else if (lineType === "horizontal") {
        const newHorizontalLines = horizontalLines.map((line, i) => {
          if (i === index) {
            const newLine = { ...line };
            newLine.vertices = newLine.vertices.map((vertex) => ({
              ...vertex,
              y: horizontalPositions[index],
            }));
            return newLine;
          }
          return line;
        });
        onLinesUpdate(verticalLines, newHorizontalLines);
      }
    }
    setDraggedLine(null);
  };

  return (
    <SVGContainer
      width={width}
      height={height}
      ref={svgRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
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

      {verticalPositions.map((position, index) => (
        <line
          key={`vertical-${index}`}
          x1={position * width}
          y1={verticalLines[index].vertices[0].y * height}
          x2={position * width}
          y2={verticalLines[index].vertices[1].y * height}
          stroke="black"
          strokeWidth="1"
          onMouseDown={(event) => handleLineMouseDown(event, "vertical", index)}
          style={{ cursor: "ew-resize" }}
        />
      ))}
      {horizontalPositions.map((position, index) => (
        <line
          key={`horizontal-${index}`}
          x1={horizontalLines[index].vertices[0].x * width}
          y1={position * height}
          x2={horizontalLines[index].vertices[1].x * width}
          y2={position * height}
          stroke="black"
          strokeWidth="1"
          onMouseDown={(event) =>
            handleLineMouseDown(event, "horizontal", index)
          }
          style={{ cursor: "ns-resize" }}
        />
      ))}
    </SVGContainer>
  );
};

export default SVGTableEditor;
