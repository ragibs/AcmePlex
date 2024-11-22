"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Mail,
  User,
  ChevronDown,
  ChevronUp,
  Tag,
} from "lucide-react";

// Mock data for selected movie and showtime
const selectedMovie = {
  title: "Inception",
  poster: "/placeholder.svg?height=300&width=200",
  theater: "Cineplex Downtown",
  date: "2023-05-20",
  time: "7:30 PM",
  seats: ["A1", "A2", "A3"],
  totalPrice: 30.0,
};

// Mock data for user and payment method
const user = {
  email: "user@example.com",
  paymentMethod: { id: 1, last4: "1234", expiry: "12/24", type: "Visa" },
};

export default function SignedInPurchase() {
  const [useSavedPayment, setUseSavedPayment] = useState(true);
  const [newCardName, setNewCardName] = useState("");
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardCCV, setNewCardCCV] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    value: number;
  } | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Purchase submitted");
  };

  const togglePaymentMethod = () => {
    setUseSavedPayment(!useSavedPayment);
  };

  const applyCoupon = () => {
    // Mock coupon validation logic
    if (couponCode === "DISCOUNT10") {
      setAppliedCoupon({ code: couponCode, value: 10 });
    } else {
      alert("Invalid coupon code");
    }
    setCouponCode("");
  };

  const totalAfterDiscount = appliedCoupon
    ? Math.max(selectedMovie.totalPrice - appliedCoupon.value, 0)
    : selectedMovie.totalPrice;

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl font-light mb-8 text-center"
          variants={itemVariants}
        >
          Complete Your Purchase
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Movie and Showtime Information */}
          <motion.div className="lg:w-1/3" variants={itemVariants}>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <img
                src={selectedMovie.poster}
                alt={selectedMovie.title}
                width="200"
                height="300"
                className="mx-auto mb-4 rounded-lg"
              />
              <h2 className="text-2xl font-medium mb-4">
                {selectedMovie.title}
              </h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="text-primary-500 mr-2" size={20} />
                  <span>{selectedMovie.theater}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="text-primary-500 mr-2" size={20} />
                  <span>{selectedMovie.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="text-primary-500 mr-2" size={20} />
                  <span>{selectedMovie.time}</span>
                </div>
                <div>
                  <span className="font-medium">Seats:</span>{" "}
                  {selectedMovie.seats.join(", ")}
                </div>
                <div>
                  <span className="font-medium">Total Price:</span> $
                  {selectedMovie.totalPrice.toFixed(2)}
                </div>
                {appliedCoupon && (
                  <div className="text-primary-400">
                    <span className="font-medium">Discount:</span> -$
                    {appliedCoupon.value.toFixed(2)}
                  </div>
                )}
                <div className="text-xl font-bold">
                  <span>Final Price:</span> ${totalAfterDiscount.toFixed(2)}
                </div>
              </div>
            </div>
          </motion.div>

          {/* User Information and Payment */}
          <motion.div className="lg:w-2/3" variants={itemVariants}>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={user.email}
                      className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                      disabled
                    />
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Payment Method
                  </label>
                  <div
                    className={`${
                      useSavedPayment ? "" : "opacity-50 pointer-events-none"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                        useSavedPayment ? "bg-primary-500" : "bg-gray-700"
                      }`}
                      onClick={togglePaymentMethod}
                    >
                      <div className="flex items-center">
                        <CreditCard className="mr-3" size={20} />
                        <span>
                          {user.paymentMethod.type} ending in{" "}
                          {user.paymentMethod.last4}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">
                          {user.paymentMethod.expiry}
                        </span>
                        {useSavedPayment && (
                          <span className="text-xs bg-primary-600 px-2 py-1 rounded-full">
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <button
                    type="button"
                    className="text-primary-400 hover:text-primary-300 transition-colors flex items-center"
                    onClick={togglePaymentMethod}
                  >
                    {useSavedPayment ? (
                      <ChevronDown size={20} className="mr-2" />
                    ) : (
                      <ChevronUp size={20} className="mr-2" />
                    )}
                    {useSavedPayment
                      ? "Use a different card"
                      : "Use saved payment method"}
                  </button>
                </div>

                <div
                  className={`mb-6 space-y-4 ${
                    useSavedPayment ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div>
                    <label
                      htmlFor="newCardName"
                      className="block text-sm font-medium mb-2"
                    >
                      Name on Card
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="newCardName"
                        value={newCardName}
                        onChange={(e) => setNewCardName(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                        required
                      />
                      <User
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="newCardNumber"
                      className="block text-sm font-medium mb-2"
                    >
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="newCardNumber"
                        value={newCardNumber}
                        onChange={(e) => setNewCardNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                        required
                      />
                      <CreditCard
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <label
                        htmlFor="newCardExpiry"
                        className="block text-sm font-medium mb-2"
                      >
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="newCardExpiry"
                        value={newCardExpiry}
                        onChange={(e) => setNewCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="newCardCCV"
                        className="block text-sm font-medium mb-2"
                      >
                        CCV
                      </label>
                      <input
                        type="text"
                        id="newCardCCV"
                        value={newCardCCV}
                        onChange={(e) => setNewCardCCV(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="couponCode"
                    className="block text-sm font-medium mb-2"
                  >
                    Coupon Code
                  </label>
                  <div className="flex space-x-2">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        id="couponCode"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                        placeholder="Enter coupon code"
                      />
                      <Tag
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedCoupon && (
                    <p className="mt-2 text-sm text-primary-400">
                      Coupon {appliedCoupon.code} applied: $
                      {appliedCoupon.value} off
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                >
                  Complete Purchase
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
