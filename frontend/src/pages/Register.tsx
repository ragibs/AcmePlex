"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, CreditCard, Calendar, User, Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardCCV, setCardCCV] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    setExpiryDate(oneYearFromNow.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    const isValid =
      email !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword &&
      acceptTerms &&
      cardHolder !== "" &&
      cardNumber !== "" &&
      cardCCV !== "" &&
      cardExpiry !== "";
    setIsFormValid(isValid);
  }, [
    email,
    password,
    confirmPassword,
    acceptTerms,
    cardHolder,
    cardNumber,
    cardCCV,
    cardExpiry,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      console.log("Form submitted");
      // Handle form submission logic here
    }
  };

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

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-md mx-auto">
        <motion.h1
          className="text-4xl font-light mb-8 text-center"
          variants={itemVariants}
        >
          Create Your Account
        </motion.h1>
        <motion.div
          className="bg-gray-800 rounded-lg p-8 shadow-lg"
          variants={itemVariants}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
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
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                  required
                />
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-primary-500"
                  required
                />
                <span className="ml-2 text-sm">
                  I accept the terms and agree to pay $20 for a one-year
                  membership
                </span>
              </label>
            </div>
            <div className="mb-4">
              <label
                htmlFor="expiryDate"
                className="block text-sm font-medium mb-2"
              >
                Membership Expiry Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="expiryDate"
                  value={expiryDate}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                  disabled
                />
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="cardHolder"
                className="block text-sm font-medium mb-2"
              >
                Name on Card
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cardHolder"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
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
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-primary-500"
                />
                <span className="ml-2 text-sm">
                  Save this as my preferred payment method
                </span>
              </label>
            </div>
            <div className="flex justify-between">
              <Link
                to="/"
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className={`bg-primary-500 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center ${
                  isFormValid
                    ? "hover:bg-primary-600"
                    : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!isFormValid}
              >
                Sign Up
                <Check className="ml-2" size={20} />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
