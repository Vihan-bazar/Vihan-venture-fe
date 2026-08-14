"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import { PackagePlus, LogOut, LayoutDashboard, Search, TrendingUp, Box, Edit, Trash2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

// Upgraded interface to match the new clothing database schema
interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  stockNumber: number; // Replaced inStock boolean
  sizes: string[];
  images: string[];
}

export default function Dashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // SECURITY CHECK: Verify admin is logged in
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return; 
    }

    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this product?")) return;
    
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Failed to delete product");
      alert("Error deleting product. Please try again.");
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = products.reduce((acc, product) => acc + product.price, 0);

  return (
    <div className="flex h-screen bg-[#02040a] text-white overflow-hidden font-sans relative">
      
      {/* Subtle Premium Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-30"></div>
      
      {/* Animated Ambient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-indigo-600/10 rounded-full blur-[130px]"
        />
      </div>

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-md p-6 hidden md:flex flex-col justify-between z-10 shrink-0">
        <div>
          <div className="mb-12">
            <h1 className="text-2xl font-bold tracking-wider">
              Vihan <span className="text-blue-500">Venture</span>
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Workspace</p>
          </div>
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-xl transition-all border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <LayoutDashboard size={18} />
              <span className="font-medium text-sm">Dashboard</span>
            </button>
            <button 
              onClick={() => router.push('/admin/inventory')}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <PackagePlus size={18} />
              <span className="font-medium text-sm">Add Inventory</span>
            </button>
            {/* New Orders Link */}
            <button 
              onClick={() => router.push('/admin/orders')}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <ShoppingBag size={18} />
              <span className="font-medium text-sm">Manage Orders</span>
            </button>
          </nav>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10 w-full">
        <div className="max-w-6xl mx-auto p-6 md:p-8 lg:p-12">
          
          {/* Mobile Header */}
          <header className="mb-8 flex justify-between items-center md:hidden">
             <h1 className="text-xl font-bold">Vihan <span className="text-blue-500">Venture</span></h1>
             <button onClick={handleLogout} className="text-gray-400 hover:text-white"><LogOut size={20} /></button>
          </header>

          {/* Header & Search */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Active Inventory</h2>
              <p className="text-sm md:text-base text-gray-400 mt-2">Manage your live clothing products on the storefront.</p>
            </div>
            
            <div className="relative group w-full lg:w-80">
              <Search className="absolute left-4 top-4 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search database..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-white/5 text-white rounded-2xl py-3 md:py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600 text-sm shadow-inner"
              />
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 md:p-6 backdrop-blur-2xl shadow-xl flex items-center gap-4 md:gap-5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-3 md:p-4 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20 relative z-10">
                <Box size={20} className="md:w-6 md:h-6" />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Styles</p>
                <p className="text-2xl md:text-3xl font-semibold text-white">{products.length}</p>
              </div>
            </div>
            
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 md:p-6 backdrop-blur-2xl shadow-xl flex items-center gap-4 md:gap-5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-3 md:p-4 bg-green-500/10 rounded-2xl text-green-400 border border-green-500/20 relative z-10">
                <TrendingUp size={20} className="md:w-6 md:h-6" />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Catalog Value</p>
                <p className="text-2xl md:text-3xl font-semibold text-white">₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>

          {/* Glassmorphic Data Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl relative w-full"
          >
            <div className="overflow-x-auto relative z-10 w-full scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-black/20 border-b border-white/5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="p-4 md:p-6">Product Name</th>
                    <th className="p-4 md:p-6">Category</th>
                    <th className="p-4 md:p-6">Price</th>
                    <th className="p-4 md:p-6">Stock Level</th>
                    <th className="p-4 md:p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-500">
                        <div className="flex justify-center items-center gap-3">
                           <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                           Syncing with database...
                        </div>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-500 font-medium">No products found matching your search.</td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-white/[0.04] transition-colors group">
                        <td className="p-4 md:p-6 font-medium text-gray-200 group-hover:text-white transition-colors">{product.name}</td>
                        <td className="p-4 md:p-6">
                          <span className="px-3 py-1.5 rounded-lg bg-black/50 border border-white/5 text-xs text-gray-400 font-medium shadow-inner whitespace-nowrap">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-4 md:p-6 font-semibold text-blue-400 whitespace-nowrap">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td className="p-4 md:p-6">
                          {product.stockNumber > 0 ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400/90 text-[11px] md:text-xs font-medium whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></span>
                              {product.stockNumber} in stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400/90 text-[11px] md:text-xs font-medium whitespace-nowrap">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                              Out of Stock
                            </span>
                          )}
                        </td>
                        <td className="p-4 md:p-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => router.push(`/admin/edit/${product._id}`)}
                              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                              title="Edit Product"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(product._id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Delete Product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
          
        </div>
      </main>
    </div>
  );
}