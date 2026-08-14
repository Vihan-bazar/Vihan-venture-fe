"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../../components/layout/Navbar";
import api from "../../../../lib/api";
import { useCartStore } from "../../../../store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingBag, Ruler, Check, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    images: string[];
    description: string;
    sizes: string[];
    stockNumber: number;
}

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id;
    const addToCart = useCartStore((state) => state.addToCart);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showSizeError, setShowSizeError] = useState(false);
    const [addedSuccess, setAddedSuccess] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${productId}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Failed to fetch product details");
            } finally {
                setLoading(false);
            }
        };

        if (productId) fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        if (!product) return;
        
        // Enforce size selection for clothing
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            setShowSizeError(true);
            setTimeout(() => setShowSizeError(false), 3000);
            return;
        }

        addToCart(product, selectedSize || undefined);
        
        setAddedSuccess(true);
        setTimeout(() => setAddedSuccess(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F3F2EC] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#F3F2EC] flex flex-col items-center justify-center text-[#111]">
                <h1 className="text-4xl font-black mb-4">Garment Not Found</h1>
                <Link href="/store" className="text-blue-600 font-bold hover:underline">Return to Collection</Link>
            </div>
        );
    }

    // Ensure we have an array of images to display
    const galleryImages = product.images?.length > 0 ? product.images : ["https://placehold.co/600x800/d1d5db/9ca3af?text=Image+Unavailable"];

    return (
        <div className="min-h-screen bg-[#F3F2EC] text-[#111] font-sans relative pb-20 selection:bg-[#111] selection:text-[#F3F2EC] overflow-x-hidden">
            
            {/* Architectural Texture */}
            <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#1111110a_1px,transparent_1px),linear-gradient(to_bottom,#1111110a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none mix-blend-multiply"></div>
            
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 pt-32 relative z-10">
                {/* Back Navigation */}
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[#111]/60 hover:text-[#111] font-bold text-sm uppercase tracking-widest mb-8 transition-colors w-fit"
                >
                    <ArrowLeft size={16} /> Back to Collection
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    
                    {/* Left Side: Image Gallery */}
                    <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4 md:gap-6 h-fit">
                        {/* Main Stage Image */}
                        <div className="flex-1 bg-[#EAE8E3] rounded-[2rem] overflow-hidden relative shadow-[0_8px_30px_rgba(0,0,0,0.04)] aspect-[4/5] md:aspect-auto md:h-[80vh]">
                            <AnimatePresence mode="wait">
                                <motion.img 
                                    key={activeImageIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    src={galleryImages[activeImageIndex]}
                                    alt={`${product.name} view ${activeImageIndex + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </AnimatePresence>
                        </div>

                        {/* Thumbnail Strip */}
                        {galleryImages.length > 1 && (
                            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto scrollbar-none pb-2 md:pb-0 md:w-24 shrink-0">
                                {galleryImages.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`w-20 md:w-full aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImageIndex === idx ? 'border-[#111] shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side: Product Details (Sticky) */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-32 space-y-8">
                            
                            {/* Header Info */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="bg-white/80 backdrop-blur-md border border-[#111]/10 text-[10px] px-3 py-1 rounded-full text-[#111] font-bold uppercase tracking-widest">
                                        {product.category}
                                    </span>
                                    {product.stockNumber > 0 ? (
                                        <span className="text-[10px] text-green-700 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> In Stock
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-red-600 font-bold uppercase tracking-widest">Out of Stock</span>
                                    )}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#111] mb-2 leading-tight">
                                    {product.name}
                                </h1>
                                <p className="text-2xl font-black text-[#111]">
                                    ₹{product.price.toLocaleString('en-IN')}
                                </p>
                            </div>

                            <p className="text-[#111]/70 font-medium leading-relaxed text-base">
                                {product.description}
                            </p>

                            {/* Size Selector */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div className="pt-6 border-t border-[#111]/10">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold tracking-[0.1em] uppercase text-[#111]">Select Size</h3>
                                        <button className="text-xs font-bold text-[#111]/50 hover:text-[#111] flex items-center gap-1 transition-colors underline underline-offset-4">
                                            <Ruler size={14} /> Size Guide
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => {
                                                    setSelectedSize(size);
                                                    setShowSizeError(false);
                                                }}
                                                className={`py-4 rounded-2xl font-bold text-sm border-2 transition-all active:scale-95 ${
                                                    selectedSize === size 
                                                    ? 'bg-[#111] border-[#111] text-white shadow-[0_4px_15px_rgba(17,17,17,0.3)]' 
                                                    : 'bg-[#FAF9F5] border-[#111]/10 text-[#111] hover:border-[#111]/30'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>

                                    <AnimatePresence>
                                        {showSizeError && (
                                            <motion.p 
                                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                                className="text-red-600 text-sm font-bold mt-3 flex items-center gap-1.5"
                                            >
                                                <AlertCircle size={16} /> Please select a size to continue.
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-8">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stockNumber <= 0 || addedSuccess}
                                    className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_10px_30px_rgba(17,17,17,0.15)] active:scale-[0.98] ${
                                        product.stockNumber <= 0 
                                            ? 'bg-[#EAE8E3] text-[#111]/40 cursor-not-allowed shadow-none'
                                            : addedSuccess
                                                ? 'bg-green-600 text-white shadow-[0_10px_30px_rgba(22,163,74,0.3)]'
                                                : 'bg-[#111] hover:bg-blue-600 text-[#F3F2EC]'
                                    }`}
                                >
                                    {product.stockNumber <= 0 ? (
                                        'Sold Out'
                                    ) : addedSuccess ? (
                                        <><Check size={20} /> Added to Cart</>
                                    ) : (
                                        <><ShoppingBag size={20} /> Add to Cart</>
                                    )}
                                </button>
                                
                                {/* Accordion Details (Static design touch) */}
                                <div className="mt-10 space-y-4 border-t border-[#111]/10 pt-6">
                                    {['Material & Care', 'Shipping & Returns'].map((detail) => (
                                        <div key={detail} className="flex justify-between items-center py-2 border-b border-[#111]/5 cursor-pointer group">
                                            <span className="text-sm font-bold uppercase tracking-widest text-[#111]/70 group-hover:text-[#111] transition-colors">{detail}</span>
                                            <ArrowLeft size={16} className="text-[#111]/40 group-hover:text-[#111] rotate-180 transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}