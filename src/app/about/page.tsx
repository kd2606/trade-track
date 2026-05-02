"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Shield, Zap, Users, Star } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg mx-auto mb-4">
            <TrendingUp size={32} />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">About TradeTrack</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your comprehensive business management solution designed for small to medium enterprises, shopkeepers, and service providers.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            TradeTrack is dedicated to democratizing professional business management by providing enterprise-grade tools in an intuitive, affordable package. We believe every business owner deserves access to powerful analytics and management capabilities, regardless of their technical expertise or budget.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Our platform helps businesses make data-driven decisions, streamline operations, and achieve sustainable growth through comprehensive tracking and analysis tools.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="text-emerald-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Advanced Analytics</h3>
            <p className="text-slate-600">
              Multi-dimensional reporting with daily, weekly, monthly, and yearly insights. Track product performance, profit margins, and growth trends.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Secure & Reliable</h3>
            <p className="text-slate-600">
              Enterprise-grade security with encrypted data storage, user authentication, and regular backups to keep your business data safe.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="text-purple-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Easy to Use</h3>
            <p className="text-slate-600">
              Intuitive interface designed for business owners. No technical expertise required - start tracking your business in minutes.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-orange-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Built for Businesses</h3>
            <p className="text-slate-600">
              Specifically designed for shopkeepers, service providers, and small manufacturers with features tailored to your needs.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Star className="text-emerald-500 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-slate-900">Real-time Sales Tracking</h4>
                <p className="text-slate-600 text-sm">Record sales instantly with profit calculations</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="text-emerald-500 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-slate-900">Inventory Management</h4>
                <p className="text-slate-600 text-sm">Track stock levels and product performance</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="text-emerald-500 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-slate-900">Budget Management</h4>
                <p className="text-slate-600 text-sm">Plan and monitor operational budgets</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="text-emerald-500 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-slate-900">Tax Reporting</h4>
                <p className="text-slate-600 text-sm">Comprehensive tax calculations and reports</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="text-emerald-500 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-slate-900">Invoice Generation</h4>
                <p className="text-slate-600 text-sm">Professional PDF invoices for clients</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="text-emerald-500 mt-1" size={20} />
              <div>
                <h4 className="font-semibold text-slate-900">Data Export</h4>
                <p className="text-slate-600 text-sm">Export data to CSV/Excel for analysis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-slate-300 mb-6">
            Have questions, feedback, or need support? We're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:dewangankrrish50@gmail.com"
              className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              Contact Support
            </a>
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-slate-900 transition-colors"
            >
              Visit Contact Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
