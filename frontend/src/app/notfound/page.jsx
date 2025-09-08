'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react'

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8 text-center">
            {/* 404 Number */}
            <div className="relative mb-6">
              <div className="text-6xl md:text-8xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text animate-pulse">
                404
              </div>
              {/* <div className="absolute inset-0 flex items-center justify-center">
                <AlertTriangle className="w-16 h-16 md:w-20 md:h-20 text-orange-500 animate-bounce" />
              </div> */}
            </div>

            {/* Main Content */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  Oops! Page Not Found
                </h1>
                <p className="text-base md:text-lg text-gray-600 max-w-sm mx-auto leading-relaxed">
                  The page you're looking for seems to have wandered off into the digital wilderness.
                </p>
              </div>

              {/* Search Suggestion */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Search className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-800 font-medium text-sm">Looking for something specific?</span>
                </div>
                <p className="text-blue-700 text-xs">
                  Try searching our product catalog or browse our categories to find what you need.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
                <Link href="/">
                  <Button 
                    size="default" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="default"
                  onClick={() => window.history.back()}
                  className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>

              {/* Quick Links */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-gray-500 mb-3 text-sm">Quick Navigation:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Link href="/allProducts">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs">
                      All Products
                    </Button>
                  </Link>
                  <Link href="/aboutUs">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs">
                      About Us
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs">
                      Services
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-xs">
                      Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Floating Elements for Visual Appeal */}
        <div className="fixed top-20 left-10 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75"></div>
        <div className="fixed top-40 right-20 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="fixed bottom-32 left-20 w-4 h-4 bg-pink-400 rounded-full animate-bounce"></div>
        <div className="fixed bottom-20 right-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
      </div>
    </div>
  )
}

export default NotFoundPage