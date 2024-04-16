import { forwardRef } from "react";

const SVGContainer = forwardRef(
  ({ width, height, onMouseMove, onMouseUp, onMouseLeave, children }, ref) => {
    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </svg>
    );
  },
);

SVGContainer.displayName = "SVGContainer";

export default SVGContainer;
