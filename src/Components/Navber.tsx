"use client";

import { authClient } from "@/app/lib/auth-client";
import {
  ChevronDown,
  HomeIcon,
  LayoutDashboardIcon,
  LogIn,
  LogOut,
  Package,
  Settings,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";

// ============================================================
// Types
// ============================================================

type UserRole = "GUEST" | "RETAILER" | "EMPLOYEE" | "ADMIN";

type NavLink = {
  id: string;
  label: string;
  href: string;
  icon: typeof HomeIcon;
};

// ============================================================
// Navigation Configuration
// ============================================================

const navLinks: NavLink[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    id: "product",
    label: "Product",
    href: "/products",
    icon: Package,
  },
  {
    id: "employee",
    label: "Employee",
    href: "/employees",
    icon: Users,
  },
];

// ============================================================
// Component
// ============================================================

const Navbar = () => {
  // ----------------------------------------------------------
  // State
  // ----------------------------------------------------------

  const [activeTab, setActiveTab] = useState<string>("home");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // ----------------------------------------------------------
  // Authentication
  // ----------------------------------------------------------

  const { data: session, isPending } = authClient.useSession();

  const currentUser = session?.user;
  console.log();

  // ----------------------------------------------------------
  // User Role
  // ----------------------------------------------------------

  const userRole = currentUser?.role as UserRole | undefined;

  const isAdminOrEmployee = userRole === "admin" || userRole === "EMPLOYEE";

  // ----------------------------------------------------------
  // Logout
  // ----------------------------------------------------------

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect("/auth/login");
        },
      },
    });

    setIsDropdownOpen(false);
  };

  // ----------------------------------------------------------
  // Navigation Handler
  // ----------------------------------------------------------

  const handleNavigation = (id: string) => {
    setActiveTab(id);
    setIsDropdownOpen(false);
  };

  // ----------------------------------------------------------
  // Loading
  // ----------------------------------------------------------

  if (isPending) {
    return null;
  }

  // ----------------------------------------------------------
  // UI
  // ----------------------------------------------------------

  return (
    <header className="relative">
      {/* ======================================================
          Desktop / Tablet Navbar
      ====================================================== */}

      <div className="max-w-7xl mx-auto px-3">
        <div className="flex items-center justify-between">
          {/* --------------------------------------------------
              Logo
          -------------------------------------------------- */}

          <div>
            <Link href="/">
              <img
                src="/assats/rokomary-distribution.svg"
                alt="Rokomary Distribution"
                className="max-w-30 p-2"
              />
            </Link>
          </div>

          {/* --------------------------------------------------
              Desktop Navigation
          -------------------------------------------------- */}

          <nav className="max-md:hidden flex items-center gap-1 bg-slate-950/50 p-1.5 rounded-full border border-slate-800/60">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;

              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => handleNavigation(link.id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? "text-white bg-indigo-600 shadow-md shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />

                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* --------------------------------------------------
              User Section
          -------------------------------------------------- */}

          <div>
            {session ? (
              <div className="relative">
                {/* User Button */}

                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-3 p-1.5 pl-3 rounded-full bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                >
                  {/* User Information */}

                  <div className="flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white leading-tight">
                      {currentUser?.name}
                    </span>

                    <span className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider">
                      {currentUser?.role}
                    </span>
                  </div>

                  {/* Avatar */}

                  {currentUser?.image ? (
                    <img
                      src={currentUser?.image}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/50"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs">
                      {currentUser?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Dropdown Icon */}

                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* ==================================================
                    Dropdown Menu
                ================================================== */}

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl py-2 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Account Information */}

                    <div className="px-4 py-2.5 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>

                      <p className="text-sm font-semibold text-slate-200 truncate">
                        {currentUser?.email}
                      </p>
                    </div>

                    {/* ------------------------------------------------
                        Dashboard
                    ------------------------------------------------ */}

                    {isAdminOrEmployee && (
                      <Link
                        href="/dashboard/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-indigo-300 hover:bg-indigo-600/10 hover:text-indigo-200 transition"
                      >
                        <LayoutDashboardIcon className="w-4 h-4 text-indigo-400" />

                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    {/* ------------------------------------------------
                        Profile
                    ------------------------------------------------ */}

                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <User className="w-4 h-4 text-slate-400" />

                      <span>My Profile</span>
                    </Link>

                    {/* ------------------------------------------------
                        Settings
                    ------------------------------------------------ */}

                    <Link
                      href="/settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />

                      <span>Settings</span>
                    </Link>

                    {/* Divider */}

                    <div className="my-1 border-t border-slate-800" />

                    {/* ------------------------------------------------
                        Logout
                    ------------------------------------------------ */}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />

                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ----------------------------------------------------
                 Sign In
              ---------------------------------------------------- */

              <Link
                href="/auth/login"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />

                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================
          Mobile Bottom Navigation
      ====================================================== */}

      <div className="md:hidden">
        <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/90 border-t border-slate-800/80 px-3 py-2">
          <div className="max-w-md mx-auto grid grid-cols-4 gap-1 items-center">
            {/* --------------------------------------------------
                Main Navigation
            -------------------------------------------------- */}

            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;

              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => handleNavigation(link.id)}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "text-indigo-400 bg-indigo-500/10 font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? "scale-110" : ""
                    }`}
                  />

                  <span className="text-[11px] mt-1">{link.label}</span>
                </Link>
              );
            })}

            {/* --------------------------------------------------
                Dashboard / Profile
            -------------------------------------------------- */}

            {isAdminOrEmployee ? (
              <Link
                href="/dashboard/admin"
                onClick={() => handleNavigation("dashboard")}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 ${
                  activeTab === "dashboard"
                    ? "text-indigo-400 bg-indigo-500/10 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <LayoutDashboardIcon
                  className={`w-5 h-5 transition-transform ${
                    activeTab === "dashboard" ? "scale-110" : ""
                  }`}
                />

                <span className="text-[11px] mt-1">Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/profile"
                onClick={() => handleNavigation("profile")}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 ${
                  activeTab === "profile"
                    ? "text-indigo-400 bg-indigo-500/10 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <User
                  className={`w-5 h-5 transition-transform ${
                    activeTab === "profile" ? "scale-110" : ""
                  }`}
                />

                <span className="text-[11px] mt-1">Profile</span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
