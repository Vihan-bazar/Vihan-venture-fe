"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../../components/layout/Navbar";
import api from "../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Search, PackageX, SlidersHorizontal, X, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  images: string[]; // Updated for new clothing schema
  description: string;
  sizes?: string[];
}

type SortOption = 'recent' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

function StoreContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter & Sort State
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (urlQuery) setSearchQuery(urlQuery);
  }, [urlQuery]);

  // Extract unique categories for the filter panel
  const categories = Array.from(new Set(products.map(p => p.category)));

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // 1. Filter Logic
  let processedProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    return matchesSearch && matchesCategory;
  });

  // 2. Sort Logic
  processedProducts.sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'name-asc': return a.name.localeCompare(b.name);
      case 'name-desc': return b.name.localeCompare(a.name);
      case 'recent':
      default:
        // Extract timestamp from MongoDB ObjectId for true "Most Recent" sorting
        return parseInt(b._id.substring(0, 8), 16) - parseInt(a._id.substring(0, 8), 16);
    }
  });

  const activeFiltersCount = selectedCategories.length + (sortBy !== 'recent' ? 1 : 0);

  const FilterPanel = () => (
    <div className="space-y-10">
      {/* Sort Section */}
      <div>
        <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#111]/50 mb-4">Sort By</h3>
        <div className="space-y-3">
          {[
            { id: 'recent', label: 'Most Recent' },
            { id: 'price-asc', label: 'Price: Low to High' },
            { id: 'price-desc', label: 'Price: High to Low' },
            { id: 'name-asc', label: 'Alphabetical: A-Z' },
            { id: 'name-desc', label: 'Alphabetical: Z-A' },
          ].map((option) => (
            <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${sortBy === option.id ? 'border-blue-600' : 'border-[#111]/20 group-hover:border-[#111]/50'}`}>
                {sortBy === option.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
              </div>
              <span className={`text-sm font-bold ${sortBy === option.id ? 'text-[#111]' : 'text-[#111]/60 group-hover:text-[#111]'}`}>
                {option.label}
              </span>
              <input type="radio" className="hidden" checked={sortBy === option.id} onChange={() => setSortBy(option.id as SortOption)} />
            </label>
          ))}
        </div>
      </div>

      {/* Category Section */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#111]/50 mb-4">Categories</h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${selectedCategories.includes(category) ? 'bg-[#111] border-[#111]' : 'border-[#111]/20 bg-transparent group-hover:border-[#111]/50'}`}>
                  {selectedCategories.includes(category) && <Check size={14} className="text-[#F3F2EC]" />}
                </div>
                <span className={`text-sm font-bold ${selectedCategories.includes(category) ? 'text-[#111]' : 'text-[#111]/60 group-hover:text-[#111]'}`}>
                  {category}
                </span>
                <input type="checkbox" className="hidden" checked={selectedCategories.includes(category)} onChange={() => toggleCategory(category)} />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <button 
          onClick={() => { setSortBy('recent'); setSelectedCategories([]); }}
          className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F2EC] text-[#111] font-sans relative pb-20 selection:bg-[#111] selection:text-[#F3F2EC] overflow-x-hidden">
      
      {/* --- DARK TEXTURE ON LIGHT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#1111110a_1px,transparent_1px),linear-gradient(to_bottom,#1111110a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none mix-blend-multiply"></div>
      <div className="fixed top-20 right-1/4 w-[500px] h-[500px] bg-[#111]/5 blur-[150px] -z-20 rounded-full pointer-events-none"></div>

      <Navbar />

      <main className="max-w-[1400px] mx-auto px-6 pt-32 relative z-10">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-[#111]/10 pb-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-[#111]"
            >
              The Collection
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-[#111]/60 text-lg font-medium"
            >
              Browse our complete catalog of premium garments.
            </motion.p>
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 bg-[#FAF9F5] border border-[#111]/10 text-[#111] px-6 py-4 rounded-2xl font-bold shadow-sm"
            >
              <SlidersHorizontal size={18} />
              Filters & Sort {activeFiltersCount > 0 && <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] ml-1">{activeFiltersCount}</span>}
            </button>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="relative w-full sm:w-80 group"
            >
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#111]/40 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search styles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-[#111]/10 text-[#111] placeholder-[#111]/40 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-600 transition-all font-bold shadow-sm"
              />
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Desktop Sidebar Filter Panel */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 bg-[#FAF9F5] border border-[#111]/5 rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md">
              <FilterPanel />
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 text-[#111]/40">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold tracking-widest uppercase text-xs">Loading collection...</p>
              </div>
            ) : processedProducts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 bg-[#FAF9F5] border border-[#111]/5 rounded-[2.5rem] shadow-sm"
              >
                <PackageX size={48} className="mb-4 text-[#111]/20" />
                <p className="text-2xl font-black text-[#111]">No garments found</p>
                <p className="text-[#111]/60 mt-2 font-medium">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedCategories([]); setSortBy('recent'); }}
                  className="mt-6 bg-[#111] text-[#F3F2EC] px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors"
                >
                  Clear Search & Filters
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {processedProducts.map((product, index) => {
                  const primaryImage = product.images?.[0] || "https://placehold.co/600x800/d1d5db/9ca3af?text=Garment";
                  const secondaryImage = product.images?.[1];

                  return (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group relative bg-[#FAF9F5] border border-[#111]/5 p-3 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(17,17,17,0.15)] hover:-translate-y-2 transition-all duration-500 flex flex-col h-full"
                    >
                      {/* Interactive Image Container */}
                      <Link href={`/store/${product._id}`} className="block aspect-[4/5] bg-[#EAE8E3] rounded-[1.5rem] overflow-hidden relative shrink-0">
                        {/* Primary Image */}
                        <img 
                          src={primaryImage} 
                          alt={product.name}
                          className={`w-full h-full object-cover transform transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${secondaryImage ? 'group-hover:opacity-0 absolute inset-0' : 'group-hover:scale-110'}`}
                          onError={(e) => (e.currentTarget.src = "https://placehold.co/600x800/d1d5db/9ca3af?text=Image+Unavailable")}
                        />
                        {/* Secondary Image (Hover State) */}
                        {secondaryImage && (
                          <img 
                            src={secondaryImage} 
                            alt={`${product.name} alternate view`}
                            className="w-full h-full object-cover transform scale-105 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out absolute inset-0 group-hover:scale-100"
                          />
                        )}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-xs px-4 py-2 rounded-full text-[#111] font-bold uppercase tracking-widest shadow-sm">
                          {product.category}
                        </div>
                      </Link>

                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <Link href={`/store/${product._id}`}>
                            <h3 className="text-xl font-bold text-[#111] group-hover:text-blue-600 transition-colors line-clamp-1 pr-4">
                              {product.name}
                            </h3>
                          </Link>
                          <span className="text-lg font-black text-[#111] shrink-0">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        
                        <p className="text-[#111]/60 text-sm line-clamp-2 mt-1 mb-6 flex-grow font-medium leading-relaxed">
                          {product.description}
                        </p>
                        
                        <div className="flex items-center gap-3 mt-auto">
                          <Link 
                            href={`/store/${product._id}`}
                            className="flex-1 py-3.5 rounded-2xl bg-[#111] hover:bg-blue-600 text-[#F3F2EC] font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-md active:scale-95"
                          >
                            Select Size <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-[#111]/40 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-[85vw] max-w-sm h-full bg-[#FAF9F5] z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-[#111]/10 flex justify-between items-center bg-white">
                <h2 className="text-xl font-black text-[#111]">Filters & Sort</h2>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-[#EAE8E3] rounded-full text-[#111]">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <FilterPanel />
              </div>
              <div className="p-6 border-t border-[#111]/10 bg-white">
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full bg-[#111] text-[#F3F2EC] py-4 rounded-2xl font-bold active:scale-95 transition-transform"
                >
                  Show {processedProducts.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Next.js requires components utilizing useSearchParams to be wrapped in a Suspense boundary
export default function StorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F3F2EC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <StoreContent />
    </Suspense>
  );
}