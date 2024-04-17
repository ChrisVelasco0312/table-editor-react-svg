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
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [buttonTimeout, setButtonTimeout] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const svgRef = useRef();

  useEffect(() => {
    setVerticalPositions(verticalLines.map((line) => line.vertices[0].x));
    setHorizontalPositions(horizontalLines.map((line) => line.vertices[0].y));
  }, [verticalLines, horizontalLines]);

  const handleLineMouseDown = (event, lineType, index) => {
    event.preventDefault();
    setDraggedLine({ lineType, index });
    setSelectedLine({ lineType, index });
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

  const handleMouseEnter = (event) => {
    const svgRect = svgRef.current.getBoundingClientRect();
    const offsetX = event.clientX - svgRect.left;
    const offsetY = event.clientY - svgRect.top;

    const edgeThreshold = 10;

    if (offsetY < boundingBox.minY * height + edgeThreshold) {
      setHoveredEdge("top");
      setButtonPosition({
        x: boundingBox.minX * width + (boundingBox.width * width) / 2,
        y: boundingBox.minY * height,
      });
    } else if (offsetX > boundingBox.maxX * width - edgeThreshold) {
      setHoveredEdge("right");
      setButtonPosition({
        x: boundingBox.maxX * width,
        y: boundingBox.minY * height + (boundingBox.height * height) / 2,
      });
    } else if (offsetY > boundingBox.maxY * height - edgeThreshold) {
      setHoveredEdge("bottom");
      setButtonPosition({
        x: boundingBox.minX * width + (boundingBox.width * width) / 2,
        y: boundingBox.maxY * height,
      });
    } else if (offsetX < boundingBox.minX * width + edgeThreshold) {
      setHoveredEdge("left");
      setButtonPosition({
        x: boundingBox.minX * width,
        y: boundingBox.minY * height + (boundingBox.height * height) / 2,
      });
    } else {
      setHoveredEdge(null);
    }

    if (buttonTimeout) {
      clearTimeout(buttonTimeout);
    }
  };

  const handleMouseLeave = () => {
    setButtonTimeout(
      setTimeout(() => {
        setHoveredEdge(null);
      }, 3000),
    );
  };

  const handleSVGClick = (event) => {
    const clickedElement = event.target;
    if (
      clickedElement.tagName !== "line" &&
      clickedElement.tagName !== "circle" &&
      clickedElement.tagName !== "path"
    ) {
      setSelectedLine(null);
    }
  };

  const handleTrashButtonClick = () => {
    if (selectedLine) {
      const { lineType, index } = selectedLine;
      if (lineType === "vertical") {
        const newVerticalLines = verticalLines.filter((_, i) => i !== index);
        setVerticalPositions(
          newVerticalLines.map((line) => line.vertices[0].x),
        );
        onLinesUpdate(newVerticalLines, horizontalLines);
      } else if (lineType === "horizontal") {
        const newHorizontalLines = horizontalLines.filter(
          (_, i) => i !== index,
        );
        setHorizontalPositions(
          newHorizontalLines.map((line) => line.vertices[0].y),
        );
        onLinesUpdate(verticalLines, newHorizontalLines);
      }
      setSelectedLine(null);
    }
  };

  const handleAddLineButtonClick = () => {
    const minSpaceThreshold = 0.01; // Adjust this value as needed

    if (hoveredEdge === "top") {
      const nearestSpace = horizontalPositions
        .filter((position) => position > boundingBox.minY)
        .reduce((nearest, position) => {
          const space = position - boundingBox.minY;
          return space > minSpaceThreshold &&
            (space < nearest || nearest === null)
            ? space
            : nearest;
        }, null);

      if (nearestSpace !== null) {
        const newY = boundingBox.minY + nearestSpace / 2;
        const newLine = {
          vertices: [
            { x: boundingBox.minX, y: newY },
            { x: boundingBox.maxX, y: newY },
          ],
        };
        onLinesUpdate(verticalLines, [...horizontalLines, newLine]);
      }
    } else if (hoveredEdge === "right") {
      const nearestSpace = verticalPositions
        .filter((position) => position < boundingBox.maxX)
        .reduce((nearest, position) => {
          const space = boundingBox.maxX - position;
          return space > minSpaceThreshold &&
            (space < nearest || nearest === null)
            ? space
            : nearest;
        }, null);

      if (nearestSpace !== null) {
        const newX = boundingBox.maxX - nearestSpace / 2;
        const newLine = {
          vertices: [
            { x: newX, y: boundingBox.minY },
            { x: newX, y: boundingBox.maxY },
          ],
        };
        onLinesUpdate([...verticalLines, newLine], horizontalLines);
      }
    } else if (hoveredEdge === "bottom") {
      const nearestSpace = horizontalPositions
        .filter((position) => position < boundingBox.maxY)
        .reduce((nearest, position) => {
          const space = boundingBox.maxY - position;
          return space > minSpaceThreshold &&
            (space < nearest || nearest === null)
            ? space
            : nearest;
        }, null);

      if (nearestSpace !== null) {
        const newY = boundingBox.maxY - nearestSpace / 2;
        const newLine = {
          vertices: [
            { x: boundingBox.minX, y: newY },
            { x: boundingBox.maxX, y: newY },
          ],
        };
        onLinesUpdate(verticalLines, [...horizontalLines, newLine]);
      }
    } else if (hoveredEdge === "left") {
      const nearestSpace = verticalPositions
        .filter((position) => position > boundingBox.minX)
        .reduce((nearest, position) => {
          const space = position - boundingBox.minX;
          return space > minSpaceThreshold &&
            (space < nearest || nearest === null)
            ? space
            : nearest;
        }, null);

      if (nearestSpace !== null) {
        const newX = boundingBox.minX + nearestSpace / 2;
        const newLine = {
          vertices: [
            { x: newX, y: boundingBox.minY },
            { x: newX, y: boundingBox.maxY },
          ],
        };
        onLinesUpdate([...verticalLines, newLine], horizontalLines);
      }
    }
  };

  return (
    <SVGContainer
      width={width}
      height={height}
      ref={svgRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleSVGClick}
    >
      {verticalPositions.map((position, index) => {
        const verticalLine = verticalLines[index];
        if (!verticalLine) return null;
        return (
          <line
            key={`vertical-${index}`}
            x1={position * width}
            y1={verticalLine.vertices[0].y * height}
            x2={position * width}
            y2={verticalLine.vertices[1].y * height}
            stroke={
              selectedLine &&
              selectedLine.lineType === "vertical" &&
              selectedLine.index === index
                ? "rgb(57, 61, 63)"
                : "rgb(198, 197, 185)"
            }
            strokeOpacity={0.5}
            strokeWidth="2"
            onMouseDown={(event) =>
              handleLineMouseDown(event, "vertical", index)
            }
            style={{ cursor: "col-resize" }}
          />
        );
      })}
      {horizontalPositions.map((position, index) => {
        const horizontalLine = horizontalLines[index];
        if (!horizontalLine) return null;
        return (
          <line
            key={`horizontal-${index}`}
            x1={horizontalLine.vertices[0].x * width}
            y1={position * height}
            x2={horizontalLine.vertices[1].x * width}
            y2={position * height}
            stroke={
              selectedLine &&
              selectedLine.lineType === "horizontal" &&
              selectedLine.index === index
                ? "rgb(57, 61, 63)"
                : "rgb(198, 197, 185)"
            }
            strokeOpacity={0.5}
            strokeWidth="2"
            onMouseDown={(event) =>
              handleLineMouseDown(event, "horizontal", index)
            }
            style={{ cursor: "row-resize" }}
          />
        );
      })}

      {/* Render bounding rectangle */}
      <rect
        x={boundingBox.minX * width}
        y={boundingBox.minY * height}
        width={boundingBox.width * width}
        height={boundingBox.height * height}
        fill="none"
        stroke="rgb(198, 197, 185)"
        strokeWidth="4"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      {/* Render attach circle button */}
      {hoveredEdge && (
        <g
          style={{
            cursor: "pointer",
          }}
          onClick={handleAddLineButtonClick}
        >
          <circle
            cx={buttonPosition.x}
            cy={buttonPosition.y}
            r="10"
            fill="rgb(57, 61, 63)"
          />
          <line
            x1={buttonPosition.x - 4}
            y1={buttonPosition.y}
            x2={buttonPosition.x + 4}
            y2={buttonPosition.y}
            stroke="white"
            strokeWidth="2"
          />
          <line
            x1={buttonPosition.x}
            y1={buttonPosition.y - 4}
            x2={buttonPosition.x}
            y2={buttonPosition.y + 4}
            stroke="white"
            strokeWidth="2"
          />
        </g>
      )}

      {/* Render trash button */}
      {selectedLine && (
        <g
          style={{
            cursor: "pointer",
          }}
          onClick={handleTrashButtonClick}
        >
          <circle
            cx={
              selectedLine.lineType === "vertical"
                ? verticalPositions[selectedLine.index] * width
                : horizontalLines[selectedLine.index].vertices[1].x * width
            }
            cy={
              selectedLine.lineType === "horizontal"
                ? horizontalPositions[selectedLine.index] * height
                : verticalLines[selectedLine.index].vertices[1].y * height
            }
            r="10"
            fill="rgb(57, 61, 63)"
          />
          <path
            d="M4.5,4 L7.5,7 M7.5,4 L4.5,7"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            transform={`translate(${
              selectedLine.lineType === "vertical"
                ? verticalPositions[selectedLine.index] * width - 6
                : horizontalLines[selectedLine.index].vertices[1].x * width - 6
            }, ${
              selectedLine.lineType === "horizontal"
                ? horizontalPositions[selectedLine.index] * height - 6
                : verticalLines[selectedLine.index].vertices[1].y * height - 6
            })`}
          />
        </g>
      )}
    </SVGContainer>
  );
};

export default SVGTableEditor;
