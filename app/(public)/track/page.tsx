"use client";

import { useState } from "react";
import Navbar from "../../../components/layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Clock, Truck, CheckCircle, ArrowRight, MapPin, ChevronLeft } from "lucide-react";
import api from "../../../lib/api";
import Link from "next/link";

interface OrderItem {
    _id: string;
    product: string;
    name: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
}

interface OrderDetails {
    orderId: string;
    createdAt: string;
    status: 'Pending' | 'Dispatched' | 'Delivered';
    totalAmount: number;
    paymentMethod: string;
    customerDetails: {
        name: string;
        address: string;
        city: string;
        pinCode: string;
    };
    items: OrderItem[];
}

export default function TrackOrderPage() {
    const [trackingId, setTrackingId] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [error, setError] = useState("");

    const handleTrackOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingId.trim()) return;

        setIsSearching(true);
        setError("");
        setOrder(null);

        try {
            // Remove any '#' the user might have accidentally typed
            const cleanId = trackingId.replace('#', '').trim();
            const response = await api.get(`/orders/track/${cleanId}`);
            setOrder(response.data);
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError("We couldn't find an order with that Tracking ID. Please check the number and try again.");
            } else {
                setError("Something went wrong while fetching your order. Please try again later.");
            }
        } finally {
            setIsSearching(false);
        }
    };

    const StatusIcon = () => {
        if (!order) return null;
        switch (order.status) {
            case 'Pending': return <Clock size={24} className="text-amber-500" />;
            case 'Dispatched': return <Truck size={24} className="text-blue-600" />;
            case 'Delivered': return <CheckCircle size={24} className="text-green-600" />;
            default: return <Package size={24} className="text-[#111]" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F2EC] text-[#111] font-sans relative pb-20 selection:bg-[#111] selection:text-[#F3F2EC] overflow-hidden">
            
            {/* --- DARK TEXTURE ON LIGHT BACKGROUND --- */}
            <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#1111110a_1px,transparent_1px),linear-gradient(to_bottom,#1111110a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none mix-blend-multiply"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[500px] bg-[#111]/5 blur-[120px] -z-20 rounded-full pointer-events-none"></div>

            <Navbar />

            <main className="max-w-4xl mx-auto px-6 pt-32 relative z-10">
                
                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 text-[#111]">
                        Track Your Order
                    </h1>
                    <p className="text-[#111]/60 text-lg md:text-xl font-medium leading-relaxed">
                        Enter the 6-digit tracking ID provided during checkout to view your receipt and live fulfillment status.
                    </p>
                </div>

                {/* Tracking Input Form */}
                {!order && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-[#FAF9F5] border border-[#111]/5 rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md max-w-xl mx-auto"
                    >
                        <form onSubmit={handleTrackOrder} className="space-y-6">
                            <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#111]/40 w-6 h-6 group-focus-within:text-blue-600 transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Enter Tracking ID (e.g. 654321)" 
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                    className="w-full bg-[#EAE8E3]/60 border border-[#111]/10 text-[#111] placeholder-[#111]/40 rounded-full py-5 pl-16 pr-6 focus:outline-none focus:border-blue-600 transition-all font-bold text-lg tracking-widest text-center"
                                />
                            </div>

                            {error && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-600 text-sm font-bold text-center">
                                    {error}
                                </motion.p>
                            )}

                            <button 
                                type="submit" 
                                disabled={isSearching || !trackingId.trim()}
                                className="w-full bg-[#111] hover:bg-blue-600 text-[#F3F2EC] font-bold py-5 rounded-full transition-all shadow-[0_10px_25px_rgba(17,17,17,0.2)] active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                            >
                                {isSearching ? (
                                    <span className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Locating...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">Find My Order <ArrowRight size={20} /></span>
                                )}
                            </button>
                        </form>
                    </motion.div>
                )}

                {/* Order Details Display */}
                <AnimatePresence>
                    {order && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#FAF9F5] border border-[#111]/5 rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md"
                        >
                            {/* Top Status Banner */}
                            <div className={`p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-[#111]/10 ${
                                order.status === 'Pending' ? 'bg-amber-50' : 
                                order.status === 'Dispatched' ? 'bg-blue-50' : 'bg-green-50'
                            }`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-sm`}>
                                        <StatusIcon />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#111]/50 uppercase tracking-widest mb-1">Current Status</p>
                                        <h2 className="text-2xl md:text-3xl font-black text-[#111]">{order.status}</h2>
                                    </div>
                                </div>
                                
                                <div className="text-center md:text-right">
                                    <p className="text-sm font-bold text-[#111]/50 uppercase tracking-widest mb-1">Order Number</p>
                                    <p className="text-xl font-black tracking-widest text-[#111]">#{order.orderId}</p>
                                </div>
                            </div>

                            <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                                
                                {/* Order Summary (Left/Top) */}
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="flex justify-between items-end border-b border-[#111]/10 pb-4">
                                        <h3 className="text-lg font-black uppercase tracking-widest text-[#111]">Garments Ordered</h3>
                                        <span className="text-sm font-bold text-[#111]/50">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    <div className="space-y-6">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-6 group">
                                                <div className="w-20 h-28 bg-[#EAE8E3] rounded-xl overflow-hidden shrink-0">
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.name} 
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => (e.currentTarget.src = "https://placehold.co/150x200/d1d5db/9ca3af?text=Garment")}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-bold text-[#111] mb-1">{item.name}</h4>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="px-2.5 py-1 rounded-md bg-[#111]/5 border border-[#111]/10 text-[#111] text-xs font-bold uppercase tracking-wider">
                                                            Size: {item.size}
                                                        </span>
                                                        <span className="text-sm font-bold text-[#111]/50">Qty: {item.quantity}</span>
                                                    </div>
                                                    <p className="text-blue-600 font-extrabold">₹{item.price.toLocaleString('en-IN')}</p>
                                                </div>
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-lg font-black text-[#111]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Customer Details & Total (Right/Bottom) */}
                                <div className="space-y-8 lg:border-l border-[#111]/10 lg:pl-10">
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-[#111]/50 mb-4 flex items-center gap-2">
                                            <MapPin size={16} /> Delivery Info
                                        </h3>
                                        <p className="font-black text-[#111] text-lg mb-1">{order.customerDetails.name}</p>
                                        <p className="text-[#111]/70 font-medium leading-relaxed text-sm">
                                            {order.customerDetails.address}<br/>
                                            {order.customerDetails.city}, {order.customerDetails.pinCode}
                                        </p>
                                    </div>

                                    <div className="bg-[#EAE8E3]/50 rounded-2xl p-6 border border-[#111]/5">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-[#111]/50 mb-4">Payment Summary</h3>
                                        <div className="space-y-3 mb-4 text-sm font-medium text-[#111]/70">
                                            <div className="flex justify-between">
                                                <span>Subtotal</span>
                                                <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Shipping</span>
                                                <span className="text-green-600 font-bold">Free</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Method</span>
                                                <span className="uppercase">{order.paymentMethod}</span>
                                            </div>
                                        </div>
                                        <div className="border-t border-[#111]/10 pt-4 flex justify-between items-center">
                                            <span className="font-bold text-[#111]">Total Paid</span>
                                            <span className="text-2xl font-black text-[#111]">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Reset Button */}
                            <div className="bg-[#111] p-4 text-center">
                                <button 
                                    onClick={() => { setOrder(null); setTrackingId(""); }}
                                    className="text-[#F3F2EC] font-bold text-sm uppercase tracking-widest hover:text-blue-400 transition-colors flex items-center justify-center gap-2 mx-auto"
                                >
                                    <ChevronLeft size={16} /> Track Another Order
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
}