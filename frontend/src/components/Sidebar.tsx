import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Users, LogOut, School, Activity } from "lucide-react";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Activity },
  { title: "Alunos", url: "/alunos", icon: GraduationCap },
  { title: "Contraturno", url: "/contraturno", icon: BookOpen },
  { title: "Colaboradores", url: "/colaboradores", icon: Users },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Não exibe a sidebar na página de login
  if (location.pathname === "/login") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-secondary h-screen flex flex-col">
      <div className="border-b border-secondary bg-primary text-white p-4 flex items-center gap-2">
        <School className="h-6 w-6" />
        <div>
          <h1 className="text-lg font-bold">EMEF Gonzaguinha</h1>
          <p className="text-xs opacity-90">Portfólio Digital</p>
        </div>
      </div>
      <nav className="flex-1 overflow-auto p-4">
        <p className="text-sm font-semibold text-gray-600 mb-2">Menu Principal</p>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.url}
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded ${isActive ? 'bg-primary text-white' : 'text-primary-dark hover:bg-primary/10'}`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-secondary p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-primary-dark hover:bg-primary/10 p-2 rounded w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
} 