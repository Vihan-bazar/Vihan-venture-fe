"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Search, Menu, Sparkles, X, Package, Layers } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "../../store/cartStore";

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/store?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", type: "spring", bounce: 0.4 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-200/40 via-purple-200/40 to-blue-200/40 blur-2xl rounded-full -z-10 transition-all duration-700"></div>

      <div className="bg-white/60 backdrop-blur-2xl border border-white/80 p-2 pl-6 pr-2 rounded-full flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-wider text-gray-900 group shrink-0">
          Vihan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Bazar</span>
          <Sparkles size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1 bg-gray-900/5 p-1 rounded-full border border-gray-900/5 shadow-inner">
          <Link href="/" className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-white/80 hover:shadow-sm transition-all">
            Home
          </Link>
          <Link href="/store" className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-white/80 hover:shadow-sm transition-all">
            Store
          </Link>
          <Link href="/track" className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-white/80 hover:shadow-sm transition-all flex items-center gap-1">
             Track Order
          </Link>
          {/* External Subdomain Service Link */}
          <a 
            href="https://services.vihanventure.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-white/80 hover:shadow-sm transition-all flex items-center gap-1"
          >
            Services
          </a>
          <Link href="/contact" className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-white/80 hover:shadow-sm transition-all">
            Contact
          </Link>
        </div>

        {/* Icons, Search & Cart */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Animated Expanding Search */}
          <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'bg-white/80 rounded-full pl-4 shadow-sm border border-gray-200/50' : ''}`}>
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 140, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  onSubmit={handleSearchSubmit}
                  className="overflow-hidden"
                >
                  <input 
                    type="text" 
                    autoFocus
                    placeholder="Search styles..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none text-xs text-gray-900 placeholder-gray-500 focus:outline-none"
                  />
                </motion.form>
              )}
            </AnimatePresence>
            
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all z-10"
              title="Search catalog"
            >
              {isSearchOpen ? <X size={18} strokeWidth={2.5} /> : <Search size={18} strokeWidth={2.5} />}
            </button>
          </div>
          
          {/* Cart Button */}
          <Link href="/cart" className="relative flex items-center gap-2 bg-gray-900 hover:bg-blue-600 text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-lg shadow-gray-900/20 active:scale-95">
            <ShoppingBag size={18} strokeWidth={2.5} />
            <span className="font-bold text-sm border-l border-white/20 pl-2 hidden sm:inline">
              {totalItems > 0 ? `${totalItems} items` : 'Empty'}
            </span>
            {totalItems > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"
              ></motion.span>
            )}
          </Link>
          
          <button className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all">
            <Menu size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
