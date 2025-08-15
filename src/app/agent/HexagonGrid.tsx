import React from "react";

const HexagonGrid: React.FC = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 800 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.18 }}
    aria-hidden="true"
  >
    <defs>
      <pattern id="hex" width="40" height="34.64" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
        <polygon
          points="20,0 40,10 40,30 20,40 0,30 0,10"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="1.2"
          opacity="0.5"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hex)" />
  </svg>
);

export default HexagonGrid;
