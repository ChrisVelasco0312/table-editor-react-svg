import { forwardRef } from "react";

const SVGContainer = forwardRef(
  (
    { width, height, onMouseMove, onMouseUp, onMouseLeave, onClick, children },
    ref,
  ) => {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        {children}
      </svg>
    );
  },
);

SVGContainer.displayName = "SVGContainer";

export default SVGContainer;
