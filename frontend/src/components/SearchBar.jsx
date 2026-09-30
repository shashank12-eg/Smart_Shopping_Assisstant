import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Laptop, Smartphone, Headphones, Watch, Tablet } from 'lucide-react';
import { api } from '../services/api';
import { formatINR } from '../utils/formatters';

export default function SearchBar({ placeholder = "Search laptops, smartphones, headphones, brands or specs..." }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        api.products.getSuggestions(query.trim())
          .then((res) => {
            setSuggestions(res.suggestions || []);
            setIsOpen(true);
          })
          .catch(() => setSuggestions([]));
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/browse?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectSuggestion = (productId) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/product/${productId}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 pointer-events-none">
          <Search className="w-5 h-5 text-cyan-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-cyan-500 rounded-2xl py-4 pl-12 pr-12 text-sm text-white placeholder-slate-400 shadow-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-xl transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setSuggestions([]); setIsOpen(false); }}
            className="absolute right-4 text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 glass-panel rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden z-50 divide-y divide-slate-800">
          <div className="p-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/60">
            Search Suggestions
          </div>
          {suggestions.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectSuggestion(item.id)}
              className="p-3 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded-lg bg-slate-900 p-1 border border-slate-800" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-400">{item.name}</h4>
                  <span className="text-[11px] text-slate-400">{item.brand} &bull; {item.category}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-white block">{formatINR(item.price)}</span>
                <span className="text-[10px] text-cyan-400 flex items-center justify-end gap-1">
                  Analyze <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
