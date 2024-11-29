import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Mail, Home, List } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useMovieContext } from "../context/MovieContext";
import usePreventPageRefresh from "../hooks/usePreventPageRefresh";
import React, { useEffect } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

export default function BookingConfirmation() {
  const { id, email } = useParams();
  const { state } = useMovieContext();

  usePreventPageRefresh(
    "Are you sure you want to leave? Your progress may not be saved."
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.moviename) {
      setError(
        "It seems you’re attempting to access the page without selecting a showtime. Please select a showtime before proceeding."
      );
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
  }, []);

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
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-light mb-4">Booking Confirmed!</h1>
          <p className="text-xl text-gray-400">
            Thank you for your booking. An email confirmation will be sent to{" "}
            {email}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={state.poster}
                alt={`${state.moviename} poster`}
                style={{ width: "200px", height: "300px" }}
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-medium mb-4">{state.moviename}</h2>
              <p className="text-lg font-medium mb-4 text-primary-500">
                Reservation: {id}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="flex items-center">
                  <Mail className="text-primary-500 mr-2" size={20} />
                  <span>{email}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium">Seats:</span>{" "}
                  {state.seats.join(", ")}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link
            to="/"
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            <Home className="mr-2" size={20} />
            Back to Home
          </Link>
          <Link
            to="/getReservation"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            <List className="mr-2" size={20} />
            Manage Reservations
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
