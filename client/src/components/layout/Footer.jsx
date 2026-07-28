// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { FaInstagram, FaXTwitter, FaFacebookF } from 'react-icons/fa6'; // FontAwesome Social Icons

const Footer = () => {
  return (
    <footer 
      className="border-t border-[#E8E2D5] pt-16 pb-8 px-6 md:px-12 transition-colors"
      style={{ background: "#FDFBF7", color: "#1A1814" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E8E2D5]">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold tracking-widest uppercase text-[#C5A059]">
            ATELIER
          </h2>
          <p className="text-xs text-[#635E54] leading-relaxed max-w-sm">
            Crafting bespoke Made-to-Measure classics and refined everyday essentials. Exceptional tailoring made for the modern wardrobe.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="#" className="text-[#7A7365] hover:text-[#C5A059] transition-colors">
              <FaInstagram size={18} />
            </a>
            <a href="#" className="text-[#7A7365] hover:text-[#C5A059] transition-colors">
              <FaXTwitter size={18} />
            </a>
            <a href="#" className="text-[#7A7365] hover:text-[#C5A059] transition-colors">
              <FaFacebookF size={18} />
            </a>
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#1A1814]">
            Collections
          </h4>
          <ul className="space-y-2 text-xs text-[#635E54]">
            <li>
              <Link to="/products?section=classics" className="hover:text-[#C5A059] transition-colors">
                Made to Measure Classics
              </Link>
            </li>
            <li>
              <Link to="/products?section=everyday" className="hover:text-[#C5A059] transition-colors">
                Everyday Wear
              </Link>
            </li>
            <li>
              <Link to="/products?category=suits" className="hover:text-[#C5A059] transition-colors">
                Custom Suits & Jackets
              </Link>
            </li>
            <li>
              <Link to="/products?category=t-shirts" className="hover:text-[#C5A059] transition-colors">
                Essential T-Shirts
              </Link>
            </li>
          </ul>
        </div>

        {/* Client Care */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#1A1814]">
            Client Care
          </h4>
          <ul className="space-y-2 text-xs text-[#635E54]">
            <li>
              <Link to="/profiles" className="hover:text-[#C5A059] transition-colors">
                Measurement Profiles
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-[#C5A059] transition-colors">
                Track Order
              </Link>
            </li>
            <li>
              <Link to="/fitting-guide" className="hover:text-[#C5A059] transition-colors">
                Fitting & Alterations
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#C5A059] transition-colors">
                Contact & Consultations
              </Link>
            </li>
          </ul>
        </div>

        {/* Atelier Contact */}
        <div className="space-y-3 text-xs text-[#635E54]">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#1A1814]">
            Atelier
          </h4>
          <div className="flex items-center space-x-2">
            <MapPin size={14} className="text-[#C5A059]" />
            <span>Greater Toronto Area, Ontario</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail size={14} className="text-[#C5A059]" />
            <span>concierge@atelier.com</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone size={14} className="text-[#C5A059]" />
            <span>+1 (800) 555-0199</span>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-[#8C857B] tracking-wider">
        <p>© {new Date().getFullYear()} ATELIER LOGISTICS INC. ALL RIGHTS RESERVED.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-[#1A1814] transition-colors">PRIVACY POLICY</Link>
          <Link to="/terms" className="hover:text-[#1A1814] transition-colors">TERMS OF SERVICE</Link>
          <Link to="/shipping" className="hover:text-[#1A1814] transition-colors">SHIPPING & RETURNS</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;