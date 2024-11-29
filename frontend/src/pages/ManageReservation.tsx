import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, X, Mail } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api/apiConfig";
import { ReservationResponse } from "../types";
import PacmanLoader from "react-spinners/PacmanLoader";
import usePreventPageRefresh from "../hooks/usePreventPageRefresh";

const reservation = {
  id: 1,
  reservationNumber: "RES001",
  movieTitle: "Inception",
  poster: "/placeholder.svg?height=150&width=100",
  theater: "Cineplex Downtown",
  date: "2023-05-20",
  time: "7:30 PM",
  seats: ["A1", "A2", "A3"],
  ticketCount: 3,
  totalAmount: 45.0,
};

export default function ManageReservation() {
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
  const navigate = useNavigate();

  usePreventPageRefresh(
    "Are you sure you want to leave? Your progress may not be saved."
  );
  const [reservationData, setReservationData] =
    useState<ReservationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { email, id } = useParams<{ email: string; id: string }>();

  useEffect(() => {
    const fetchReservation = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/reservation/get/${email}/${id}`);
        setReservationData(response.data);
      } catch (err: any) {
        if (err.response && err.response.status === 406) {
          setError("This reservation can no longer be canceled.");
        }
        setError("Failed to fetch reservation data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservation();
  }, [email, id]);

  const isRegistered = reservationData
    ? reservationData.reservationValue === reservationData.eligibleRefundValue
    : false;

  const cancelEligibility = reservationData?.eligibleRefundValue === 0;
  function extractDateTime(showTime: string): { date: string; time: string } {
    const dateObj = new Date(showTime);

    const date = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const time = dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return { date, time };
  }

  const { date: showDate, time: showTime } = extractDateTime(
    reservationData?.showTime || ""
  );

  const handleCancel = (id: number | undefined, email: string | undefined) => {
    navigate(
      `/cancellation-confirmed/${encodeURIComponent(email || "")}/${id}`
    );
  };

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

      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center mb-8"
          variants={itemVariants}
        >
          <h1 className="text-4xl font-light text-center sm:text-left">
            Your Reservations
          </h1>
          <div className="mt-4 sm:mt-0 flex items-center">
            <span className="mr-2">{email}</span>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                isRegistered ? "bg-green-500" : "bg-yellow-500"
              }`}
            >
              {isRegistered ? "Registered" : "Guest"}
            </span>
          </div>
        </motion.div>

        <motion.div className="space-y-6" variants={itemVariants}>
          <div
            key={reservationData?.reservationID}
            className="bg-gray-800 rounded-lg p-6 shadow-lg"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src={reservationData?.moviePoster}
                  alt={`${reservationData?.movieName} poster`}
                  style={{ width: "100px", height: "150px" }}
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="flex-grow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h2 className="text-2xl font-medium mb-2 md:mb-0">
                      {reservationData?.movieName}
                    </h2>
                    <p className="text-sm text-gray-400">
                      Reservation: {reservationData?.reservationID}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleCancel(
                        reservationData?.reservationID,
                        reservationData?.userEmail
                      )
                    }
                    className={`${
                      cancelEligibility
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center mt-2 md:mt-0`}
                    disabled={!reservationData || cancelEligibility}
                  >
                    {cancelEligibility ? "Not Eligible to Cancel" : "Cancel"}
                    <X className="ml-2" size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <MapPin className="text-primary-500 mr-2" size={20} />
                    <span>{reservationData?.theatreName}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="text-primary-500 mr-2" size={20} />
                    <span>{showDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="text-primary-500 mr-2" size={20} />
                    <span>{showTime}</span>
                  </div>
                  <div>
                    <span className="font-medium">Seats:</span>{" "}
                    {reservationData?.seatName.join(", ")}
                  </div>
                  <div>
                    <span className="font-medium">Tickets:</span>{" "}
                    {reservationData?.seatName.length}
                  </div>
                  <div>
                    <span className="font-medium">Total Amount:</span> $
                    {reservationData?.reservationValue}
                  </div>
                  <div>
                    <span className="font-medium">Eligible Refund:</span> $
                    {reservationData?.eligibleRefundValue}
                  </div>

                  {cancelEligibility && (
                    <div className="text-sm text-gray-400 mt-2">
                      * Showtimes less than 72 hours away are not eligible for
                      cancellation.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
