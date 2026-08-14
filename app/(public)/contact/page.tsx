"use client";

import { useState } from "react";
import Navbar from "../../../components/layout/Navbar";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ submitted: false, loading: false });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ submitted: false, loading: true });
    
    // Simulate an API call to send the message
    setTimeout(() => {
      setStatus({ submitted: true, loading: false });
      setFormData({ name: "", email: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus({ submitted: false, loading: false }), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F3F2EC] text-[#111] font-sans relative pb-20 selection:bg-[#111] selection:text-[#F3F2EC] overflow-hidden">
      
      {/* --- DARK TEXTURE ON LIGHT BACKGROUND --- */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#1111110a_1px,transparent_1px),linear-gradient(to_bottom,#1111110a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none mix-blend-multiply"></div>
      
      {/* Soft ambient shadow */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#111]/5 blur-[150px] -z-20 rounded-full pointer-events-none"></div>

      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-32 relative z-10">
        
        <div className="text-center mb-16 md:mb-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/50 backdrop-blur-md border border-[#111]/10 mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-xs font-bold tracking-[0.2em] uppercase text-[#111]">
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 text-[#111]">
              Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 inline-block pb-2">Our Team</span>
            </h1>
            <p className="text-[#111]/60 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Have a question about sizing, our premium collections, or need help tracking an order? Our styling and support team is here to help.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="bg-[#FAF9F5] border border-[#111]/5 rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md flex items-start gap-5 hover:shadow-[0_20px_40px_rgba(17,17,17,0.08)] transition-all duration-300 group"
            >
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#111] mb-1">Email Us</h3>
                <p className="text-[#111]/60 text-sm mb-3 font-medium">Our friendly team is here to help.</p>
                <a href="mailto:support@vihanventure.com" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">support@vihanventure.com</a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-[#FAF9F5] border border-[#111]/5 rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md flex items-start gap-5 hover:shadow-[0_20px_40px_rgba(17,17,17,0.08)] transition-all duration-300 group"
            >
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#111] mb-1">Headquarters</h3>
                <p className="text-[#111]/60 text-sm mb-3 font-medium">Come say hello at our office.</p>
                <p className="text-[#111] font-bold">Vihan Venture Ltd.<br/><span className="text-[#111]/70 font-medium">Tech Park, Innovation Tower</span></p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="bg-[#FAF9F5] border border-[#111]/5 rounded-[2rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md flex items-start gap-5 hover:shadow-[0_20px_40px_rgba(17,17,17,0.08)] transition-all duration-300 group"
            >
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#111] mb-1">Call Us</h3>
                <p className="text-[#111]/60 text-sm mb-3 font-medium">Mon-Fri from 9am to 6pm.</p>
                <a href="tel:+919876543210" className="text-[#111] font-bold hover:text-blue-600 transition-colors">+91 98765 43210</a>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="bg-[#FAF9F5] border border-[#111]/5 rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-md relative overflow-hidden">
              
              <h2 className="text-2xl md:text-3xl font-black mb-8 flex items-center gap-3 text-[#111]">
                <MessageSquare className="text-blue-600" /> Send a Message
              </h2>

              {status.submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-[2rem] p-10 text-center"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Send size={32} className="ml-1" />
                  </div>
                  <h3 className="text-2xl font-black text-green-800 mb-3">Message Sent!</h3>
                  <p className="text-green-700/80 font-medium">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#111]/60 uppercase tracking-wider pl-1">Full Name</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleInputChange}
                        className="w-full bg-[#EAE8E3]/60 border border-[#111]/10 text-[#111] placeholder-[#111]/40 rounded-2xl py-4 px-5 focus:outline-none focus:border-blue-600 transition-all font-medium"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#111]/60 uppercase tracking-wider pl-1">Email Address</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleInputChange}
                        className="w-full bg-[#EAE8E3]/60 border border-[#111]/10 text-[#111] placeholder-[#111]/40 rounded-2xl py-4 px-5 focus:outline-none focus:border-blue-600 transition-all font-medium"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#111]/60 uppercase tracking-wider pl-1">Your Message</label>
                    <textarea name="message" required value={formData.message} onChange={handleInputChange} rows={5}
                      className="w-full bg-[#EAE8E3]/60 border border-[#111]/10 text-[#111] placeholder-[#111]/40 rounded-2xl py-4 px-5 focus:outline-none focus:border-blue-600 transition-all resize-none font-medium"
                      placeholder="How can we help you today? (e.g., sizing inquiries, order tracking...)"
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={status.loading}
                    className="w-full bg-[#111] hover:bg-blue-600 text-[#F3F2EC] font-bold py-4 rounded-2xl transition-all shadow-[0_10px_25px_rgba(17,17,17,0.2)] active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70 mt-4"
                  >
                    {status.loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">Send Message <Send size={18} /></span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}