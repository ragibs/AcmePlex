"use client";

import React from "react";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
export default function NotFound() {
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
      className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-md w-full space-y-8 text-center">
        <motion.div variants={itemVariants}>
          <AlertTriangle className="mx-auto h-24 w-24 text-yellow-500" />
          <h1 className="mt-6 text-4xl font-light">Page Not Found</h1>
          <p className="mt-2 text-xl text-gray-400">
            Oops! The page you're looking for doesn't exist.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <p className="text-lg text-gray-300">
            It seems you've ventured into uncharted territory. Let's get you
            back on track!
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 transition-colors duration-150"
          >
            <Home className="mr-2" size={20} />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
