import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  Home, 
  Grid, 
  Heart, 
  Sliders, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <span className="text-2xl font-black text-slate-950">₹</span>
          </div>
          <div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 via-indigo-300 to-white bg-clip-text text-transparent tracking-tight">
              SmartShopping
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-medium tracking-wide uppercase">
              Price Intelligence Platform
            </span>
          </div>
        </Link>

        {/* Navigation Links for Authenticated Users */}
        {user && (
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive('/') ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/browse"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive('/browse') ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Browse All</span>
            </Link>

            <Link
              to="/wishlist"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive('/wishlist') ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </Link>

            <Link
              to="/compare"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive('/compare') ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Compare</span>
            </Link>
          </nav>
        )}

        {/* User Actions Right Side */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <Link
                to="/profile"
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border transition-all ${
                  isActive('/profile')
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-semibold text-white">{user.name}</span>
              </Link>

              <button
                onClick={handleLogout}
                title="Logout"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 text-xs font-medium transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl hover:bg-slate-900 transition-all uppercase tracking-wider"
              >
                LOGIN
              </Link>
              <Link
                to="/signup"
                className="text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all uppercase tracking-wider"
              >
                SIGN UP
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 p-4 space-y-3 animate-fadeIn">
          {user ? (
            <>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900 border border-slate-800 mb-2">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{user.name}</h4>
                  <p className="text-[11px] text-slate-400">{user.email}</p>
                </div>
              </div>
              <Link to="/" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-slate-200">Home</Link>
              <Link to="/browse" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-slate-200">Browse All</Link>
              <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-slate-200">Wishlist</Link>
              <Link to="/compare" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-slate-200">Compare</Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="block py-2 text-sm text-slate-200">My Profile</Link>
              <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="w-full text-left py-2 text-sm text-rose-400 font-semibold">Logout</button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-center w-full py-2.5 text-sm font-semibold text-slate-200 bg-slate-900 rounded-xl">LOGIN</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="block text-center w-full py-2.5 text-sm font-bold text-slate-950 bg-cyan-400 rounded-xl">SIGN UP</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
