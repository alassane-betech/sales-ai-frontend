"use client"

import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export function HeaderOrigin() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProductOpen, setIsProductOpen] = useState(false)
  const [isCompanyOpen, setIsCompanyOpen] = useState(false)

  const navItems = [
    {
      name: 'Product',
      href: '#features',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Features', href: '#features', description: 'Explore our AI-powered tools' },
        { name: 'Integrations', href: '#integrations', description: 'Connect with your favorite apps' },
        { name: 'API', href: '#api', description: 'Build custom solutions' },
        { name: 'Pricing', href: '#pricing', description: 'Choose the right plan' },
      ]
    },
    { name: 'Solutions', href: '#solutions' },
    { name: 'Resources', href: '#resources' },
    {
      name: 'Company',
      href: '#about',
      hasDropdown: true,
      dropdownItems: [
        { name: 'About', href: '#about', description: 'Learn about our mission' },
        { name: 'Blog', href: '#blog', description: 'Latest insights and updates' },
        { name: 'Careers', href: '#careers', description: 'Join our team' },
        { name: 'Contact', href: '#contact', description: 'Get in touch' },
      ]
    },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-green-main to-green-light rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">AI</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-light rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-main to-green-light bg-clip-text text-transparent">
                SalesAI
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div className="relative">
                    <button
                      onClick={() => {
                        if (item.name === 'Product') setIsProductOpen(!isProductOpen)
                        if (item.name === 'Company') setIsCompanyOpen(!isCompanyOpen)
                      }}
                      className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors duration-200 font-medium py-2"
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                        (item.name === 'Product' && isProductOpen) || (item.name === 'Company' && isCompanyOpen) 
                          ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {((item.name === 'Product' && isProductOpen) || (item.name === 'Company' && isCompanyOpen)) && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl overflow-hidden"
                        >
                          <div className="p-2">
                            {item.dropdownItems?.map((dropdownItem) => (
                              <a
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                              >
                                <div className="font-medium">{dropdownItem.name}</div>
                                <div className="text-sm text-gray-400">{dropdownItem.description}</div>
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                  >
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/auth?mode=signin" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
              Sign In
            </Link>
            <Link href="/auth?mode=signup" className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-main to-green-light rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-main focus:ring-offset-2 focus:ring-offset-dark-900">
              Start Free Trial
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/20"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => (
                  <div key={item.name}>
                    <a
                      href={item.href}
                      className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                    {item.hasDropdown && item.dropdownItems && (
                      <div className="ml-4 mt-2 space-y-1">
                        {item.dropdownItems.map((dropdownItem) => (
                          <a
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {dropdownItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-4 border-t border-white/20">
                  <Link href="/auth?mode=signin" className="block w-full mb-2 px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200">
                    Sign In
                  </Link>
                  <Link href="/auth?mode=signup" className="block w-full px-4 py-2 text-white bg-gradient-to-r from-green-main to-green-light rounded-lg font-medium">
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
} 