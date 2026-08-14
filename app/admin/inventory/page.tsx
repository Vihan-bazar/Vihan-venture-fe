"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import { PackagePlus, LogOut, Image as ImageIcon, Tag, AlignLeft, IndianRupee, Type, LayoutDashboard, ShoppingBag, Hash, Ruler } from "lucide-react";
import { motion } from "framer-motion";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function Inventory() {
    const router = useRouter();
    const [status, setStatus] = useState({ type: "", message: "" });
    
    // Updated state for clothing items
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        images: "", // Will be converted to array on submit
        stockNumber: "",
    });
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    useEffect(() => {
        // SECURITY CHECK: Verify admin is logged in
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleSize = (size: string) => {
        setSelectedSizes(prev => 
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (selectedSizes.length === 0) {
            setStatus({ type: "error", message: "Please select at least one clothing size." });
            return;
        }

        setStatus({ type: "loading", message: "Pushing to database..." });

        try {
            // Process comma-separated images into a clean array
            const imageArray = formData.images
                .split(',')
                .map(url => url.trim())
                .filter(url => url !== "");

            await api.post("/products", {
                ...formData,
                price: Number(formData.price),
                stockNumber: Number(formData.stockNumber),
                images: imageArray,
                sizes: selectedSizes
            });

            setStatus({ type: "success", message: "Clothing item successfully added!" });
            setFormData({ name: "", description: "", price: "", category: "", images: "", stockNumber: "" });
            setSelectedSizes([]);
            setTimeout(() => setStatus({ type: "", message: "" }), 3000);
        } catch (error) {
            setStatus({ type: "error", message: "Failed to add product. Please try again." });
        }
    };

    // Get the first image for the preview card
    const previewImage = formData.images.split(',')[0]?.trim();

    return (
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans relative">

            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-30"></div>

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
                        <button onClick={() => router.push('/admin/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <LayoutDashboard size={18} />
                            <span className="font-medium text-sm">Dashboard</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-xl transition-all border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                            <PackagePlus size={18} />
                            <span className="font-medium text-sm">Add Inventory</span>
                        </button>
                        <button onClick={() => router.push('/admin/orders')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <ShoppingBag size={18} />
                            <span className="font-medium text-sm">Manage Orders</span>
                        </button>
                    </nav>
                </div>

                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                    <LogOut size={18} />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto w-full relative z-10">
                <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-12">

                    {/* Mobile Header */}
                    <header className="mb-8 flex justify-between items-center md:hidden">
                        <h1 className="text-xl font-bold">Vihan <span className="text-blue-500">Venture</span></h1>
                        <button onClick={handleLogout} className="text-gray-400 hover:text-white"><LogOut size={20} /></button>
                    </header>

                    <div className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Add Clothing Item</h2>
                        <p className="text-sm md:text-base text-gray-400 mt-2">Upload a new garment to the Vihan Venture catalog.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                        {/* Left Column: The Form */}
                        <div className="lg:col-span-7 space-y-6">
                            {status.message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl text-sm border backdrop-blur-md ${status.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                                        status.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                                            'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                        }`}
                                >
                                    {status.message}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8">

                                {/* 1. Basic Details */}
                                <div className="space-y-4">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2"><Type size={14}/> Garment Details</label>
                                    <div className="relative group">
                                        <input name="name" type="text" placeholder="Product Name (e.g. Classic Oxford Shirt)" value={formData.name} onChange={handleChange} required
                                            className="w-full bg-black/50 border border-white/5 text-white rounded-2xl py-3 md:py-4 px-5 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative group">
                                            <Tag className="absolute left-4 top-4 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                            <input name="category" type="text" placeholder="Category (e.g. Shirts)" value={formData.category} onChange={handleChange} required
                                                className="w-full bg-black/50 border border-white/5 text-white rounded-2xl py-3 md:py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                                            />
                                        </div>
                                        <div className="relative group">
                                            <IndianRupee className="absolute left-4 top-4 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                            <input name="price" type="number" placeholder="Price (₹)" value={formData.price} onChange={handleChange} required min="0" step="1"
                                                className="w-full bg-black/50 border border-white/5 text-white rounded-2xl py-3 md:py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Inventory & Sizing (NEW) */}
                                <div className="space-y-4 border-t border-white/5 pt-6">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2"><Ruler size={14}/> Sizing & Stock</label>
                                    
                                    {/* Size Selector Grid */}
                                    <div className="flex flex-wrap gap-3">
                                        {AVAILABLE_SIZES.map(size => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => toggleSize(size)}
                                                className={`w-12 h-12 rounded-xl font-bold text-sm border transition-all ${
                                                    selectedSizes.includes(size) 
                                                    ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                                                    : 'bg-black/50 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative group mt-4">
                                        <Hash className="absolute left-4 top-4 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                        <input name="stockNumber" type="number" placeholder="Total Units in Stock" value={formData.stockNumber} onChange={handleChange} required min="0" step="1"
                                            className="w-full bg-black/50 border border-white/5 text-white rounded-2xl py-3 md:py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                                        />
                                    </div>
                                </div>

                                {/* 3. Media & Description */}
                                <div className="space-y-4 border-t border-white/5 pt-6">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2"><ImageIcon size={14}/> Media & Details</label>
                                    
                                    <div className="relative group">
                                        <textarea name="images" placeholder="Image URLs (Separate multiple links with a comma)" value={formData.images} onChange={handleChange} required rows={3}
                                            className="w-full bg-black/50 border border-white/5 text-white rounded-2xl py-3 md:py-4 px-5 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600 resize-none text-sm leading-relaxed"
                                        />
                                        <p className="text-xs text-gray-500 mt-2 ml-1">Paste up to 5 URLs for gallery display.</p>
                                    </div>

                                    <div className="relative group">
                                        <AlignLeft className="absolute left-4 top-4 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                        <textarea name="description" placeholder="Write a compelling product description detailing fabric, fit, and care..." value={formData.description} onChange={handleChange} required rows={4}
                                            className="w-full bg-black/50 border border-white/5 text-white rounded-2xl py-3 md:py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none placeholder:text-gray-600"
                                        />
                                    </div>
                                </div>

                                <button type="submit" disabled={status.type === 'loading'}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 text-white font-medium py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] flex justify-center items-center gap-2 mt-4"
                                >
                                    <PackagePlus size={20} />
                                    {status.type === 'loading' ? 'Processing...' : 'Publish to Storefront'}
                                </button>
                            </form>
                        </div>

                        {/* Right Column: Live Preview Card */}
                        <div className="lg:col-span-5 relative hidden sm:block">
                            <div className="sticky top-6 md:top-12">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 md:mb-6">Storefront Card Preview</h3>

                                <div className="group relative w-full rounded-3xl bg-white/[0.02] border border-white/10 overflow-hidden backdrop-blur-xl transition-all hover:border-white/20 shadow-2xl">
                                    {/* Image Box */}
                                    <div className="aspect-[4/5] bg-black/40 relative overflow-hidden flex items-center justify-center">
                                        {previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                                                onError={(e) => (e.currentTarget.src = "https://placehold.co/600x800/111/333?text=Invalid+URL")}
                                            />
                                        ) : (
                                            <ImageIcon className="w-16 h-16 text-white/10" />
                                        )}

                                        {formData.category && (
                                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-xs px-3 py-1.5 rounded-full text-gray-300">
                                                {formData.category}
                                            </div>
                                        )}
                                    </div>

                                    {/* Details Box */}
                                    <div className="p-5 md:p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-xl font-bold text-white truncate pr-4">
                                                {formData.name || "Garment Title"}
                                            </h4>
                                            <span className="text-xl font-semibold text-blue-400">
                                                ₹{formData.price || "0"}
                                            </span>
                                        </div>
                                        
                                        {/* Sizing Preview */}
                                        <div className="flex gap-1.5 mb-4 mt-3">
                                            {selectedSizes.length > 0 ? selectedSizes.map(s => (
                                                <span key={s} className="px-2 py-0.5 border border-white/10 bg-white/5 text-[10px] text-gray-300 rounded font-semibold">{s}</span>
                                            )) : (
                                                <span className="px-2 py-0.5 border border-white/5 bg-transparent text-[10px] text-gray-500 rounded border-dashed">No sizes selected</span>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                            {formData.description || "The product description will appear here on the public storefront. Type to see it update live."}
                                        </p>
                                    </div>
                                </div>

                                {/* Decorative glow behind the preview card */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/10 blur-[120px] -z-10 rounded-full pointer-events-none"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}