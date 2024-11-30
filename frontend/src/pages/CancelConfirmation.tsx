import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, Gift } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import api from "../api/apiConfig";
import PacmanLoader from "react-spinners/PacmanLoader";

export default function CancelConfirmation() {
  const { email, reservationId } = useParams();
  const currentDate = new Date();
  const expirationDate = new Date(
    currentDate.setFullYear(currentDate.getFullYear() + 1)
  );

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

  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const cancelReservation = async () => {
      try {
        setIsLoading(true);
        const response = await api.put(`/reservation/cancel/${reservationId}`);
        if (response.status === 200) {
          setCouponCode(response.data);
        } else {
          setError("Failed to cancel the reservation. Please try again.");
        }
      } catch (err) {
        setError("An error occurred while canceling the reservation.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (reservationId) {
      cancelReservation();
    }
  }, [reservationId, email]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <PacmanLoader color="#0891b2" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-lg text-gray-400 mb-6">{error}</p>
        <p className="text-sm text-gray-500">
          Redirecting to the homepage in 5 seconds...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="bg-gray-800 rounded-lg p-8 shadow-lg text-center"
          variants={itemVariants}
        >
          <CheckCircle className="mx-auto mb-6 text-primary-500" size={64} />
          <motion.h1
            className="text-4xl font-light mb-6"
            variants={itemVariants}
          >
            Reservation Cancelled
          </motion.h1>
          <motion.p className="text-xl mb-6" variants={itemVariants}>
            Your reservation has been successfully cancelled.
          </motion.p>
          <motion.div
            className="bg-gray-700 rounded-lg p-6 mb-6"
            variants={itemVariants}
          >
            <p className="flex items-center justify-center mb-4">
              <Mail className="mr-2 text-primary-500" size={20} />
              We will send a confirmation email to:
            </p>
            <p className="text-lg font-semibold">{email}</p>
          </motion.div>

          <motion.div
            className="bg-gray-700 rounded-lg p-6 mb-8"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center mb-4">
              <Gift className="mr-2 text-primary-500" size={20} />
              <p className="text-lg font-semibold">
                You can apply this coupon to use your refund credit:{" "}
              </p>
            </div>
            <p className="text-2xl font-bold text-primary-500 mb-2">
              {couponCode}
            </p>
            <p className="text-sm text-gray-400">
              This coupon will expire on {expirationDate.toLocaleDateString()}
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link
              to="/"
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-6 rounded-md transition-colors inline-block"
            >
              Return to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
