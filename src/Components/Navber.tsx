"use client";
import { HomeIcon, Info, LogIn, Package, Users } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
type UserRole = "GUEST" | "CLIENT" | "EMPLOYEE" | "ADMIN";

interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

const Navber = () => {
  const [activeTab, setActiveTab] = useState<string>("home");
  const navLinks = [
    { id: "home", label: "Home", href: "/", icon: HomeIcon },
    { id: "product", label: "Product", href: "/products", icon: Package },
    { id: "employee", label: "Employee", href: "/employees", icon: Users },
    { id: "about", label: "About", href: "/about", icon: Info },
  ];
  return (
    <div className="">
      <div className="max-w-5xl scroll-px-3 mx-auto flex items-center justify-between">
        <div>
          <img
            src="/assats/rokomary-distribution.svg"
            alt="logo"
            className="max-w-30 p-2"
          />
        </div>
        <div>
          <nav className="max-md:hidden flex items-center gap-1 bg-slate-950/50 p-1.5 rounded-full border border-slate-800/60">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setActiveTab(link.id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? "text-white bg-indigo-600 shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
        <div>
          <Link
          href={'/auth/login'}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navber;
