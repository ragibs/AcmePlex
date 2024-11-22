import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GetReservation() {
  const [reservationNumber, setReservationNumber] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

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
    navigate("/managereservation");
    // Handle form submission logic here
    console.log("Form submitted:", { reservationNumber, email });
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="w-full max-w-md">
        <motion.h1
          className="text-4xl font-light mb-8 text-center"
          variants={itemVariants}
        >
          Manage Your Reservation
        </motion.h1>

        <motion.div
          className="bg-gray-800 rounded-lg p-8 shadow-lg"
          variants={itemVariants}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="reservationNumber"
                className="block text-sm font-medium mb-2"
              >
                Reservation Number
              </label>
              <input
                type="text"
                id="reservationNumber"
                value={reservationNumber}
                onChange={(e) => setReservationNumber(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center"
            >
              Find Reservation
              <ChevronRight className="ml-2" size={20} />
            </button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
