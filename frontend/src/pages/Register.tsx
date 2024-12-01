import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  CreditCard,
  Calendar,
  User,
  Check,
  Loader,
  X,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../api/apiConfig";
import { useMovieContext } from "../context/MovieContext";
import PacmanLoader from "react-spinners/PacmanLoader";
import usePreventPageRefresh from "../hooks/usePreventPageRefresh";

const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    name: z.string().min(1, "Name is required"),
    cardHolder: z.string().min(1, "Cardholder name is required"),
    cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
    cardExpiry: z
      .string()
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry date format (MM/YY)"),
    cardCCV: z.string().regex(/^\d{3}$/, "CCV must be 3 digits"),
    acceptTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must accept the terms and conditions"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();

  const [expiryDate, setExpiryDate] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });
  const { state } = useMovieContext();

  const acceptTerms = watch("acceptTerms");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  usePreventPageRefresh(
    "Are you sure you want to leave? Your progress may not be saved."
  );

  useEffect(() => {
    if (
      !location.state ||
      location.state.from !== "/confirmtickets" ||
      !state.moviename
    ) {
      setError(
        "It seems you’re attempting to access the page without selecting a showtime. Please select a showtime before proceeding."
      );
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    setExpiryDate(oneYearFromNow.toISOString().split("T")[0]);
  }, [location, navigate]);

  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [registrationSuccess, setRegistrationSuccess] = React.useState(false);
  const [countdown, setCountdown] = React.useState(5);

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setIsSubmitting(true);
    const userRegistrationPayload = {
      registeredUser: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      paymentInfo: {
        cardHolder: data.cardHolder,
        cardNumber: data.cardNumber,
        cvv: data.cardCCV,
        expiryDate: data.cardExpiry,
      },
    };

    try {
      const registerResponse = await api.post(
        "/register/registereduser",
        userRegistrationPayload
      );

      if (registerResponse.status === 201) {
        setRegistrationSuccess(true);

        let timer = 5;
        const countdownInterval = setInterval(() => {
          timer -= 1;
          setCountdown(timer);
          if (timer === 0) {
            clearInterval(countdownInterval);
            navigate("/confirmtickets");
          }
        }, 1000);
      } else {
        console.warn(
          "Registration failed with status:",
          registerResponse.status
        );
        setFormError("Registration failed. Please try again.");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        setFormError(error.response.data);
      } else {
        setFormError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
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

  if (registrationSuccess) {
    return (
      <motion.div
        className="min-h-screen bg-gray-900 text-white flex items-center justify-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="text-center">
          <motion.h1
            className="text-4xl font-bold mb-4"
            variants={itemVariants}
          >
            Registration Successful!
          </motion.h1>
          <motion.p className="text-xl mb-4" variants={itemVariants}>
            Redirecting to login page in {countdown} seconds...
          </motion.p>
        </div>
      </motion.div>
    );
  }

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
      <Link
        to="/"
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        <X size={24} />
      </Link>
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                  disabled={isSubmitting}
                />
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                  disabled={isSubmitting}
                />
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
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
                  {...register("password")}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                  disabled={isSubmitting}
                />
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
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
                  {...register("confirmPassword")}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                  disabled={isSubmitting}
                />
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("acceptTerms")}
                  className="form-checkbox h-5 w-5 text-primary-500"
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-sm">
                  I accept the terms and agree to pay $20 for a one-year
                  membership. The payment information provided below will be
                  saved as my default payment method for future transactions.
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.acceptTerms.message}
                </p>
              )}
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
                  {...register("cardHolder")}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                  disabled={isSubmitting}
                />
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
              {errors.cardHolder && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.cardHolder.message}
                </p>
              )}
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
                  {...register("cardNumber")}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                  disabled={isSubmitting}
                />
                <CreditCard
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.cardNumber.message}
                </p>
              )}
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
                  {...register("cardExpiry")}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="MM/YY"
                  disabled={isSubmitting}
                />
                {errors.cardExpiry && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.cardExpiry.message}
                  </p>
                )}
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
                  {...register("cardCCV")}
                  className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isSubmitting}
                />
                {errors.cardCCV && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.cardCCV.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Link
                to="/confirmtickets"
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                <button disabled={isSubmitting}>Cancel</button>
              </Link>
              <button
                type="submit"
                className={`bg-primary-500 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center ${
                  isValid && acceptTerms
                    ? "hover:bg-primary-600"
                    : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!isValid || !acceptTerms || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin mr-2" size={20} />
                    Loading...
                  </>
                ) : (
                  <>
                    Sign Up
                    <Check className="ml-2" size={20} />
                  </>
                )}
              </button>
            </div>
          </form>
          {formError && (
            <div className="text-red-500 text-center py-2 px-4 rounded-md mb-4">
              {formError}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
