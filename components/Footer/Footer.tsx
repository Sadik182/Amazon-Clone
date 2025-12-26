"use client";
import React from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-amazon-light text-gray-300">
      {/* Back to top button */}
      <div
        onClick={scrollToTop}
        className="bg-amazon-blue py-4 text-center text-sm cursor-pointer hover:bg-opacity-90 transition-colors"
      >
        <p>Back to top</p>
      </div>

      {/* Main footer content */}
      <div className="max-w-screen-2xl mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Get to Know Us */}
          <div>
            <h3 className="text-white font-bold mb-3 text-sm">
              Get to Know Us
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="link">Careers</li>
              <li className="link">Blog</li>
              <li className="link">About Amazon</li>
              <li className="link">Investor Relations</li>
              <li className="link">Amazon Devices</li>
              <li className="link">Amazon Science</li>
            </ul>
          </div>

          {/* Make Money with Us */}
          <div>
            <h3 className="text-white font-bold mb-3 text-sm">
              Make Money with Us
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="link">Sell products on Amazon</li>
              <li className="link">Sell on Amazon Business</li>
              <li className="link">Sell apps on Amazon</li>
              <li className="link">Become an Affiliate</li>
              <li className="link">Advertise Your Products</li>
              <li className="link">Self-Publish with Us</li>
              <li className="link">Host an Amazon Hub</li>
            </ul>
          </div>

          {/* Amazon Payment Products */}
          <div>
            <h3 className="text-white font-bold mb-3 text-sm">
              Amazon Payment Products
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="link">Amazon Business Card</li>
              <li className="link">Shop with Points</li>
              <li className="link">Reload Your Balance</li>
              <li className="link">Amazon Currency Converter</li>
            </ul>
          </div>

          {/* Need Help? */}
          <div>
            <h3 className="text-white font-bold mb-3 text-sm">Need Help?</h3>
            <ul className="space-y-2 text-xs">
              <li className="link">COVID-19 and Amazon</li>
              <li className="link">Your Account</li>
              <li className="link">Your Orders</li>
              <li className="link">Shipping Rates & Policies</li>
              <li className="link">Returns & Replacements</li>
              <li className="link">Manage Your Content and Devices</li>
              <li className="link">Amazon Assistant</li>
              <li className="link">Help</li>
            </ul>
          </div>
        </div>

        {/* Logo and language selector */}
        <div className="mt-8 pt-8 border-t border-gray-600">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src="https://links.papareact.com/f90"
                alt="Amazon Logo"
                className="h-6 w-auto object-contain"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <span className="link">English</span>
              <span className="link">$ USD - U.S. Dollar</span>
              <span className="link">United States</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="bg-amazon-blue py-6">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 text-xs">
            <span className="link">Amazon.com, Inc. or its affiliates</span>
            <span className="link">Conditions of Use</span>
            <span className="link">Privacy Notice</span>
            <span className="link">Your Ads Privacy Choices</span>
          </div>
          <p className="text-center text-xs mt-4 text-gray-400">
            © 1996-{new Date().getFullYear()}, Amazon.com, Inc. or its
            affiliates
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
