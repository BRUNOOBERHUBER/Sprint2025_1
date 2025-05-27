import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 font-medium ${isActive ? "text-white bg-primary" : "text-primary-dark hover:bg-primary/10"}`;

  return (
    <nav className="bg-background shadow mb-4">
      <div className="container mx-auto flex">  
        <NavLink to="/alunos" className={linkClasses}>
          ALUNOS
        </NavLink>
        <NavLink to="/contraturno" className={linkClasses}>
          CONTRATURNO
        </NavLink>
      </div>
    </nav>
  );
} 