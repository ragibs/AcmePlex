"use client";

import { useState, useEffect } from "react";
import { Info, Clock, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/apiConfig";
import { MovieWithTheatres } from "../types";
import { formatTimeToAmPm } from "../utils/formatTimeToAmPm";
import PacmanLoader from "react-spinners/PacmanLoader";
import { useMovieContext } from "../context/MovieContext";

export default function SearchByMovie() {
  const { id, date } = useParams();
  const navigate = useNavigate();
  const { clearState, updateState } = useMovieContext();

  const [movieWithTheatres, setMovieWithTheatres] =
    useState<MovieWithTheatres | null>(null);
  // To toggle active showtimes
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
  // To update the context with the showtime
  const [movieTime, setMovieTime] = useState<string | null>(null);

  const [theaterName, setTheaterName] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    clearState();
    const fetchTheatres = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(
          `/movie/${id}/showtimes?selectedDate=${date}`
        );
        if (
          !response.data ||
          !response.data.theatres ||
          response.data.theatres.length === 0
        ) {
          throw new Error("No theaters or showtimes found.");
        }
        setMovieWithTheatres(response.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch movie details. Redirecting to home...";
        setError(errorMessage);

        setTimeout(() => {
          navigate("/");
        }, 5000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTheatres();
  }, [id, date, navigate]);

  const handleShowtimeSelect = (
    showtimeId: string,
    theaterName: string,
    movieTime: string
  ) => {
    setSelectedShowtime(showtimeId);
    setTheaterName(theaterName);
    setMovieTime(formatTimeToAmPm(movieTime));
  };

  const handleNext = () => {
    updateState("moviename", movieWithTheatres?.title);
    updateState("poster", movieWithTheatres?.poster);
    updateState("genre", movieWithTheatres?.genre);
    updateState("showtime", movieTime);
    updateState("date", date);
    updateState("theatre", theaterName);
    updateState("showtimeId", selectedShowtime);
    navigate(`/seatselection/${selectedShowtime}`);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <PacmanLoader color="##0891b2" size={50} />
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
      className="min-h-screen bg-gray-900 text-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Movie Information Section */}
      <div className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-gray-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col md:flex-row items-center gap-8"
            variants={itemVariants}
          >
            <img
              src={movieWithTheatres?.poster}
              alt={movieWithTheatres?.title}
              className="rounded-xl shadow-lg w-[300px] h-[450px] object-cover"
            />
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-light mb-4">
                {movieWithTheatres?.title}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                <div className="flex items-center">
                  <Info className="text-primary-500 mr-1" size={20} />
                  <span>{movieWithTheatres?.genre}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="text-primary-500 mr-1" size={20} />
                  <span>{movieWithTheatres?.duration} min</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="text-primary-500 mr-1" size={20} />
                  <span>{movieWithTheatres?.releaseDate}</span>
                </div>
              </div>
              <p className="text-lg text-gray-300 mb-4">
                {movieWithTheatres?.description}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Date Selection */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light">Date Selected</h2>
          <input
            type="date"
            value={date}
            disabled
            className=" bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </motion.div>

      {/* Theater Results Section */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-light mb-8">Theatres & Showtimes</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-4 px-6 text-left">Theater</th>
                <th className="py-4 px-6 text-left">Showtimes</th>
              </tr>
            </thead>
            <tbody>
              {movieWithTheatres?.theatres?.map((theater) => (
                <motion.tr
                  key={theater.id}
                  className="border-b border-gray-800"
                  variants={itemVariants}
                >
                  <td className="py-4 px-6">
                    <h3 className="font-medium text-lg">{theater.name}</h3>
                    <p className="text-gray-400 text-sm">{theater.address}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-2">
                      {theater.showtimes?.map((showtime) => (
                        <button
                          key={showtime.id}
                          onClick={() =>
                            handleShowtimeSelect(
                              showtime.id,
                              theater.name,
                              showtime.startTime
                            )
                          }
                          className={`px-4 py-2 ${
                            selectedShowtime === showtime.id
                              ? "bg-primary-600"
                              : selectedShowtime
                              ? "bg-gray-700"
                              : "bg-primary-500"
                          } hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors`}
                        >
                          {formatTimeToAmPm(showtime.startTime)}
                        </button>
                      ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      {/* Change Showtime Button */}

      <motion.div
        className="fixed bottom-8 left-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-colors flex items-center md:w-auto md:h-auto w-15 h-12 justify-center"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="md:mr-2" size={20} />
          <span className="hidden md:inline">Change Movie</span>
        </button>
      </motion.div>

      {/* Next: Seat Selection Button */}
      <motion.div
        className="fixed bottom-8 right-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          className={`bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-colors flex items-center ${
            !selectedShowtime ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!selectedShowtime}
          onClick={handleNext}
        >
          <ChevronRight className="ml-2" size={20} />
          <span className="hidden md:inline">Next: Seat Selection</span>
        </button>
      </motion.div>
    </motion.div>
  );
}
