// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container flex items-center justify-between py-3">
        <Link to="/companies" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand rounded flex items-center justify-center text-white font-bold">CM</div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold">Company Manager</div>
            <div className="text-xs text-gray-500">Manage your companies</div>
          </div>
        </Link>

        <nav className="items-center gap-3 hidden sm:flex">
          {token ? (
            <>
              <Link to="/add-company" className="btn-ghost">Add Company</Link>
              <button onClick={logout} className="btn">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn">Login</Link>
          )}
        </nav>

        {/* mobile menu button - simple */}
        <div className="sm:hidden">
          {token ? (
            <div className="flex gap-2 items-center">
              <Link to="/add-company" className="text-sm text-brand">Add</Link>
              <button onClick={logout} className="ml-2 px-2 py-1 bg-brand text-white rounded">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="px-2 py-1 bg-brand text-white rounded">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
