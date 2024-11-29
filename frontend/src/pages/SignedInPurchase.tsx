"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Mail,
  User,
  ChevronDown,
  ChevronUp,
  Tag,
  Cookie,
  Loader,
} from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { generatePaymentConfirmationNumber } from "../utils/generatePaymentConfirmationNumber";
import usePreventPageRefresh from "../hooks/usePreventPageRefresh";
import { useMovieContext } from "../context/MovieContext";
import api from "../api/apiConfig";
import PacmanLoader from "react-spinners/PacmanLoader";
import Cookies from "js-cookie";
import { PaymentInfo } from "../types";

export default function SignedInPurchase() {
  const [useSavedPayment, setUseSavedPayment] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  const [newCardName, setNewCardName] = useState("");
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardCCV, setNewCardCCV] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    value: number;
  } | null>(null);
  const [couponEmail, setCouponEmail] = React.useState("");

  const { email } = useParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);
  const { state } = useMovieContext();
  const navigate = useNavigate();
  const location = useLocation();
  usePreventPageRefresh(
    "Are you sure you want to leave? Your progress may not be saved."
  );

  useEffect(() => {
    if (
      !location.state ||
      location.state.from !== "/confirmtickets" ||
      !state.moviename ||
      !Cookies.get("user") ||
      null
    ) {
      setError(
        "It seems you're attempting to access the page without selecting a showtime. Please select a showtime before proceeding."
      );
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } else {
      fetchPaymentInfo(email);
    }
  }, [location, navigate]);

  const fetchPaymentInfo = async (email: string | undefined) => {
    try {
      const token = Cookies.get("user");
      const cleanToken = token?.replace(/^"|"$/g, "");
      if (!token) {
        throw new Error("User token is missing");
      }
      console.log(token);
      const response = await api.get(`/payment/${email}`, {
        headers: {
          Authorization: `Bearer ${cleanToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setPaymentInfo(response.data);
      } else {
        console.error("Failed to fetch payment info:", response.status);
      }
    } catch (error) {
      console.error("Error fetching payment info:", error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        userEmail: email,
        paymentConfirmation: generatePaymentConfirmationNumber(),
        reservationValue: state.totalprice, // sending total price, not discounted price
      };

      const response = await api.post("/reservation/create", payload);

      if (response.status === 201) {
        navigate(`/bookingconfirmation/${response.data}/${email}`);
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

  const togglePaymentMethod = () => {
    setUseSavedPayment(!useSavedPayment);
  };

  const applyCoupon = async () => {
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
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl font-light mb-8 text-center"
          variants={itemVariants}
        >
          Complete Your Purchase
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Movie and Showtime Information */}
          <motion.div className="lg:w-1/3" variants={itemVariants}>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <img
                src={state.poster}
                alt={state.moviename}
                width="200"
                height="300"
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
                    <span className="font-medium">Credit:</span> -$
                    {appliedCoupon.value.toFixed(2)}
                  </div>
                )}
                <div className="text-xl font-bold">
                  <span>Final Price:</span> ${totalAfterDiscount.toFixed(2)}
                </div>
              </div>
            </div>
          </motion.div>

          {/* User Information and Payment */}
          <motion.div className="lg:w-2/3" variants={itemVariants}>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
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
                      className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                      disabled
                    />
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Payment Method
                  </label>
                  <div
                    className={`${
                      useSavedPayment ? "" : "opacity-50 pointer-events-none"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                        useSavedPayment ? "bg-primary-500" : "bg-gray-700"
                      }`}
                      onClick={togglePaymentMethod}
                    >
                      <div className="flex items-center">
                        <CreditCard className="mr-3" size={20} />
                        <span>
                          Credit ending in {paymentInfo?.cardNumber.slice(12)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">{paymentInfo?.expiryDate}</span>
                        {useSavedPayment && (
                          <span className="text-xs bg-primary-600 px-2 py-1 rounded-full">
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <button
                    type="button"
                    className="text-primary-400 hover:text-primary-300 transition-colors flex items-center"
                    onClick={togglePaymentMethod}
                  >
                    {useSavedPayment ? (
                      <ChevronDown size={20} className="mr-2" />
                    ) : (
                      <ChevronUp size={20} className="mr-2" />
                    )}
                    {useSavedPayment
                      ? "Use a different card"
                      : "Use saved payment method"}
                  </button>
                </div>

                <div
                  className={`mb-6 space-y-4 ${
                    useSavedPayment ? "opacity-50 pointer-events-none " : ""
                  }`}
                >
                  <div>
                    <label
                      htmlFor="newCardName"
                      className="block text-sm font-medium mb-2"
                    >
                      Name on Card
                    </label>
                    <div className="relative">
                      <input
                        disabled={isSubmitting}
                        type="text"
                        id="newCardName"
                        value={newCardName}
                        onChange={(e) => setNewCardName(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                        required={!useSavedPayment} // Conditionally set required
                      />
                      <User
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="newCardNumber"
                      className="block text-sm font-medium mb-2"
                    >
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        disabled={isSubmitting}
                        type="text"
                        id="newCardNumber"
                        value={newCardNumber}
                        onChange={(e) => setNewCardNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                        required={!useSavedPayment} // Conditionally set required
                      />
                      <CreditCard
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <label
                        htmlFor="newCardExpiry"
                        className="block text-sm font-medium mb-2"
                      >
                        Expiry Date
                      </label>
                      <input
                        disabled={isSubmitting}
                        type="text"
                        id="newCardExpiry"
                        value={newCardExpiry}
                        onChange={(e) => setNewCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="MM/YY"
                        required={!useSavedPayment} // Conditionally set required
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="newCardCCV"
                        className="block text-sm font-medium mb-2"
                      >
                        CCV
                      </label>
                      <input
                        disabled={isSubmitting}
                        type="text"
                        id="newCardCCV"
                        value={newCardCCV}
                        onChange={(e) => setNewCardCCV(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required={!useSavedPayment} // Conditionally set required
                      />
                    </div>
                  </div>
                </div>

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
                        disabled={isSubmitting}
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
                    <>
                      <Loader className="animate-spin mr-2" size={20} />{" "}
                      Processing...
                    </>
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
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
