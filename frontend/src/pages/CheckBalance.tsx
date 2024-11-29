import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CreditCard, ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../api/apiConfig";

const checkBalanceSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  creditCode: z.string().min(6, "AcmeCredit Code is required"),
});

type CheckBalanceFormData = z.infer<typeof checkBalanceSchema>;

export default function CheckBalance() {
  const [balance, setBalance] = useState<number | null>(null);
  const [couponStatus, setCouponStatus] = useState<string | null>(null);

  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckBalanceFormData>({
    resolver: zodResolver(checkBalanceSchema),
  });

  const onSubmit = async (data: CheckBalanceFormData) => {
    setIsSubmitting(true);

    const { email, creditCode } = data;

    try {
      const response = await api.get(
        `/coupon/get/${encodeURIComponent(email)}/${encodeURIComponent(
          creditCode
        )}`
      );
      setBalance(response.data.couponValue);
      setCouponStatus(response.data.couponStatus);
      setIsSubmitting(false);
    } catch (error: any) {
      if (error.response) {
        setFormError(error.response.data);
        setIsSubmitting(false);
      } else {
        setFormError(error.message);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="w-full max-w-md">
        <motion.div
          className="bg-gray-800 rounded-lg p-8 shadow-lg relative"
          variants={itemVariants}
        >
          <Link
            to="/"
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X size={24} />
          </Link>
          <motion.h1
            className="text-4xl font-light mb-8 text-center"
            variants={itemVariants}
          >
            Check your balance{" "}
          </motion.h1>
          <p className="text-center text-gray-400 mb-6">
            Enter your AcmeCredit code and email to view your remaining balance
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  {...register("creditCode")}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                  disabled={isSubmitting}
                />
                <CreditCard
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
              {errors.creditCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.creditCode.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                  disabled={isSubmitting}
                />
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></span>
                  Checking...
                </div>
              ) : (
                <>
                  Check Balance
                  <ArrowRight className="ml-2" size={20} />
                </>
              )}
            </button>
          </form>
          {formError && (
            <div className="text-red-500 text-center py-2 px-4 rounded-md mb-4">
              {formError}
            </div>
          )}

          {balance !== null && (
            <motion.div
              className="mt-6 p-4 bg-gray-700 rounded-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-medium mb-2">Your Balance is:</h3>
              <p className="text-2xl font-bold text-primary-500">
                ${balance.toFixed(2)}
              </p>

              {couponStatus && (
                <div className="mt-4">
                  <h4 className="text-lg font-medium">Coupon Status:</h4>
                  <span
                    className={`text-lg font-bold ${
                      couponStatus === "active"
                        ? "text-green-500"
                        : couponStatus === "expired"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {couponStatus.charAt(0).toUpperCase() +
                      couponStatus.slice(1)}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
