"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import api from "../../lib/api";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, MoveRight } from "lucide-react";
import Link from "next/link";

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    images: string[];
    description: string;
    sizes?: string[];
}

export default function Storefront() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 500], [0, 150]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");
                setFeaturedProducts(response.data.slice(0, 3));
            } catch (error) {
                console.error("Failed to load products");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-[#F3F2EC] text-[#111] font-sans selection:bg-[#111] selection:text-[#F3F2EC] overflow-hidden">
            <Navbar />

            {/* --- ARCHITECTURAL BACKGROUND TEXTURE --- */}
            <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#11111105_1px,transparent_1px),linear-gradient(to_bottom,#11111105_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none mix-blend-multiply"></div>

            {/* --- HERO EDITORIAL SECTION --- */}
            <main className="relative z-10 pt-32 lg:pt-40 pb-20 px-6 max-w-[1400px] mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    
                    {/* Left: Typography & Call to Action */}
                    <div className="flex-1 w-full flex flex-col justify-center items-start z-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#111]/20 mb-8"
                        >
                            <Sparkles size={14} className="text-[#111]" />
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#111]">Autumn / Winter '26</span>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-[7rem] font-black tracking-tighter leading-[0.9] text-[#111] uppercase mb-8"
                        >
                            Modern <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#111] to-[#111]/50 italic pr-4">
                                Elegance.
                            </span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-lg md:text-xl text-[#111]/70 font-medium mb-12 max-w-lg leading-relaxed"
                        >
                            Redefining the everyday wardrobe. Discover our exclusive collection of premium garments tailored for uncompromising style.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <Link href="/store" className="group flex items-center gap-6 bg-[#111] text-[#F3F2EC] px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-600 transition-all duration-500 shadow-[0_12px_30px_rgba(17,17,17,0.2)] active:scale-95">
                                Explore Collection
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-2 transition-transform duration-500">
                                    <MoveRight size={18} />
                                </div>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right: Editorial Image (Parallax) */}
                    <div className="flex-1 w-full h-[60vh] lg:h-[80vh] relative rounded-t-full lg:rounded-t-[20rem] rounded-b-[3rem] overflow-hidden shadow-2xl border border-[#111]/5">
                        <motion.img 
                            style={{ y: heroY }}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            // High-end fashion placeholder image
                            src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop" 
                            alt="Fashion Editorial"
                            className="absolute inset-0 w-full h-[130%] object-cover object-center -top-[15%]"
                        />
                        {/* Inner shadow for depth */}
                        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.1)] pointer-events-none rounded-t-full lg:rounded-t-[20rem] rounded-b-[3rem]"></div>
                    </div>
                </div>
            </main>

            {/* --- ENDLESS MARQUEE --- */}
            <div className="w-full overflow-hidden border-y border-[#111]/10 py-5 bg-[#EAE8E3]/50 backdrop-blur-sm relative flex whitespace-nowrap mt-10">
                <div className="animate-marquee flex gap-16 text-[#111]/50 font-black tracking-[0.3em] text-xs uppercase">
                    <span>Premium Fabrics</span><span>•</span>
                    <span>Designed in Studio</span><span>•</span>
                    <span>Global Shipping</span><span>•</span>
                    <span>Modern Silhouettes</span><span>•</span>
                    <span>Premium Fabrics</span><span>•</span>
                    <span>Designed in Studio</span><span>•</span>
                    <span>Global Shipping</span><span>•</span>
                    <span>Modern Silhouettes</span><span>•</span>
                    <span>Premium Fabrics</span><span>•</span>
                    <span>Designed in Studio</span><span>•</span>
                    <span>Global Shipping</span><span>•</span>
                    <span>Modern Silhouettes</span>
                </div>
            </div>

            {/* --- COLLECTIONS BENTO GRID --- */}
            <section className="max-w-[1400px] mx-auto px-6 py-32">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
                    
                    {/* Collection 1 */}
                    <Link href="/store" className="md:col-span-7 relative group rounded-[2.5rem] overflow-hidden h-[400px] md:h-full block">
                        <img 
                            src="https://images.unsplash.com/photo-1550614000-4b95d4ed7963?q=80&w=1000&auto=format&fit=crop" 
                            alt="Essentials" 
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-10 left-10 text-white">
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2 block text-white/70">Collection 01</span>
                            <h2 className="text-4xl font-black uppercase tracking-tight">The Essentials</h2>
                        </div>
                        <div className="absolute top-10 right-10 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:-rotate-45">
                            <ArrowRight size={20} />
                        </div>
                    </Link>

                    {/* Collection 2 */}
                    <Link href="/store" className="md:col-span-5 relative group rounded-[2.5rem] overflow-hidden h-[400px] md:h-full block">
                        <img 
                            src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop" 
                            alt="Outerwear" 
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-10 left-10 text-white">
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2 block text-white/70">Collection 02</span>
                            <h2 className="text-4xl font-black uppercase tracking-tight">Outerwear</h2>
                        </div>
                        <div className="absolute top-10 right-10 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:-rotate-45">
                            <ArrowRight size={20} />
                        </div>
                    </Link>

                </div>
            </section>

            {/* --- THE SEASONAL EDIT (DYNAMIC PRODUCTS) --- */}
            <div className="max-w-[1400px] mx-auto px-6 pb-32">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-[#111]/10 pb-8">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#111] uppercase">The Seasonal Edit</h2>
                        <p className="text-[#111]/60 font-medium mt-3 text-lg">Curated garments arriving this week.</p>
                    </div>
                    <Link href="/store" className="group hidden md:flex items-center gap-3 text-[#111] font-bold hover:text-blue-600 transition-colors uppercase tracking-widest text-sm border border-[#111] hover:border-blue-600 px-8 py-4 rounded-full">
                        Shop All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {isLoading ? (
                        [1, 2, 3].map((skeleton) => (
                            <div key={skeleton} className="aspect-[3/4] bg-[#111]/5 rounded-[2rem] animate-pulse"></div>
                        ))
                    ) : (
                        featuredProducts.map((product, index) => {
                            const primaryImage = product.images?.[0] || (product as any).imageUrl || "https://placehold.co/600x800/d1d5db/9ca3af?text=Garment";
                            const secondaryImage = product.images?.[1];

                            return (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8, delay: index * 0.15, type: "spring", bounce: 0.3 }}
                                    className="group relative flex flex-col h-full"
                                >
                                    <Link href={`/store/${product._id}`} className="block aspect-[3/4] bg-[#EAE8E3] rounded-[2rem] overflow-hidden relative shrink-0 mb-6">
                                        <img 
                                            src={primaryImage} 
                                            alt={product.name}
                                            className={`w-full h-full object-cover transform transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${secondaryImage ? 'group-hover:opacity-0 absolute inset-0' : 'group-hover:scale-110'}`}
                                            onError={(e) => (e.currentTarget.src = "https://placehold.co/600x800/d1d5db/9ca3af?text=Image+Unavailable")}
                                        />
                                        {secondaryImage && (
                                            <img 
                                                src={secondaryImage} 
                                                alt={`${product.name} alternate view`}
                                                className="w-full h-full object-cover transform scale-105 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out absolute inset-0 group-hover:scale-100"
                                            />
                                        )}
                                        <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md text-[10px] px-4 py-2 rounded-full text-[#111] font-bold uppercase tracking-widest shadow-sm">
                                            {product.category}
                                        </div>
                                    </Link>

                                    <div className="flex flex-col flex-grow px-2">
                                        <div className="flex justify-between items-start mb-2">
                                            <Link href={`/store/${product._id}`}>
                                                <h3 className="text-2xl font-black text-[#111] group-hover:text-blue-600 transition-colors line-clamp-1 pr-4 uppercase tracking-tight">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <span className="text-xl font-medium text-[#111]/70 shrink-0">
                                                ₹{product.price.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                        
                                        <p className="text-[#111]/50 text-sm line-clamp-2 mt-2 mb-6 flex-grow font-medium">
                                            {product.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
                
                <div className="mt-16 flex justify-center md:hidden">
                    <Link href="/store" className="group flex items-center gap-3 text-[#111] font-bold uppercase tracking-widest text-sm border border-[#111] px-10 py-5 rounded-full w-full justify-center">
                        Shop All Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Global Styles for Marquee */}
            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 25s linear infinite;
                    min-width: 200%;
                }
            `}</style>
        </div>
    );
}