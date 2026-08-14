"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import Navbar from "../../../components/layout/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle, MapPin, CreditCard, Truck, User, Phone, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "", phone: "", address: "", city: "", pinCode: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Safely handle the redirect ONLY after the component has mounted in the browser
  useEffect(() => {
    if (items.length === 0 && step !== 3) {
      router.push("/store");
    }
  }, [items.length, step, router]);

  // Prevent rendering the checkout UI while redirecting
  if (items.length === 0 && step !== 3) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    try {
      // Map the Zustand cart items to match the exact schema expected by our Order backend
      const orderPayload = {
        customerDetails: formData,
        paymentMethod: paymentMethod,
        totalAmount: cartTotal,
        items: items.map(item => ({
          product: item._id,
          name: item.name,
          size: item.size || 'N/A', // Capture the specific clothing size
          quantity: item.quantity,
          price: item.price,
          // Extract the first image securely regardless of old/new schema
          image: item.image || (item.images && item.images[0]) || item.imageUrl || ""
        }))
      };

      // Push to the new backend endpoint
      const response = await api.post('/orders', orderPayload);

      // Save the generated 6-digit order ID for the success screen
      setConfirmedOrderId(response.data.orderId);

      setStep(3);
      clearCart();
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Something went wrong placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F2EC] text-[#111] font-sans relative pb-20 selection:bg-[#111] selection:text-[#F3F2EC] overflow-hidden">

      {/* --- DARK TEXTURE ON LIGHT BACKGROUND --- */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#1111110a_1px,transparent_1px),linear-gradient(to_bottom,#1111110a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none mix-blend-multiply"></div>

      {/* Soft ambient shadow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[500px] bg-[#111]/5 blur-[120px] -z-20 rounded-full pointer-events-none"></div>

      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 relative z-10">

        {/* Progress Indicator */}
        {step < 3 && (
          <div className="flex items-center justify-center mb-12">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600 font-bold' : 'text-[#111]/40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-[#111]/20'}`}>1</div>
              <span className="text-sm hidden sm:block">Shipping</span>
            </div>
            <div className={`w-16 h-1 mx-4 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-[#111]/10'}`}></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600 font-bold' : 'text-[#111]/40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-[#111]/20'}`}>2</div>
              <span className="text-sm hidden sm:block">Payment</span>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* STEP 1: Shipping Details */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="bg-[#FAF9F5] border border-[#111]/5 rounded-[2.5rem] p-6 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md"
            >
              <h2 className="text-2xl md:text-3xl font-black mb-8 flex items-center gap-3 text-[#111]">
                <MapPin className="text-blue-600" /> Delivery Details
              </h2>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <User className="absolute left-4 top-4 text-[#111]/40 w-5 h-5" />
                    <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleInputChange}
                      className="w-full bg-[#EAE8E3]/60 border border-[#111]/10 text-[#111] placeholder-[#111]/40 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-600 transition-all font-medium text-sm" />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 text-[#111]/40 w-5 h-5" />
                    <input type="tel" name="phone" placeholder="Phone Number" required value={formData.phone} onChange={handleInputChange}
                      className="w-full bg-[#EAE8E3]/60 border border-[#111]/10 text-[#111] placeholder-[#111]/40 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-600 transition-all font-medium text-sm" />
                  </div>
                </div>

                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-[#111]/40 w-5 h-5" />
                  <input type="text" name="address" placeholder="Full Address (House No, Street, Landmark)" required value={formData.address} onChange={handleInputChange}
                    className="w-full bg-[#EAE8E3]/60 border border-[#111]/10 text-[#111] placeholder-[#111]/40 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-600 transition-all font-medium text-sm" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <input type="text" name="city" placeholder="City" required value={formData.city} onChange={handleInputChange}
                    className="w-full bg-[#EAE8E3]/60 border border-[#111]/10 text-[#111] placeholder-[#111]/40 rounded-2xl py-4 px-6 focus:outline-none focus:border-blue-600 transition-all font-medium text-sm" />
                  <input type="text" name="pinCode" placeholder="PIN Code" required value={formData.pinCode} onChange={handleInputChange}
                    className="w-full bg-[#EAE8E3]/60 border border-[#111]/10 text-[#111] placeholder-[#111]/40 rounded-2xl py-4 px-6 focus:outline-none focus:border-blue-600 transition-all font-medium text-sm" />
                </div>

                <button type="submit" className="w-full mt-8 bg-[#111] hover:bg-blue-600 text-[#F3F2EC] font-bold py-4 rounded-2xl transition-all shadow-[0_10px_25px_rgba(17,17,17,0.2)] flex justify-center items-center gap-2 active:scale-[0.98]">
                  Continue to Payment <ArrowRight size={18} />
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 2: Payment Method */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="bg-[#FAF9F5] border border-[#111]/5 rounded-[2.5rem] p-6 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md"
            >
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setStep(1)} className="p-2.5 bg-[#EAE8E3]/60 hover:bg-[#EAE8E3] rounded-xl transition-colors text-[#111]">
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl md:text-3xl font-black flex items-center gap-3 text-[#111]">
                  <CreditCard className="text-blue-600" /> Payment Method
                </h2>
              </div>

              <div className="space-y-4 mb-8">
                {/* UPI Option */}
                <label className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'upi' ? 'bg-blue-50/50 border-blue-600 shadow-sm' : 'bg-[#EAE8E3]/40 border-[#111]/5 hover:border-[#111]/20'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-5 h-5 accent-blue-600" />
                    <span className="font-bold text-[#111]">UPI (GPay, PhonePe, Paytm)</span>
                  </div>
                </label>

                {/* Card Option */}
                <label className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'card' ? 'bg-blue-50/50 border-blue-600 shadow-sm' : 'bg-[#EAE8E3]/40 border-[#111]/5 hover:border-[#111]/20'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-5 h-5 accent-blue-600" />
                    <span className="font-bold text-[#111]">Credit / Debit Card</span>
                  </div>
                </label>

                {/* COD Option */}
                <label className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'bg-blue-50/50 border-blue-600 shadow-sm' : 'bg-[#EAE8E3]/40 border-[#111]/5 hover:border-[#111]/20'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-5 h-5 accent-blue-600" />
                    <span className="font-bold text-[#111]">Cash on Delivery</span>
                  </div>
                  <Truck size={20} className="text-[#111]/40" />
                </label>
              </div>

              <div className="border-t border-[#111]/10 pt-6 mb-8 flex justify-between items-center">
                <span className="text-[#111]/60 font-medium">Total to pay:</span>
                <span className="text-2xl md:text-3xl font-black text-[#111]">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-70 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_10px_25px_rgba(22,163,74,0.3)] flex justify-center items-center gap-2 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">Place Order Securely <CheckCircle size={18} /></span>
                )}
              </button>
            </motion.div>
          )}

          {/* STEP 3: Success Confirmation */}
          {step === 3 && confirmedOrderId && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 bg-[#FAF9F5] border border-[#111]/5 rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md"
            >
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle size={48} />
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-4 text-[#111]">Order Confirmed!</h1>
              <p className="text-[#111]/80 text-lg mb-2 font-medium">Thank you, {formData.name}. Your order has been successfully placed.</p>

              <div className="bg-[#EAE8E3]/60 p-4 rounded-xl inline-block mt-4 mb-8">
                <p className="text-[#111]/60 text-sm font-medium mb-1">Your Tracking ID:</p>
                <p className="text-2xl font-black tracking-widest text-[#111]">#{confirmedOrderId}</p>
              </div>

              <p className="text-[#111]/50 mb-10 text-sm font-medium max-w-sm mx-auto">
                We will dispatch your garments to {formData.city} shortly. Please save your Tracking ID to check your order status.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link href="/track" className="w-full sm:w-auto bg-[#111] text-[#F3F2EC] px-8 py-4 rounded-full font-bold hover:bg-blue-600 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                  <Search size={18} /> Track Order
                </Link>
                <Link href="/store" className="w-full sm:w-auto bg-[#EAE8E3] text-[#111] px-8 py-4 rounded-full font-bold hover:bg-[#D4D2CD] transition-all active:scale-95">
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}