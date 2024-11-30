import React, { useState, useEffect } from "react";
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
  Loader,
  Minus,
  Plus,
  AlertCircle,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { generatePaymentConfirmationNumber } from "../utils/generatePaymentConfirmationNumber";
import usePreventPageRefresh from "../hooks/usePreventPageRefresh";
import api from "../api/apiConfig";
import PacmanLoader from "react-spinners/PacmanLoader";
import Cookies from "js-cookie";
import { PaymentInfo } from "../types";
import { formatTimeToAmPm } from "../utils/formatTimeToAmPm";
import { useMovieContext } from "../context/MovieContext";

const TICKET_PRICE = 10;

interface Seat {
  id: number;
  seatNumber: string;
  booked: boolean;
}

interface SeatsResponse {
  booked: Seat[];
  available: Seat[];
  allowedSeatCount: number;
}

export default function ExclusiveBooking() {
  const { state, updateState } = useMovieContext();

  const [seats, setSeats] = useState<SeatsResponse | null>(null);
  const [ticketCount, setTicketCount] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedSeatsId, setSelectedSeatsId] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showtimeID, setShowtimeID] = useState<string>();

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
  const [couponEmail, setCouponEmail] = useState("");

  const { id, email } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  usePreventPageRefresh(
    "Are you sure you want to leave? Your progress may not be saved."
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const movieResponse = await api.get(`/movies/exclusive`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("user")?.replace(
              /^"|"$/g,
              ""
            )}`,
            "Content-Type": "application/json",
          },
        });

        const movieId = movieResponse.data[0].id;
        const showtimeResponse = await api.get(
          `/movie/${movieId}/showtimes?selectedDate=2024-11-03`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("user")?.replace(
                /^"|"$/g,
                ""
              )}`,
              "Content-Type": "application/json",
            },
          }
        );

        const showtimeId = showtimeResponse.data.theatres[0].showtimes[0].id; // Adjust key to match your API response structure

        updateState("moviename", showtimeResponse.data.title);
        updateState("poster", showtimeResponse.data.poster);
        updateState("theatre", showtimeResponse.data.theatres[0].name);
        updateState(
          "date",
          new Date(showtimeResponse.data.theatres[0].showtimes[0].startTime)
            .toISOString()
            .split("T")[0]
        );
        updateState(
          "showtime",
          formatTimeToAmPm(
            showtimeResponse.data.theatres[0].showtimes[0].startTime
          )
        );

        setShowtimeID(showtimeId);

        const [seatsResponse, paymentResponse] = await Promise.all([
          api.get(`/showtime/${showtimeId}/seats`),
          api.get(`/payment/${email}`, {
            headers: {
              Authorization: `Bearer ${Cookies.get("user")?.replace(
                /^"|"$/g,
                ""
              )}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        setSeats(seatsResponse.data);
        setPaymentInfo(paymentResponse.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch necessary data.");
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, email, navigate]);

  useEffect(() => {
    setSelectedSeats([]);
    setTotalPrice(ticketCount * TICKET_PRICE);
    updateState("totalprice", ticketCount * TICKET_PRICE);
  }, [ticketCount]);

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

  const handleSeatClick = (seat: Seat) => {
    const { seatNumber, id } = seat;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
      setSelectedSeatsId(
        selectedSeatsId.filter((seatId) => seatId !== id.toString())
      );
    } else if (selectedSeats.length < ticketCount) {
      setSelectedSeats([...selectedSeats, seatNumber]);
      setSelectedSeatsId([...selectedSeatsId, id.toString()]);
    }
  };

  const renderSeats = () => {
    if (!seats) return null;

    const allSeats = [...seats.available, ...seats.booked].sort(
      (a, b) => a.id - b.id
    );
    const rows = Array.from(
      new Set(allSeats.map((seat) => seat.seatNumber[0]))
    );

    return rows.map((row) => (
      <div key={row} className="flex justify-center gap-1">
        <div className="w-6 text-center">{row}</div>
        {allSeats
          .filter((seat) => seat.seatNumber.startsWith(row))
          .map((seat) => (
            <button
              key={seat.id}
              onClick={() => !seat.booked && handleSeatClick(seat)}
              className={`w-8 h-8 rounded-lg ${
                seat.booked
                  ? "bg-gray-400 cursor-not-allowed"
                  : selectedSeats.includes(seat.seatNumber)
                  ? "bg-primary-500"
                  : "bg-gray-600 hover:bg-gray-500"
              } transition-colors`}
              disabled={
                seat.booked ||
                (selectedSeats.length === ticketCount &&
                  !selectedSeats.includes(seat.seatNumber))
              }
            />
          ))}
      </div>
    ));
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
          value: couponValue > totalPrice ? totalPrice : couponValue,
          code: couponCode,
        });
        setFormError("");
      } else {
        setFormError("The coupon is not active.");
        setAppliedCoupon(null);
      }
    } catch (error: any) {
      setFormError(
        typeof error.response?.data === "string"
          ? error.response?.data
          : error.response?.data?.error ||
              "An unexpected error occurred. Please try again."
      );
      setAppliedCoupon(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
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

        if (couponStatus !== "active" || !couponBalance || couponBalance <= 0) {
          setFormError(
            "The applied coupon is invalid or has insufficient balance."
          );
          return;
        }

        const remainingBalance = Math.max(
          couponBalance - totalPrice,
          0
        ).toFixed(2);

        const couponRedemptionPayload = {
          email: couponEmail,
          couponCode: appliedCoupon.code,
          couponValue: parseFloat(remainingBalance),
        };

        const redemptionResponse = await api.put(
          "/coupon/redeem",
          couponRedemptionPayload
        );

        if (redemptionResponse.status !== 202) {
          setFormError("Failed to redeem the coupon. Please try again.");
          return;
        }
      }

      const payload = {
        showtimeID: showtimeID,
        seatIDList: selectedSeatsId,
        userEmail: email,
        paymentConfirmation: generatePaymentConfirmationNumber(),
        reservationValue: totalPrice,
      };

      const response = await api.post("/reservation/create", payload);

      if (response.status === 201) {
        navigate(`/bookingconfirmation/${response.data}/${email}`);
      } else {
        setFormError("Failed to create a reservation. Please try again.");
      }
    } catch (error: any) {
      setFormError(
        typeof error.response?.data === "string"
          ? error.response?.data
          : error.response?.data?.error ||
              "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAfterDiscount = appliedCoupon
    ? Math.max(totalPrice - appliedCoupon.value, 0)
    : totalPrice;

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

  if (seats?.allowedSeatCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <AlertCircle size={64} className="text-red-500 mb-4" />{" "}
        <h1 className="text-3xl font-bold mb-4">No Seats Available</h1>
        <p className="text-lg text-gray-400 mb-6">
          Unfortunately, no seats are currently available for this showtime.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-md"
        >
          Go Back to Homepage
        </button>
      </div>
    );
  }

  if (
    seats?.allowedSeatCount !== undefined &&
    ticketCount > seats.allowedSeatCount
  ) {
    setTicketCount(seats.allowedSeatCount);
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
          Exclusive Movie Booking
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Movie Information and Seat Selection */}
          <motion.div className="lg:w-1/2" variants={itemVariants}>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
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
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
              <h3 className="text-xl font-medium mb-4">Select Tickets</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg">Number of Tickets</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setTicketCount(Math.max(0, ticketCount - 1))}
                    className="bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-full transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-2xl font-light w-8 text-center">
                    {ticketCount}
                  </span>
                  <button
                    onClick={() => setTicketCount(ticketCount + 1)}
                    className="bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-full transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-medium mb-4">Select Seats</h3>
              <div
                className={`space-y-2 ${
                  ticketCount === 0 ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {renderSeats()}
              </div>
              <div className="mt-4 flex justify-center gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-600 rounded mr-2"></div>
                  Available
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-primary-500 rounded mr-2"></div>
                  Selected
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
                  Occupied
                </div>
              </div>
              <div className="mt-4 text-center">
                <p>Selected Seats: {selectedSeats.join(", ") || "None"}</p>
                <p className="text-sm text-gray-400 mt-2">
                  * Please select the number of tickets before choosing your
                  seats.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Payment Information */}
          <motion.div className="lg:w-1/2" variants={itemVariants}>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-medium mb-4">Payment Details</h3>
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
                          Credit card ending in{" "}
                          {paymentInfo?.cardNumber.slice(-4)}
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
                    useSavedPayment ? "opacity-50 pointer-events-none" : ""
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
                        type="text"
                        id="newCardName"
                        value={newCardName}
                        onChange={(e) => setNewCardName(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                        required={!useSavedPayment}
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
                        type="text"
                        id="newCardNumber"
                        value={newCardNumber}
                        onChange={(e) => setNewCardNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 pl-10"
                        required={!useSavedPayment}
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
                        type="text"
                        id="newCardExpiry"
                        value={newCardExpiry}
                        onChange={(e) => setNewCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="MM/YY"
                        required={!useSavedPayment}
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
                        type="text"
                        id="newCardCCV"
                        value={newCardCCV}
                        onChange={(e) => setNewCardCCV(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required={!useSavedPayment}
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

                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-2">Order Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tickets ({ticketCount})</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-primary-400">
                        <span>Coupon Discount</span>
                        <span>-${appliedCoupon.value.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>${totalAfterDiscount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                  disabled={
                    isSubmitting ||
                    ticketCount === 0 ||
                    selectedSeats.length !== ticketCount
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin mr-2" size={20} />{" "}
                      Processing...
                    </>
                  ) : (
                    "Complete Booking"
                  )}
                </button>
              </form>
              {formError && (
                <div className="mt-4 text-red-500 text-center py-2 px-4 rounded-md">
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
