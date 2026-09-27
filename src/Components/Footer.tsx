"use client";

import React from "react";
import Link from "next/link";
import { Headphones, Mail, MapPin, Phone, ShieldCheck, Truck } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { LiaLinkedin } from "react-icons/lia";


const Footer = () => {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 text-slate-400 text-sm">
      
      {/* -------------------------------------------------------------
          1. VALUE PROPOSITIONS / FEATURES BANNER
      ------------------------------------------------------------- */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Fast Distribution</h4>
              <p className="text-xs text-slate-400">Nationwide doorstep order delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Verified Products</h4>
              <p className="text-xs text-slate-400">100% authentic wholesale inventory</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="p-3 bg-indigo-600/10 text-indigo-400 rounded-xl">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Dedicated Support</h4>
              <p className="text-xs text-slate-400">24/7 hotline for retailers & staff</p>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          2. MAIN FOOTER CONTENT
      ------------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Brand Info (Spans 2 columns on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/assats/rokomary-distribution2.svg"
              alt="Rokomary Distribution Logo"
              className="h-19 w-auto object-contain"
            />
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Empowering businesses with seamless supply chain management, real-time inventory tracking, and hassle-free distribution solutions.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href="#"
              aria-label="Facebook"
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white transition-all"
            >
              <FaFacebook className="w-4 h-4" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white transition-all"
            >
              <BsTwitter className="w-4 h-4" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white transition-all"
            >
              <LiaLinkedin className="w-4 h-4" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white transition-all"
            >
              <BsInstagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-xs tracking-wider uppercase">Quick Links</h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/" className="hover:text-indigo-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-indigo-400 transition-colors">
                Products
              </Link>
            </li>
            <li>
              <Link href="/employees" className="hover:text-indigo-400 transition-colors">
                Employees
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-indigo-400 transition-colors">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Portals */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-xs tracking-wider uppercase">Portals</h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/auth/login" className="hover:text-indigo-400 transition-colors">
                Retailer Login
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-indigo-400 transition-colors">
                Register Store
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard" className="hover:text-indigo-400 transition-colors">
                Admin Dashboard
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-indigo-400 transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-xs tracking-wider uppercase">Get in Touch</h3>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>Motijheel C/A, Dhaka-1000, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>+880 1700 000000</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>support@rokomary.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* -------------------------------------------------------------
          3. BOTTOM BAR (Copyright & Mobile Padding)
      ------------------------------------------------------------- */}
      <div className="border-t border-slate-800 bg-slate-950/80 py-6 mb-16 md:mb-0">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Rokomary Distribution. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;