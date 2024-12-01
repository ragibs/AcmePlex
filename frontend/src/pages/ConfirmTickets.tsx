import React, { useEffect } from "react";
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
  Loader,
  ChevronLeft,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import usePreventPageRefresh from "../hooks/usePreventPageRefresh";
import PacmanLoader from "react-spinners/PacmanLoader";
import { useMovieContext } from "../context/MovieContext";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generatePaymentConfirmationNumber } from "../utils/generatePaymentConfirmationNumber";
import api from "../api/apiConfig";
import Cookies from "js-cookie";

const guestSchema = z.object({
  email: z.string().email("Invalid email address"),
  cardName: z.string().min(1, "Cardholder name is required"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  cardExpiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry date format (MM/YY)"),
  cardCCV: z.string().regex(/^\d{3}$/, "CCV must be 3 digits"),
});

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type GuestFormData = z.infer<typeof guestSchema>;
type SigninFormData = z.infer<typeof signinSchema>;

export default function ConfirmTickets() {
  const { state, updateState } = useMovieContext();
  const [checkoutMethod, setCheckoutMethod] = React.useState<
    "guest" | "signin"
  >("guest");
  usePreventPageRefresh(
    "Are you sure you want to leave? Your progress may not be saved."
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);

  const [couponCode, setCouponCode] = React.useState("");
  const [couponEmail, setCouponEmail] = React.useState("");

  const [appliedCoupon, setAppliedCoupon] = React.useState<{
    code: string;
    value: number;
  } | null>(null);
  const navigate = useNavigate();

  const {
    register: registerGuest,
    handleSubmit: handleSubmitGuest,
    formState: { errors: errorsGuest },
  } = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
  });

  const {
    register: registerSignin,
    handleSubmit: handleSubmitSignin,
    formState: { errors: errorsSignin },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  useEffect(() => {
    if (!state.moviename || !state.totalprice) {
      setError(
        "It seems you're attempting to access the page without selecting a showtime. Please select a showtime before proceeding."
      );
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
  }, []);

  const handlePrevious = () => {
    navigate(`/seatselection/${state.showtimeId}`);
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

  const onSubmitGuest = async (data: GuestFormData) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      // check if a coupon is applied
      if (appliedCoupon) {
        const couponValidationResponse = await api.get(
          `/coupon/get/${encodeURIComponent(couponEmail)}/${encodeURIComponent(
            appliedCoupon.code
          )}`
        );

        const couponStatus = couponValidationResponse?.data?.couponStatus;
        const couponBalance = parseFloat(
          couponValidationResponse?.data?.couponValue
        );

        // validate coupon
        if (couponStatus !== "active" || !couponBalance || couponBalance <= 0) {
          setFormError(
            "The applied coupon is invalid or has insufficient balance."
          );
          return;
        }

        // convert remaining balance as a double
        const remainingBalance = Math.max(
          couponBalance - state.totalprice,
          0
        ).toFixed(2);

        // redeem the coupon
        const couponRedemptionPayload = {
          email: couponEmail,
          couponCode: appliedCoupon.code,
          couponValue: parseFloat(remainingBalance),
        };

        const redemptionResponse = await api.put(
          "http://localhost:8080/coupon/redeem",
          couponRedemptionPayload
        );

        if (redemptionResponse.status !== 202) {
          setFormError("Failed to redeem the coupon. Please try again.");
          return;
        }
      }

      // reservation creation
      const payload = {
        showtimeID: state.showtimeId,
        seatIDList: state.seatIds,
        userEmail: data.email,
        paymentConfirmation: generatePaymentConfirmationNumber(),
        reservationValue: state.totalprice, // sending total price, not discounted price
      };

      const response = await api.post("/reservation/create", payload);

      if (response.status === 201) {
        navigate(`/bookingconfirmation/${response.data}/${data.email}`);
      } else {
        setFormError("Failed to create a reservation. Please try again.");
      }
    } catch (error: any) {
      if (error.response?.data) {
        setFormError(
          typeof error.response.data === "string"
            ? error.response.data
            : "An error occurred. Please check your input."
        );
      } else {
        setFormError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitSignin: SubmitHandler<SigninFormData> = async (data) => {
    setError(null);
    setIsSubmitting(true);
    const payload = {
      email: data.email,
      password: data.password,
    };
    try {
      const response = await api.post("http://localhost:8080/login", payload);

      if (response.status === 200) {
        Cookies.set("user", JSON.stringify(await response.data));
        navigate(`/signedinpurchase/${data.email}`, {
          state: { from: "/confirmtickets" },
        });
      } else {
        setFormError(
          "Login failed. Please check your credentials and try again."
        );
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

  const applyCoupon = async () => {
    console.log(couponEmail);

    try {
      const response = await api.get(
        `/coupon/get/${encodeURIComponent(couponEmail)}/${encodeURIComponent(
          couponCode
        )}`
      );

      const couponStatus = response.data?.couponStatus;
      const couponValue = response.data?.couponValue;

      if (couponStatus === "active" && couponValue !== undefined) {
        setAppliedCoupon({
          value:
            couponValue > state.totalprice ? state.totalprice : couponValue,
          code: couponCode,
        });
        setFormError("");
      } else {
        setFormError("The coupon is not active.");
        setAppliedCoupon(null);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        setFormError(error.response.data);
      } else {
        setFormError("An unexpected error occurred. Please try again.");
      }
      setAppliedCoupon(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAfterDiscount = appliedCoupon
    ? Math.max(state.totalprice - appliedCoupon.value, 0)
    : state.totalprice;

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
                src={state.poster}
                alt={state.moviename}
                style={{ width: "200px", height: "300px" }}
                className="mx-auto mb-4 rounded-lg"
              />
              <h2 className="text-2xl font-medium mb-4">{state.moviename}</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="text-primary-500 mr-2" size={20} />
                  <span>{state.theatre}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="text-primary-500 mr-2" size={20} />
                  <span>{state.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="text-primary-500 mr-2" size={20} />
                  <span>{state.showtime}</span>
                </div>
                <div>
                  <span className="font-medium">Seats:</span>{" "}
                  {state.seats.join(", ")}
                </div>
                <div>
                  <span className="font-medium">Total Price:</span> $
                  {state.totalprice.toFixed(2)}
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
                  disabled={isSubmitting}
                >
                  Sign In
                </button>
              </div>

              {checkoutMethod === "guest" ? (
                <>
                  <form onSubmit={handleSubmitGuest(onSubmitGuest)}>
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
                          {...registerGuest("email")}
                          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                          disabled={isSubmitting}
                        />
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                      </div>
                      {errorsGuest.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorsGuest.email.message}
                        </p>
                      )}
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
                          {...registerGuest("cardName")}
                          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                          disabled={isSubmitting}
                        />
                        <User
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                      </div>
                      {errorsGuest.cardName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorsGuest.cardName.message}
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
                          {...registerGuest("cardNumber")}
                          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                          disabled={isSubmitting}
                        />
                        <CreditCard
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                      </div>
                      {errorsGuest.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorsGuest.cardNumber.message}
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
                          {...registerGuest("cardExpiry")}
                          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="MM/YY"
                          disabled={isSubmitting}
                        />
                        {errorsGuest.cardExpiry && (
                          <p className="text-red-500 text-sm mt-1">
                            {errorsGuest.cardExpiry.message}
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
                          {...registerGuest("cardCCV")}
                          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          disabled={isSubmitting}
                        />
                        {errorsGuest.cardCCV && (
                          <p className="text-red-500 text-sm mt-1">
                            {errorsGuest.cardCCV.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Coupon Field */}
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
                            disabled={isSubmitting}
                          />
                          <Tag
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                          />
                        </div>
                        <div className="relative flex-grow">
                          <input
                            type="text"
                            id="couponEmail"
                            value={couponEmail}
                            onChange={(e) => setCouponEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                            placeholder="Enter coupon email"
                            disabled={isSubmitting}
                          />
                          <Mail
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={applyCoupon}
                          className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                          disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader className="animate-spin mr-2" size={20} />
                      ) : (
                        "Complete Purchase"
                      )}
                    </button>
                  </form>
                  {formError && (
                    <div className=" text-red-500 text-center py-2 px-4 rounded-md mb-4">
                      {formError}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <form onSubmit={handleSubmitSignin(onSubmitSignin)}>
                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                      >
                        email
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="email"
                          {...registerSignin("email")}
                          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                          disabled={isSubmitting}
                        />
                        <User
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                      </div>
                      {errorsSignin.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorsSignin.email.message}
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
                          {...registerSignin("password")}
                          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                          disabled={isSubmitting}
                        />
                        <Lock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                      </div>
                      {errorsSignin.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errorsSignin.password.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                      disabled={isSubmitting}
                    >
                      Sign In and Purchase
                    </button>
                    <p className="mt-4 text-center text-sm">
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        state={{ from: "/confirmtickets" }}
                        className="text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        Click here to register
                      </Link>
                    </p>
                  </form>
                  {formError && (
                    <div className=" text-red-500 text-center py-2 px-4 rounded-md mb-4">
                      {formError}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      {/* Change Seats Button */}
      <motion.div
        className="fixed bottom-8 left-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-colors flex items-center md:w-auto md:h-auto w-12 h-12 justify-center"
          onClick={handlePrevious}
          disabled={isSubmitting}
        >
          <ChevronLeft className="md:mr-2" size={20} />
          <span className="hidden md:inline">Change Seats</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
