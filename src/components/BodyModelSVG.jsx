import React from "react";

const jointCoords = [
  { id: "wrist-left", x: 430, y: 870 },
  { id: "wrist-right", x: 170, y: 870 },
  { id: "elbow-left", x: 410, y: 690 },
  { id: "elbow-right", x: 190, y: 690 },
  { id: "knee-left", x: 370, y: 960 },
  { id: "knee-right", x: 230, y: 960 },
  { id: "ankle-left", x: 360, y: 1120 },
  { id: "ankle-right", x: 240, y: 1120 },
];

const BodyModelSVG = ({ showJoints = true }) => (
  <svg
    viewBox="0 0 600 1200"
    width="100%"
    height="auto"
    style={{ background: "#181512" }}
  >
    {/* PNG background image (replace with your actual PNG path if needed) */}
    <image
      href="/body_map_front_clean.png"
      x="0"
      y="0"
      width="600"
      height="1200"
    />

    {/* Joint markers */}
    {showJoints &&
      jointCoords.map((joint) => (
        <circle
          key={joint.id}
          cx={joint.x}
          cy={joint.y}
          r={10}
          fill="none"
          stroke="#FFD700"
          strokeWidth={3}
        >
          <title>{joint.id}</title>
        </circle>
      ))}
  </svg>
);

export default BodyModelSVG;
