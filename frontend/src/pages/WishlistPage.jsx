import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatINR } from '../utils/formatters';
import { Heart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export default function WishlistPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadWishlist();
  }, [user]);

  const loadWishlist = () => {
    setLoading(true);
    api.wishlist.get()
      .then((res) => {
        setWishlist(res.wishlist || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleRemove = async (productId) => {
    try {
      await api.wishlist.remove(productId);
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 text-center">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 text-sm">Fetching saved wishlist items...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">My Wishlist</h1>
            <p className="text-xs text-slate-400">Products saved for price monitoring ({wishlist.length} items)</p>
          </div>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl text-center space-y-4 border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-slate-500 flex items-center justify-center mx-auto border border-slate-800">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Your wishlist is empty</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You haven't saved any products to your wishlist yet. Browse electronics and click the heart icon to save products here.
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center space-x-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Products</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4 group">
              <div className="relative text-center bg-slate-900/60 p-4 rounded-xl h-48 flex items-center justify-center">
                <img src={product.image} alt={product.name} className="max-h-40 object-contain group-hover:scale-105 transition-transform" />
                <button
                  onClick={() => handleRemove(product.id)}
                  title="Remove from wishlist"
                  className="absolute top-2 right-2 p-2 rounded-full bg-slate-900/80 text-rose-400 hover:bg-rose-500 hover:text-white border border-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">{product.brand}</span>
                <h3 className="font-bold text-white text-sm line-clamp-2">{product.name}</h3>
                <span className="text-lg font-black text-white block">{formatINR(product.price)}</span>
              </div>

              <div className="pt-2">
                <Link
                  to={`/product/${product.id}`}
                  className="w-full flex items-center justify-center space-x-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 font-bold text-xs py-2.5 px-3 rounded-xl transition-all"
                >
                  <span>Analyze Product</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
