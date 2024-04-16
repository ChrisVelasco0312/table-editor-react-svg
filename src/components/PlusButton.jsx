const PlusButton = ({ lineType, position, onButtonClick }) => {
  const buttonSize = 20;
  const pinSize = 10;

  const getButtonPosition = () => {
    if (lineType === "vertical") {
      return {
        x: position - buttonSize / 2,
        y: "50%",
        transform: "translateY(-50%)",
      };
    } else {
      return {
        x: "50%",
        y: position - buttonSize / 2,
        transform: "translateX(-50%)",
      };
    }
  };

  const getPinPoints = () => {
    if (lineType === "vertical") {
      return `${position},${buttonSize / 2 + pinSize / 2} ${
        position - pinSize / 2
      },${buttonSize / 2} ${position + pinSize / 2},${buttonSize / 2}`;
    } else {
      return `${buttonSize / 2},${position - pinSize / 2} ${
        buttonSize / 2 + pinSize / 2
      },${position} ${buttonSize / 2},${position + pinSize / 2}`;
    }
  };

  return (
    <>
      <circle
        cx={getButtonPosition().x}
        cy={getButtonPosition().y}
        r={buttonSize / 2}
        fill="white"
        stroke="black"
        strokeWidth="1"
        style={{ cursor: "pointer" }}
        onClick={() => onButtonClick("left")}
      />
      <polygon
        points={getPinPoints()}
        fill="black"
        onClick={() => onButtonClick("left")}
      />
      <line
        x1={position}
        y1={buttonSize / 2}
        x2={position}
        y2={buttonSize / 2 + pinSize}
        stroke="black"
        strokeWidth="1"
      />
      <text
        x={getButtonPosition().x + buttonSize / 4}
        y={getButtonPosition().y + buttonSize / 4}
        fill="black"
        fontSize={buttonSize * 0.6}
        textAnchor="middle"
        dominantBaseline="central"
        onClick={() =>
          onButtonClick(lineType === "vertical" ? "right" : "bottom")
        }
      >
        +
      </text>
    </>
  );
};

export default PlusButton;
