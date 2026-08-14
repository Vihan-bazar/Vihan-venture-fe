"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "../../../../lib/api";
import { LogOut, Image as ImageIcon, Tag, AlignLeft, IndianRupee, Type, ArrowLeft, Save, Hash, Ruler } from "lucide-react";
import { motion } from "framer-motion";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function EditProduct() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id;
    
    const [status, setStatus] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(true);
    
    // Updated state for clothing items
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        images: "", 
        stockNumber: "",
    });
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

    useEffect(() => {
        // Security Check
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        // Fetch the specific product to edit
        const fetchProduct = async () => {
            try {
                // Using the new getProductById route we built in Phase 1
                const response = await api.get(`/products/${productId}`);
                const productToEdit = response.data;
                
                if (productToEdit) {
                    setFormData({
                        name: productToEdit.name,
                        description: productToEdit.description,
                        price: productToEdit.price.toString(),
                        category: productToEdit.category,
                        // Convert array of images back to comma-separated string for the textarea
                        images: productToEdit.images ? productToEdit.images.join(", ") : "",
                        stockNumber: productToEdit.stockNumber ? productToEdit.stockNumber.toString() : "0",
                    });
                    setSelectedSizes(productToEdit.sizes || []);
                } else {
                    setStatus({ type: "error", message: "Product not found." });
                }
            } catch (error) {
                console.error("Failed to fetch product");
                setStatus({ type: "error", message: "Failed to load product details." });
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId, router]);

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

        setStatus({ type: "loading", message: "Updating database..." });

        try {
            // Process comma-separated images into a clean array
            const imageArray = formData.images
                .split(',')
                .map(url => url.trim())
                .filter(url => url !== "");

            await api.put(`/products/${productId}`, {
                ...formData,
                price: Number(formData.price),
                stockNumber: Number(formData.stockNumber),
                images: imageArray,
                sizes: selectedSizes
            });

            setStatus({ type: "success", message: "Product successfully updated!" });
            setTimeout(() => {
                router.push('/admin/dashboard'); 
            }, 1500);
        } catch (error) {
            setStatus({ type: "error", message: "Failed to update product. Please try again." });
        }
    };

    // Get the first image for the preview card
    const previewImage = formData.images.split(',')[0]?.trim();

    if (loading) {
        return (
            <div className="flex h-screen bg-[#050505] text-white items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-blue-500">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium">Loading garment data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans relative">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-30"></div>
            
            <main className="flex-1 overflow-y-auto w-full relative z-10">
                <div className="max-w-5xl mx-auto p-6 md:p-8 lg:p-12">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => router.push('/admin/dashboard')}
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Edit Garment</h2>
                                <p className="text-sm text-gray-400 mt-1">Make changes to this item in the catalog.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Left Column: The Form */}
                        <div className="lg:col-span-7 space-y-6">
                            {status.message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl text-sm border backdrop-blur-md ${
                                        status.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
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
                                        <input name="name" type="text" placeholder="Product Name" value={formData.name} onChange={handleChange} required
                                            className="w-full bg-black/50 border border-white/5 text-white rounded-2xl py-3 md:py-4 px-5 focus:outline-none focus:border-blue-500/50 transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative group">
                                            <Tag className="absolute left-4 top-4 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                            <input name="category" type="text" placeholder="Category" value={formData.category} onChange={handleChange} required
                                                className="w-full bg-black/50 border border-white/5 text-white rounded-2xl py-3 md:py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 transition-all"
                                            />
                                        </div>
                                        <div className="relative group">
                                            <IndianRupee className="absolute left-4 top-4 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                            <input name="price" type="number" placeholder="0.00" value={formData.price} onChange={handleChange} required min="0" step="1"
                                                className="w-full bg-black/50 border border-white/5 text-white rounded-2xl py-3 md:py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Inventory & Sizing */}
                                <div className="space-y-4 border-t border-white/5 pt-6">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2"><Ruler size={14}/> Sizing & Stock</label>
                                    
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
                                            className="w-full bg-black/50 border border-white/5 text-white rounded-2xl py-3 md:py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-600"
                                        />
                                    </div>
                                </div>

                                {/* 3. Media & Description */}
                                <div className="space-y-4 border-t border-white/5 pt-6">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2"><ImageIcon size={14}/> Media & Details</label>
                                    <div className="relative group">
                                        <textarea name="images" placeholder="Image URLs (Separate multiple links with a comma)" value={formData.images} onChange={handleChange} required rows={3}
                                            className="w-full bg-black/50 border border-white/5 text-white rounded-2xl py-3 md:py-4 px-5 focus:outline-none focus:border-blue-500/50 transition-all resize-none text-sm leading-relaxed"
                                        />
                                    </div>

                                    <div className="relative group">
                                        <AlignLeft className="absolute left-4 top-4 text-gray-500 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                                        <textarea name="description" placeholder="Product description..." value={formData.description} onChange={handleChange} required rows={4}
                                            className="w-full bg-black/50 border border-white/5 text-white rounded-2xl py-3 md:py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <button type="submit" disabled={status.type === 'loading'}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 text-white font-medium py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] flex justify-center items-center gap-2 mt-4"
                                >
                                    <Save size={20} />
                                    {status.type === 'loading' ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>

                        {/* Right Column: Live Preview Card */}
                        <div className="lg:col-span-5 relative hidden sm:block">
                            <div className="sticky top-6 md:top-12">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 md:mb-6">Updated Storefront Preview</h3>

                                <div className="group relative w-full rounded-3xl bg-white/[0.02] border border-white/10 overflow-hidden backdrop-blur-xl transition-all hover:border-white/20 shadow-2xl">
                                    <div className="aspect-[4/5] bg-black/40 relative overflow-hidden flex items-center justify-center">
                                        {previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                                                onError={(e) => (e.currentTarget.src = "https://placehold.co/600x800/111/333?text=Invalid+Image+URL")}
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

                                    <div className="p-5 md:p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-xl font-bold text-white truncate pr-4">
                                                {formData.name || "Product Title"}
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
                                            {formData.description || "The product description will appear here..."}
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/10 blur-[120px] -z-10 rounded-full pointer-events-none"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}