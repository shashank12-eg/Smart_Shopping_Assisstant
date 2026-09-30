import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatINR, formatDate } from '../utils/formatters';
import { 
  User, 
  Mail, 
  Heart, 
  Bell, 
  History, 
  Eye, 
  Trash2, 
  Search, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('wishlist');
  
  // Tab data states
  const [wishlist, setWishlist] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadProfileData();
  }, [user]);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const [profRes, wishRes, alertRes, searchRes, recentRes] = await Promise.all([
        api.profile.get(),
        api.wishlist.get(),
        api.priceAlerts.get(),
        api.searchHistory.get(),
        api.recentlyViewed.get(),
      ]);

      setProfileData(profRes);
      setWishlist(wishRes.wishlist || []);
      setAlerts(alertRes.price_alerts || []);
      setSearchHistory(searchRes.search_history || []);
      setRecentlyViewed(recentRes.recently_viewed || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (id) => {
    try {
      await api.priceAlerts.delete(id);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSearchItem = async (id) => {
    try {
      await api.searchHistory.delete(id);
      setSearchHistory((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAllSearchHistory = async () => {
    try {
      await api.searchHistory.clear();
      setSearchHistory([]);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 text-sm">Loading user profile &amp; activity history...</p>
      </div>
    );
  }

  const stats = profileData?.stats || { wishlist_count: 0, alerts_count: 0, search_count: 0, recently_viewed_count: 0 };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* USER PROFILE HEADER CARD */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
            <p className="text-xs text-slate-400 flex items-center space-x-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>{user?.email}</span>
            </p>
            <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full mt-2 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>Authenticated SmartShopping Account</span>
            </span>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full sm:w-auto">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block">Wishlist</span>
            <span className="text-lg font-black text-cyan-400">{stats.wishlist_count}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block">Alerts</span>
            <span className="text-lg font-black text-amber-400">{stats.alerts_count}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block">Searches</span>
            <span className="text-lg font-black text-indigo-400">{stats.search_count}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block">Viewed</span>
            <span className="text-lg font-black text-emerald-400">{stats.recently_viewed_count}</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-slate-800 space-x-4 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'wishlist' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishlist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'alerts' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Price Alerts ({alerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('searches')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'searches' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Search History ({searchHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('recently_viewed')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'recently_viewed' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Recently Viewed ({recentlyViewed.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          {wishlist.length === 0 ? (
            <div className="glass-panel p-8 text-center text-xs text-slate-400 rounded-2xl border border-slate-800">
              No saved wishlist products yet. <Link to="/browse" className="text-cyan-400 font-bold hover:underline">Browse Products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlist.map((p) => (
                <div key={p.id} className="glass-card p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="flex items-center space-x-3">
                    <img src={p.image} alt={p.name} className="w-12 h-12 object-contain bg-slate-900 p-1 rounded-lg border border-slate-800" />
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{p.name}</h4>
                      <span className="text-xs font-extrabold text-cyan-400">{formatINR(p.price)}</span>
                    </div>
                  </div>
                  <Link to={`/product/${p.id}`} className="bg-slate-900 hover:bg-slate-800 text-slate-200 text-[11px] font-bold py-2 rounded-lg text-center block border border-slate-800">
                    Analyze Product
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: PRICE ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="glass-panel p-8 text-center text-xs text-slate-400 rounded-2xl border border-slate-800">
              No active price alerts set. Open any product page and set a target price alert in ₹.
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((a) => (
                <div key={a.id} className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <img src={a.image} alt={a.product_name} className="w-12 h-12 object-contain bg-slate-900 p-1 rounded-xl border border-slate-800" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{a.product_name}</h4>
                      <p className="text-[11px] text-slate-400">
                        Current: <strong className="text-white">{formatINR(a.current_price)}</strong> &bull; Target Alert: <strong className="text-amber-400">{formatINR(a.target_price)}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {a.is_reached ? (
                      <span className="inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>TARGET REACHED!</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Monitoring Price</span>
                      </span>
                    )}

                    <button
                      onClick={() => handleDeleteAlert(a.id)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: SEARCH HISTORY */}
      {activeTab === 'searches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Stored search history queries</span>
            {searchHistory.length > 0 && (
              <button onClick={handleClearAllSearchHistory} className="text-xs font-semibold text-rose-400 hover:underline">
                Clear All Search History
              </button>
            )}
          </div>

          {searchHistory.length === 0 ? (
            <div className="glass-panel p-8 text-center text-xs text-slate-400 rounded-2xl border border-slate-800">
              No search history recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80 glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              {searchHistory.map((s) => (
                <div key={s.id} className="p-3.5 flex items-center justify-between hover:bg-slate-900/60 transition-colors text-xs">
                  <div className="flex items-center space-x-3">
                    <Search className="w-4 h-4 text-cyan-400" />
                    <Link to={`/browse?search=${encodeURIComponent(s.search_keyword)}`} className="font-semibold text-white hover:text-cyan-400">
                      "{s.search_keyword}"
                    </Link>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-[11px] text-slate-500">{formatDate(s.searched_at)}</span>
                    <button onClick={() => handleDeleteSearchItem(s.id)} className="text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: RECENTLY VIEWED */}
      {activeTab === 'recently_viewed' && (
        <div className="space-y-4">
          {recentlyViewed.length === 0 ? (
            <div className="glass-panel p-8 text-center text-xs text-slate-400 rounded-2xl border border-slate-800">
              No recently viewed products.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentlyViewed.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="glass-card p-4 rounded-xl border border-slate-800 flex items-center space-x-3 hover:border-cyan-500/40 transition-all group"
                >
                  <img src={p.image} alt={p.name} className="w-12 h-12 object-contain bg-slate-900 p-1 rounded-lg border border-slate-800" />
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 truncate">{p.name}</h4>
                    <span className="text-xs font-extrabold text-cyan-400 block">{formatINR(p.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
