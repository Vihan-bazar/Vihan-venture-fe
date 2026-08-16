import Link from "next/link";
import { Sparkles } from "lucide-react";

// Native SVG components tailored for Light Mode
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 0.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#F3F2EC] text-[#111] pt-16 pb-10 relative overflow-hidden z-20 border-t border-[#111]/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-wider text-[#111] mb-6 w-fit group">
              Vihan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Bazar</span>
              <Sparkles size={18} className="text-blue-500 opacity-80 group-hover:opacity-100 transition-opacity" />
            </Link>
            <p className="text-[#111]/60 font-medium leading-relaxed max-w-sm mb-8 text-sm">
              Elevate the everyday. Premium garments crafted for the modern wardrobe. Experience commerce without compromise.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-[#111]/10 flex items-center justify-center text-[#111]/50 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all bg-white/50 backdrop-blur-sm shadow-sm">
                <InstagramIcon />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[#111]/10 flex items-center justify-center text-[#111]/50 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all bg-white/50 backdrop-blur-sm shadow-sm">
                <TwitterIcon />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[#111]/10 flex items-center justify-center text-[#111]/50 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all bg-white/50 backdrop-blur-sm shadow-sm">
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="text-[#111] font-bold tracking-widest uppercase text-[10px] mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/store" className="text-[#111]/60 hover:text-blue-600 transition-colors font-medium text-sm">All Collection</Link></li>
              <li><Link href="/store" className="text-[#111]/60 hover:text-blue-600 transition-colors font-medium text-sm">New Arrivals</Link></li>
              <li><Link href="/store" className="text-[#111]/60 hover:text-blue-600 transition-colors font-medium text-sm">Best Sellers</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[#111] font-bold tracking-widest uppercase text-[10px] mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/track" className="text-[#111]/60 hover:text-blue-600 transition-colors font-medium text-sm">Track Order</Link></li>
              <li><Link href="/contact" className="text-[#111]/60 hover:text-blue-600 transition-colors font-medium text-sm">Contact Us</Link></li>
              <li><Link href="#" className="text-[#111]/60 hover:text-blue-600 transition-colors font-medium text-sm">Shipping & Returns</Link></li>
              <li><Link href="#" className="text-[#111]/60 hover:text-blue-600 transition-colors font-medium text-sm">Size Guide</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[#111] font-bold tracking-widest uppercase text-[10px] mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[#111]/60 hover:text-blue-600 transition-colors font-medium text-sm">About Us</Link></li>
              <li><a href="https://services.vihanventure.com" target="_blank" rel="noopener noreferrer" className="text-[#111]/60 hover:text-blue-600 transition-colors font-medium text-sm">Our Services</a></li>
              <li><Link href="#" className="text-[#111]/60 hover:text-blue-600 transition-colors font-medium text-sm">Privacy Policy</Link></li>
              <li><Link href="#" className="text-[#111]/60 hover:text-blue-600 transition-colors font-medium text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#111]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#111]/40 text-xs font-medium tracking-wide">
            &copy; 2026 Vihan Venture Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-[#111]/40 text-xs font-medium tracking-wide flex items-center gap-1">
            Designed by 
            <a 
              href="https://skds.in/" 
              className="text-[#111]/80 font-bold hover:text-blue-600 transition-colors ml-1"
            >
              Shri Kishori Design Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
