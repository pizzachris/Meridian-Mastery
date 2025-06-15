import React from "react";

const InfoBox = ({ title, children, highlight = false }) => (
  <div
    className={`border-2 rounded-lg p-3 mb-3 ${highlight ? "border-gold bg-black" : "border-gold bg-black"} shadow-md`}
    style={{ borderColor: "#FFD700", background: "#181512" }}
  >
    {title && (
      <div
        className={`font-bold mb-1 ${highlight ? "text-gold" : "text-gold"} text-xs uppercase tracking-wide`}
      >
        {title}
      </div>
    )}
    <div className="text-white text-sm leading-snug">{children}</div>
  </div>
);

export default InfoBox;
