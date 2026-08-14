"use client";

import { useCartStore } from "@/store/cartStore";
import Navbar from "../../../components/layout/Navbar";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, addToCart, decreaseQuantity, removeFromCart } = useCartStore();
  const router = useRouter();

  // Calculate the total price
  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#F3F2EC] text-[#111] font-sans relative pb-20 selection:bg-[#111] selection:text-[#F3F2EC] overflow-hidden">
      
      {/* --- DARK TEXTURE ON LIGHT BACKGROUND --- */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#1111110a_1px,transparent_1px),linear-gradient(to_bottom,#1111110a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none mix-blend-multiply"></div>
      
      {/* Soft ambient shadow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[500px] bg-[#111]/5 blur-[120px] -z-20 rounded-full pointer-events-none"></div>

      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 relative z-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-10 text-[#111]">Your Cart</h1>

        {items.length === 0 ? (
          // Empty State
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-[#FAF9F5] border border-[#111]/5 rounded-[2.5xl] shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md text-center px-4"
          >
            <div className="w-20 h-20 bg-[#EAE8E3] rounded-full flex items-center justify-center mb-6 text-[#111]">
              <ShoppingBag size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-[#111]">Your cart is empty</h2>
            <p className="text-[#111]/60 mb-8 font-medium">Looks like you haven't added any garments yet.</p>
            <Link href="/store" className="bg-[#111] text-[#F3F2EC] px-8 py-4 rounded-full font-bold hover:bg-blue-600 transition-all shadow-lg active:scale-95">
              Explore Collection
            </Link>
          </motion.div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Side: Product List */}
            <div className="lg:col-span-8 space-y-6">
              {items.map((item, index) => {
                // Ensure backward compatibility with your Zustand store if it uses a composite ID for sizing
                const uniqueItemId = item.cartItemId || item._id; 

                return (
                  <motion.div 
                    key={uniqueItemId}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                    className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-[#FAF9F5] border border-[#111]/5 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md hover:border-[#111]/10 transition-colors"
                  >
                    <div className="w-full sm:w-32 h-40 bg-[#EAE8E3] rounded-2xl overflow-hidden shrink-0">
                      <img 
                        // Pull from the new images array, fallback to legacy imageUrl
                        src={item.image || (item.images && item.images[0]) || item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = "https://placehold.co/150x200/d1d5db/9ca3af?text=Garment")}
                      />
                    </div>
                    
                    <div className="flex-1 w-full flex flex-col justify-between h-full py-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-[#111] mb-1">{item.name}</h3>
                          
                          {/* New Clothing Size Indicator */}
                          {item.size && (
                            <div className="inline-flex items-center mt-1 mb-2">
                              <span className="px-2.5 py-1 rounded-md bg-[#111]/5 border border-[#111]/10 text-[#111]/70 text-xs font-bold uppercase tracking-wider">
                                Size: {item.size}
                              </span>
                            </div>
                          )}
                          
                          <p className="text-blue-600 font-extrabold mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(uniqueItemId)}
                          className="text-[#111]/40 hover:text-red-500 transition-colors p-2.5 hover:bg-red-500/10 rounded-xl shrink-0"
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 bg-[#EAE8E3]/60 w-fit p-1 rounded-xl border border-[#111]/5">
                        <button 
                          onClick={() => decreaseQuantity(uniqueItemId)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-[#111]/60 hover:text-[#111] transition-colors shadow-sm"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-bold text-sm text-[#111]">{item.quantity}</span>
                        <button 
                          onClick={() => addToCart(item)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-[#111]/60 hover:text-[#111] transition-colors shadow-sm"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Side: Order Summary */}
            <div className="lg:col-span-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[#FAF9F5] border border-[#111]/5 rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md sticky top-32"
              >
                <h3 className="text-xl font-black mb-6 text-[#111]">Order Summary</h3>
                
                <div className="space-y-4 mb-6 text-sm text-[#111]/70 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                    <span className="font-bold text-[#111]">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-[#111]/10 pt-6 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#111]">Total</span>
                    <span className="text-2xl font-black text-[#111]">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button 
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-[#111] hover:bg-blue-600 text-[#F3F2EC] font-bold py-4 rounded-2xl transition-all shadow-[0_10px_25px_rgba(17,17,17,0.2)] active:scale-[0.98] flex justify-center items-center gap-2"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
              </motion.div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}