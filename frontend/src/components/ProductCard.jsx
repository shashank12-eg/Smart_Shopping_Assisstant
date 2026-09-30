import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatINR } from '../utils/formatters';
import { Heart, Star, Sliders, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function ProductCard({ product, onWishlistToggle, onCompareToggle, isCompared }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (product.is_wishlisted) {
        await api.wishlist.remove(product.id);
      } else {
        await api.wishlist.add(product.id);
      }
      if (onWishlistToggle) onWishlistToggle(product.id, !product.is_wishlisted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCompareToggle) onCompareToggle(product);
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group relative border border-slate-800 hover:border-cyan-500/40">
      <div className="relative p-5 bg-slate-900/60 text-center flex items-center justify-center h-52 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="max-h-44 object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span className="text-[11px] font-semibold bg-slate-900/80 text-cyan-400 border border-slate-700 px-2.5 py-0.5 rounded-full backdrop-blur-md">
            {product.category}
          </span>
        </div>

        <button 
          onClick={handleWishlist}
          title={product.is_wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all border ${
            product.is_wishlisted 
              ? 'bg-rose-500/20 text-rose-500 border-rose-500/40' 
              : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${product.is_wishlisted ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-300 uppercase tracking-wider">{product.brand}</span>
            <div className="flex items-center space-x-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-white">{product.rating}</span>
            </div>
          </div>

          <h3 className="font-bold text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-2 text-base leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 font-normal">
            {product.processor || product.display || product.driver || product.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-500 block">Current Price</span>
              <span className="text-xl font-extrabold text-white tracking-tight">
                {formatINR(product.price)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              to={`/product/${product.id}`}
              className="w-full flex items-center justify-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs py-2.5 px-3 rounded-xl transition-all shadow-md shadow-cyan-500/10"
            >
              <span>Analyze</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleCompare}
              className={`w-full flex items-center justify-center space-x-1.5 text-xs py-2.5 px-3 rounded-xl font-medium border transition-all ${
                isCompared
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                  : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
