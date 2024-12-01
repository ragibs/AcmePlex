"use client";

import React, { useEffect, useState } from "react";
import { MapPin, ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/apiConfig";
import { TheatreWithMovies, Movie } from "../types";
import { formatTimeToAmPm } from "../utils/formatTimeToAmPm";
import PacmanLoader from "react-spinners/PacmanLoader";
import { useMovieContext } from "../context/MovieContext";

export default function SearchByTheatre() {
  const { id, date } = useParams();
  const navigate = useNavigate();
  const { clearState, updateState } = useMovieContext();

  const [theatreWithMovies, setTheatreWithMovies] =
    useState<TheatreWithMovies | null>(null);
  // To toggle active showtimes
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
  // To update the context with the showtime
  const [movieTime, setMovieTime] = useState<string | null>(null);
  const [movieName, setMovieName] = useState<string | null>(null);
  const [movieGenre, setMovieGenre] = useState<string | null>(null);
  const [moviePoster, setMoviePoster] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    clearState();
    const fetchTheatreWithMovies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(
          `/theatre/${id}/showtimes?selectedDate=${date}`
        );
        if (
          !response.data ||
          !response.data.movies ||
          response.data.movies.length === 0
        ) {
          throw new Error("No movies or showtimes found.");
        }
        setTheatreWithMovies(response.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to fetch theater details. Redirecting to home...";
        setError(errorMessage);

        setTimeout(() => {
          navigate("/");
        }, 5000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTheatreWithMovies();
  }, [id, date, navigate]);

  const handleShowtimeSelect = (
    showtimeId: string,
    movieTime: string,
    movieName: string,
    movieGenre: string,
    moviePoster: string
  ) => {
    setSelectedShowtime(showtimeId);
    setMovieTime(formatTimeToAmPm(movieTime));
    setMovieName(movieName);
    setMovieGenre(movieGenre);
    setMoviePoster(moviePoster);
  };

  const handleNext = () => {
    updateState("moviename", movieName);
    updateState("poster", moviePoster);
    updateState("showtime", movieTime);
    updateState("genre", movieGenre);
    updateState("date", date);
    updateState("theatre", theatreWithMovies?.name);
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
      className="min-h-screen bg-gray-900 text-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Theater Information Section */}
      <div className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-gray-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col items-center gap-8"
            variants={itemVariants}
          >
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-light mb-4">
                {theatreWithMovies?.name}
              </h1>
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                <div className="flex items-center">
                  <MapPin className="text-primary-500 mr-1" size={20} />
                  <span>{theatreWithMovies?.address}</span>
                </div>
              </div>
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
      {/* Movie Results Section */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-light mb-8">Now Showing</h2>
        <div className="space-y-8">
          {theatreWithMovies?.movies.map((movie) => (
            <motion.div
              key={movie.id}
              className="flex flex-col md:flex-row gap-6 border-b border-gray-800 pb-8"
              variants={itemVariants}
            >
              <img
                src={movie.poster}
                alt={movie.title}
                width={100}
                height={150}
                className="rounded-lg shadow-lg"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-medium mb-2">{movie.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{movie.genre}</p>
                <div className="flex flex-wrap gap-2">
                  {movie.showtimes?.map((showtime) => (
                    <button
                      key={showtime.id}
                      onClick={() =>
                        handleShowtimeSelect(
                          showtime.id,
                          showtime.startTime,
                          movie.title,
                          movie.genre,
                          movie.poster
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
              </div>
            </motion.div>
          ))}
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
          <span className="hidden md:inline">Change Theatre</span>
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
          Next: Seat Selection
          <ChevronRight className="ml-2" size={20} />
        </button>
      </motion.div>
    </motion.div>
  );
}
