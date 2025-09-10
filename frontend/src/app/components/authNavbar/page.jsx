'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, User, Search, Menu, X } from 'lucide-react';

function AuthNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-[60] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative">
                  <Image 
                    src="/logo.png" 
                    alt="BestWishes Logo" 
                    width={150}
                    height={50}
                    className="object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
          

              {/* Navigation Links */}
              <div className="flex items-center space-x-6">
               

                <Link 
                  href="/aboutUs" 
                  className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
                >
                  About Us
                </Link>
              </div>

              {/* Action Icons */}
              <div className="flex items-center space-x-4">

                <Link 
                  href="/login" 
                  className="flex items-center space-x-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Login</span>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <Link 
                href="/user/checkout" 
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
              </Link>
              
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                  <Search className="w-4 h-4 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Link 
                  href="/services" 
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                
                <div className="space-y-1">
                  <div className="px-3 py-2 text-sm font-medium text-gray-700">Gift Combo</div>
                  <div className="ml-4 space-y-1">
                    <Link 
                      href="/surprisegift" 
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Surprise Gift Delivery
                    </Link>
                    <Link 
                      href="/user/customizegifts" 
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Customizable Gift
                    </Link>
                    <Link 
                      href="/reminder" 
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Reminder Gift
                    </Link>
                  </div>
                </div>

                <Link 
                  href="/aboutUs" 
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>

                <Link 
                  href="/user/wishlist" 
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wishlist
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default AuthNavbar;