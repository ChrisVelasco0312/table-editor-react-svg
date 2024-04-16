import { useEffect, useRef, useState } from "react";

const ContextMenu = ({ options, onSelect, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setIsOpen(true);
    setPosition({ x: event.clientX + 15, y: event.clientY + 100 });
  };

  const handleOptionClick = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  const handleOutsideClick = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div onContextMenu={handleContextMenu}>
      {children}
      {isOpen && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            top: position.y,
            left: position.x,
            backgroundColor: "white",
            border: "1px solid gray",
            padding: "8px",
            zIndex: 1000,
          }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              style={{ cursor: "pointer", padding: "4px" }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContextMenu;
