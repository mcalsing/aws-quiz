import React from "react";

const Navbar = () => {
  return (
    <header className="h-16 shadow-md flex items-center text-slate-700 bg-slate-300">
      <nav className="flex justify-evenly items-center w-9/12 mx-auto">
        <a href="/">
          Home
        </a>
      </nav>
    </header>
  );
};

export default Navbar;
