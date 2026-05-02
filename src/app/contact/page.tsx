"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MessageSquare, Clock, MapPin } from "lucide-react";

export default function ContactPage() {
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
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We're here to help you succeed with TradeTrack. Reach out for support, feedback, or any questions.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Email Support */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Mail className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Email Support</h3>
            <p className="text-slate-600 mb-4">
              Get in touch via email for any questions, technical support, or feedback.
            </p>
            <a 
              href="mailto:dewangankrrish50@gmail.com"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              dewangankrrish50@gmail.com
              <Mail size={16} />
            </a>
          </div>

          {/* Response Time */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="text-emerald-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Response Time</h3>
            <p className="text-slate-600 mb-4">
              We typically respond within 24 hours during business days.
            </p>
            <div className="text-sm text-slate-500">
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>

        {/* Support Categories */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How Can We Help?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <MessageSquare className="text-blue-600 mb-2" size={20} />
              <h4 className="font-semibold text-slate-900 mb-2">Technical Support</h4>
              <p className="text-slate-600 text-sm mb-2">
                Issues with features, bugs, or technical questions
              </p>
              <a href="mailto:dewangankrrish50@gmail.com?subject=Technical Support" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Report Issue →
              </a>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 hover:border-emerald-300 transition-colors">
              <Phone className="text-emerald-600 mb-2" size={20} />
              <h4 className="font-semibold text-slate-900 mb-2">Feature Requests</h4>
              <p className="text-slate-600 text-sm mb-2">
                Suggestions for new features or improvements
              </p>
              <a href="mailto:dewangankrrish50@gmail.com?subject=Feature Request" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                Suggest Feature →
              </a>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
              <Mail className="text-purple-600 mb-2" size={20} />
              <h4 className="font-semibold text-slate-900 mb-2">General Inquiries</h4>
              <p className="text-slate-600 text-sm mb-2">
                Questions about pricing, partnerships, or general information
              </p>
              <a href="mailto:dewangankrrish50@gmail.com?subject=General Inquiry" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                Ask Question →
              </a>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
              <MapPin className="text-orange-600 mb-2" size={20} />
              <h4 className="font-semibold text-slate-900 mb-2">Feedback</h4>
              <p className="text-slate-600 text-sm mb-2">
                Share your experience and help us improve TradeTrack
              </p>
              <a href="mailto:dewangankrrish50@gmail.com?subject=Feedback" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                Share Feedback →
              </a>
            </div>
          </div>
        </div>

        {/* Quick Contact */}
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Quick Contact</h2>
          <p className="text-blue-100 mb-6">
            For immediate assistance, click below to send us an email directly.
          </p>
          <a 
            href="mailto:dewangankrrish50@gmail.com"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-lg"
          >
            <Mail size={20} />
            Send Email Now
          </a>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">How do I get started with TradeTrack?</h4>
              <p className="text-slate-600">
                Simply sign up with your Google account and start adding your sales and expenses. The dashboard will automatically calculate your profit and provide insights.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Is my data secure?</h4>
              <p className="text-slate-600">
                Yes! We use industry-standard encryption and secure authentication to protect your business data. All data is stored securely and backed up regularly.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Can I export my data?</h4>
              <p className="text-slate-600">
                Yes, you can export all your transaction data to CSV or Excel format at any time from the reports section.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Do you offer mobile apps?</h4>
              <p className="text-slate-600">
                TradeTrack is currently web-based and works perfectly on mobile browsers. Native mobile apps are coming soon!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
