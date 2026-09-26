"use client"
import React, { useState } from 'react';
import { 
  Home, 
  Package, 
  Users, 
  Info, 
  User, 
  LayoutDashboard, 
  LogIn, 
  LogOut, 
  Settings, 
  Building2, 
  ChevronDown,
  Sparkles,
  Smartphone,
  Monitor
} from 'lucide-react';

type UserRole = 'GUEST' | 'CLIENT' | 'EMPLOYEE' | 'ADMIN';

interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export default function App() {
  // Navigation active state
  const [activeTab, setActiveTab] = useState<string>('home');
  
  // Auth state simulator (for preview & testing)
  const [role, setRole] = useState<UserRole>('ADMIN');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'auto'>('auto');

  // Simulated User Data based on selected role
  const getUserData = (): UserProfile | null => {
    if (role === 'GUEST') return null;
    if (role === 'CLIENT') {
      return {
        name: 'Rahim Store',
        email: 'rahim@retailer.com',
        role: 'CLIENT',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      };
    }
    return {
      name: 'Tanvir Hossain',
      email: 'tanvir@distrohub.com',
      role: role,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
    };
  };

  const currentUser = getUserData();
  const isAdminOrEmployee = role === 'ADMIN' || role === 'EMPLOYEE';

  const navLinks = [
    { id: 'home', label: 'Home', href: '#home', icon: Home },
    { id: 'product', label: 'Product', href: '#product', icon: Package },
    { id: 'employee', label: 'Employee', href: '#employee', icon: Users },
    { id: 'about', label: 'About', href: '#about', icon: Info },
  ];

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    setRole('GUEST');
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {}
      <div className="bg-slate-900/80 border-b border-slate-800 p-3 px-4 sm:px-8 text-xs flex flex-wrap items-center justify-between gap-3 z-50">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-300">Navbar State Simulator:</span>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400">Auth Status:</span>
          <button
            onClick={() => handleLogin('GUEST')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              role === 'GUEST' 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-medium' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Logged Out
          </button>
          <button
            onClick={() => handleLogin('CLIENT')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              role === 'CLIENT' 
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-medium' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Client Login
          </button>
          <button
            onClick={() => handleLogin('EMPLOYEE')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              role === 'EMPLOYEE' 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Employee
          </button>
          <button
            onClick={() => handleLogin('ADMIN')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              role === 'ADMIN' 
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-medium' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Admin Login
          </button>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setPreviewMode('auto')}
            className={`px-2 py-0.5 rounded text-[11px] transition ${
              previewMode === 'auto' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Responsive
          </button>
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition ${
              previewMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3 h-3" /> Desktop
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition ${
              previewMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3 h-3" /> Mobile
          </button>
        </div>
      </div>

      {}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        previewMode === 'mobile' ? 'max-w-md mx-auto my-4 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl min-h-[680px] bg-slate-900 relative' : 'w-full'
      }`}>

        {}
        <header 
          className={`sticky top-0 z-40 w-full backdrop-blur-md bg-slate-900/75 border-b border-slate-800/80 transition-all ${
            previewMode === 'mobile' ? 'hidden' : 'hidden md:block'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-3">
              <a href="#home" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1">
                    Distro<span className="text-indigo-400">Hub</span>
                  </span>
                  <span className="text-[10px] text-slate-400 -mt-1 font-medium tracking-wider">
                    DISTRIBUTION HOUSE
                  </span>
                </div>
              </a>
            </div>

            {/* Middle: Navigation Links */}
            <nav className="flex items-center gap-1 bg-slate-950/50 p-1.5 rounded-full border border-slate-800/60">
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
                        ? 'text-white bg-indigo-600 shadow-md shadow-indigo-600/30' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </nav>

            {/* Right: Auth Actions or Profile Dropdown */}
            <div className="flex items-center gap-3">
              {currentUser ? (
                /* Profile Dropdown Menu (Logged In) */
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 p-1.5 pl-3 rounded-full bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  >
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white leading-tight">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider">
                        {currentUser.role}
                      </span>
                    </div>
                    {currentUser.avatarUrl ? (
                      <img 
                        src={currentUser.avatarUrl} 
                        alt={currentUser.name} 
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/50"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs">
                        {currentUser.name.charAt(0)}
                      </div>
                    )}
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu Popup */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl py-2 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2.5 border-b border-slate-800">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-200 truncate">{currentUser.email}</p>
                      </div>

                      {isAdminOrEmployee && (
                        <a
                          href="#dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-indigo-300 hover:bg-indigo-600/10 hover:text-indigo-200 transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                          <span>Admin Dashboard</span>
                        </a>
                      )}

                      <a
                        href="#profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>My Profile</span>
                      </a>

                      <a
                        href="#settings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Settings</span>
                      </a>

                      <div className="my-1 border-t border-slate-800" />

                      <button
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
                /* Login Button (Logged Out) */
                <button
                  onClick={() => handleLogin('CLIENT')}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

          </div>
        </header>

        {}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 flex flex-col items-center justify-center text-center my-8">
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 mb-4 inline-flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Active View: <strong className="capitalize">{activeTab}</strong></span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4 max-w-2xl">
            Modern Distribution House Management Platform
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mb-8 leading-relaxed">
            Experience seamless stock distribution, order management, real-time inventory tracking, and client portals in one unified ecosystem.
          </p>

          {/* Quick Mock Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl text-left">
              <span className="text-xs text-slate-400 font-medium">Total Orders</span>
              <p className="text-2xl font-bold text-white mt-1">1,248</p>
              <span className="text-[11px] text-emerald-400 font-medium mt-2 inline-block">↑ +14% this week</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl text-left">
              <span className="text-xs text-slate-400 font-medium">In Stock SKUs</span>
              <p className="text-2xl font-bold text-white mt-1">8,420</p>
              <span className="text-[11px] text-slate-400 font-medium mt-2 inline-block">Across 12 Warehouses</span>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl text-left">
              <span className="text-xs text-slate-400 font-medium">Active Retailers</span>
              <p className="text-2xl font-bold text-white mt-1">452</p>
              <span className="text-[11px] text-indigo-400 font-medium mt-2 inline-block">Connected stores</span>
            </div>
          </div>
        </main>

        {}
        <nav 
          className={`fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/90 border-t border-slate-800/80 px-3 py-2 transition-all ${
            previewMode === 'desktop' ? 'hidden' : 'block md:hidden'
          }`}
        >
          <div className="max-w-md mx-auto grid grid-cols-4 gap-1 items-center">
            
            {/* 1. Home Tab */}
            <a
              href="#home"
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 ${
                activeTab === 'home' 
                  ? 'text-indigo-400 bg-indigo-500/10 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Home className={`w-5 h-5 transition-transform ${activeTab === 'home' ? 'scale-110' : ''}`} />
              <span className="text-[11px] mt-1">Home</span>
            </a>

            {/* 2. Product Tab */}
            <a
              href="#product"
              onClick={() => setActiveTab('product')}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 ${
                activeTab === 'product' 
                  ? 'text-indigo-400 bg-indigo-500/10 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className={`w-5 h-5 transition-transform ${activeTab === 'product' ? 'scale-110' : ''}`} />
              <span className="text-[11px] mt-1">Product</span>
            </a>

            {/* 3. Employee / Staff Tab */}
            <a
              href="#employee"
              onClick={() => setActiveTab('employee')}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 ${
                activeTab === 'employee' 
                  ? 'text-indigo-400 bg-indigo-500/10 font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className={`w-5 h-5 transition-transform ${activeTab === 'employee' ? 'scale-110' : ''}`} />
              <span className="text-[11px] mt-1">Employee</span>
            </a>

            {/* 4. Dynamic Profile or Dashboard Link based on Role & Auth */}
            {currentUser ? (
              isAdminOrEmployee ? (
                /* Dynamic Dashboard Option for Employee/Admin */
                <a
                  href="#dashboard"
                  onClick={() => setActiveTab('dashboard')}
                  className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 ${
                    activeTab === 'dashboard' 
                      ? 'text-amber-400 bg-amber-500/10 font-semibold' 
                      : 'text-amber-400/80 hover:text-amber-300'
                  }`}
                >
                  <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <LayoutDashboard className={`w-5 h-5 transition-transform ${activeTab === 'dashboard' ? 'scale-110' : ''}`} />
                  <span className="text-[11px] mt-1">Dashboard</span>
                </a>
              ) : (
                /* Regular Profile Option for Logged-In Client */
                <a
                  href="#profile"
                  onClick={() => setActiveTab('profile')}
                  className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 ${
                    activeTab === 'profile' 
                      ? 'text-indigo-400 bg-indigo-500/10 font-semibold' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <User className={`w-5 h-5 transition-transform ${activeTab === 'profile' ? 'scale-110' : ''}`} />
                  <span className="text-[11px] mt-1">Profile</span>
                </a>
              )
            ) : (
              /* Login Link for Guest Users */
              <button
                onClick={() => handleLogin('CLIENT')}
                className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-slate-400 hover:text-indigo-400 transition-all duration-200"
              >
                <LogIn className="w-5 h-5" />
                <span className="text-[11px] mt-1">Login</span>
              </button>
            )}

          </div>
        </nav>

      </div>
    </div>
  );
}