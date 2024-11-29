import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  reservationNumber: z.string().min(1, "Reservation number is required"),
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof formSchema>;

export default function GetReservation() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

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

  const onSubmit = (data: FormData) => {
    navigate(`/managereservation/${data.reservationNumber}/${data.email}`);
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
            Manage Your Reservation
          </motion.h1>
          <p className="text-center text-gray-400 mb-6">
            Enter your reservation number and email to view your reservation
            details.{" "}
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                {...register("reservationNumber")}
                className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.reservationNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.reservationNumber.message}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
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
                <span className="loader"></span>
              ) : (
                <>
                  Find Reservation
                  <ChevronRight className="ml-2" size={20} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
