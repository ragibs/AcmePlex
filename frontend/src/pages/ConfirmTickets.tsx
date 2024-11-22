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
  Lock,
  Tag,
} from "lucide-react";
import { Link } from "react-router-dom";

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

export default function ConfirmTickets() {
  const [checkoutMethod, setCheckoutMethod] = useState<"guest" | "signin">(
    "guest"
  );
  const [email, setEmail] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCCV, setCardCCV] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    console.log("Form submitted");
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
          Confirm Your Tickets
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Movie and Showtime Information */}
          <motion.div className="lg:w-1/3" variants={itemVariants}>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <img
                src={selectedMovie.poster}
                alt={selectedMovie.title}
                style={{ width: "200px", height: "300px" }}
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

          {/* Checkout Form */}
          <motion.div className="lg:w-2/3" variants={itemVariants}>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <div className="mb-6 flex justify-center space-x-4">
                <button
                  onClick={() => setCheckoutMethod("guest")}
                  className={`py-2 px-4 rounded-md transition-colors ${
                    checkoutMethod === "guest"
                      ? "bg-primary-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  Guest Checkout
                </button>
                <button
                  onClick={() => setCheckoutMethod("signin")}
                  className={`py-2 px-4 rounded-md transition-colors ${
                    checkoutMethod === "signin"
                      ? "bg-primary-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  Sign In
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {checkoutMethod === "guest" ? (
                  <>
                    <div className="mb-4">
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                          required
                        />
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="cardName"
                        className="block text-sm font-medium mb-2"
                      >
                        Name on Card
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="cardName"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                          required
                        />
                        <User
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="cardNumber"
                        className="block text-sm font-medium mb-2"
                      >
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="cardNumber"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                          required
                        />
                        <CreditCard
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                      </div>
                    </div>
                    <div className="flex mb-4 space-x-4">
                      <div className="w-1/2">
                        <label
                          htmlFor="cardExpiry"
                          className="block text-sm font-medium mb-2"
                        >
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="cardExpiry"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="w-1/2">
                        <label
                          htmlFor="cardCCV"
                          className="block text-sm font-medium mb-2"
                        >
                          CCV
                        </label>
                        <input
                          type="text"
                          id="cardCCV"
                          value={cardCCV}
                          onChange={(e) => setCardCCV(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium mb-2"
                      >
                        Username
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                          required
                        />
                        <User
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium mb-2"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                          required
                        />
                        <Lock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                      </div>
                    </div>
                  </>
                )}
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
                  {checkoutMethod === "guest"
                    ? "Complete Purchase"
                    : "Sign In and Purchase"}
                </button>
                {checkoutMethod === "signin" && (
                  <p className="mt-4 text-center text-sm">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      Click here to register
                    </Link>
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
