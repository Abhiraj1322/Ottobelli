// src/components/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Handle newsletter subscription logic here
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#141414] text-gray-300 pt-14 pb-8">
      <div className="max-w-[1440px] mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b border-gray-800 text-sm">
        
        {/* Brand Description Column */}
        <div className="md:col-span-1 space-y-3">
          <h4 className="text-white text-xs font-semibold uppercase tracking-widest">
            Ottobelli
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Made-to-measure menswear storefront built with standard garments and precision fit guarantees.
          </p>
        </div>
        
        {/* Classics Column */}
        <div>
          <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-3">
            Classics
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/classics/suits" className="hover:underline text-gray-300 transition-colors">
                Suits
              </Link>
            </li>
            <li>
              <Link to="/classics/blazers" className="hover:underline text-gray-300 transition-colors">
                Blazers
              </Link>
            </li>
            <li>
              <Link to="/classics/tuxedos" className="hover:underline text-gray-300 transition-colors">
                Tuxedos
              </Link>
            </li>
            <li>
              <Link to="/classics/dress-shirts" className="hover:underline text-gray-300 transition-colors">
                Dress Shirts
              </Link>
            </li>
          </ul>
        </div>

        {/* Everyday Column */}
        <div>
          <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-3">
            Everyday
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/everyday/casual-shirts" className="hover:underline text-gray-300 transition-colors">
                Casual Shirts
              </Link>
            </li>
            <li>
              <Link to="/everyday/chinos" className="hover:underline text-gray-300 transition-colors">
                Chinos
              </Link>
            </li>
            <li>
              <Link to="/everyday/outerwear" className="hover:underline text-gray-300 transition-colors">
                Outerwear
              </Link>
            </li>
          </ul>
        </div>

        {/* Help Column */}
        <div>
          <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-3">
            Help
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/fit-guarantee" className="hover:underline text-gray-300 transition-colors">
                Fit Guarantee
              </Link>
            </li>
            <li>
              <Link to="/fitting" className="hover:underline text-gray-300 transition-colors">
                Book a Fitting
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:underline text-gray-300 transition-colors">
                Shipping & Returns
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription Form */}
        <div>
          <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-3">
            Newsletter
          </h4>
          <form onSubmit={handleNewsletterSubmit} className="flex border-b border-gray-500 pb-1">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address" 
              className="bg-transparent text-white outline-none text-xs w-full placeholder-gray-500"
              required
            />
            <button 
              type="submit" 
              className="text-xs uppercase font-bold text-white tracking-widest hover:text-gray-300 transition-colors"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1440px] mx-auto px-4 pt-6 flex justify-between items-center text-xs text-gray-500 flex-wrap gap-4">
        <span>&copy; {new Date().getFullYear()} Ottobelli. All rights reserved.</span>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:underline transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:underline transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;