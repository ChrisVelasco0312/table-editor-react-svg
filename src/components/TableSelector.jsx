import { useRef, useState } from "react";
import "./TableSelector.css";

const TableSelector = ({ width, height, onSelectionComplete }) => {
  const svgRef = useRef(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [vertices, setVertices] = useState([]);

  const handleMouseDown = (event) => {
    if (!isSelectionMode) return;
    setIsSelecting(true);
    const { left, top } = svgRef.current.getBoundingClientRect();
    const startX = event.clientX - left;
    const startY = event.clientY - top;
    setSelectionRect({ startX, startY, endX: startX, endY: startY });
  };

  const handleMouseMove = (event) => {
    const { left, top } = svgRef.current.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;
    setMousePosition({ x, y });

    if (!isSelecting) return;
    const endX = Math.min(Math.max(x, 0), width);
    const endY = Math.min(Math.max(y, 0), height);
    setSelectionRect((prevRect) => ({ ...prevRect, endX, endY }));
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    if (selectionRect) {
      const { startX, startY, endX, endY } = selectionRect;
      const vertices = [
        { x: startX / width, y: startY / height },
        { x: endX / width, y: startY / height },
        { x: endX / width, y: endY / height },
        { x: startX / width, y: endY / height },
      ];
      setVertices(vertices);
    }
  };

  const handleClearSelection = () => {
    setSelectionRect(null);
  };

  const handleToggleSelectionMode = () => {
    setIsSelectionMode((prevMode) => !prevMode);
  };

  const renderSelectionOverlay = () => {
    if (!isSelectionMode) return null;

    const overlayPath = `M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} Z`;

    if (!selectionRect) {
      return <path className="selection-overlay" d={overlayPath} />;
    }

    const { startX, startY, endX, endY } = selectionRect;
    const minX = Math.min(startX, endX);
    const maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY);
    const maxY = Math.max(startY, endY);

    const clipPath = `M 0 0 L ${width} 0 L ${width} ${height} L 0 ${height} Z M ${minX} ${minY} L ${maxX} ${minY} L ${maxX} ${maxY} L ${minX} ${maxY} Z`;

    return (
      <g>
        <path className="selection-overlay" d={clipPath} />
        <rect
          className="selection-rect"
          x={minX}
          y={minY}
          width={maxX - minX}
          height={maxY - minY}
        />
      </g>
    );
  };

  const renderCustomCursor = () => {
    if (!isSelectionMode) return null;

    const { x, y } = mousePosition;
    const cursorSize = 10;

    return (
      <g>
        <line
          x1={x - cursorSize}
          y1={y}
          x2={x + cursorSize}
          y2={y}
          stroke="black"
          strokeWidth="1"
        />
        <line
          x1={x}
          y1={y - cursorSize}
          x2={x}
          y2={y + cursorSize}
          stroke="black"
          strokeWidth="1"
        />
      </g>
    );
  };

  return (
    <>
      <svg
        ref={svgRef}
        className="selection-container"
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {renderSelectionOverlay()}
        {renderCustomCursor()}
      </svg>
      <button onClick={handleClearSelection}>Clear Selection</button>
      <button onClick={handleToggleSelectionMode}>
        {isSelectionMode ? "Disable Selection" : "Enable Selection"}
      </button>
      <button onClick={() => onSelectionComplete(vertices)}>
        Complete Selection
      </button>
    </>
  );
};

export default TableSelector;
