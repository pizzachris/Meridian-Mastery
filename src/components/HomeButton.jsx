import React from "react";
import Logo from "./Logo";

const HomeButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center px-4 py-2 mb-4 bg-dark border-2 border-gold text-gold font-bold rounded-lg shadow hover:bg-gold hover:text-deepred transition"
    aria-label="Go to Home"
  >
    <div className="w-6 h-6 mr-2">
      <Logo />
    </div>
    Home
  </button>
);

export default HomeButton;
