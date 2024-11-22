import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CreditCard, ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function CheckBalance() {
  const [email, setEmail] = useState("");
  const [creditCode, setCreditCode] = useState("");
  const [balance, setBalance] = useState<number | null>(null);

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
    // Mock API call to check balance
    // In a real application, you would make an API call here
    const mockBalance = Math.floor(Math.random() * 100) + 1;
    setBalance(mockBalance);
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Link
        to="/"
        className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
      >
        <X className="text-white" size={24} />
      </Link>

      <div className="max-w-md mx-auto">
        <motion.div
          variants={itemVariants}
          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-2xl font-light text-center mb-2">
              Check Your Balance
            </h2>
            <p className="text-center text-gray-400 mb-6">
              Enter your AcmeCredit code and email to view your remaining
              balance
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="creditCode"
                  className="block text-sm font-medium mb-2"
                >
                  AcmeCredit Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="creditCode"
                    value={creditCode}
                    onChange={(e) => setCreditCode(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                    required
                  />
                  <CreditCard
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
              </div>
              <div>
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
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                    required
                  />
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center"
              >
                Check Balance
                <ArrowRight className="ml-2" size={20} />
              </button>
            </form>

            {balance !== null && (
              <motion.div
                className="mt-6 p-4 bg-gray-700 rounded-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg font-medium mb-2">Your Balance</h3>
                <p className="text-2xl font-bold text-primary-500">
                  ${balance.toFixed(2)}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
