"use client";

import { useState, useEffect } from "react";
import { Info, Clock, Calendar, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import api from "../api/apiConfig";
import { MovieWithTheatres } from "../types";
import { formatTimeToAmPm } from "../utils/formatTimeToAmPm";
import { Link } from "react-router-dom";

export default function SearchByMovie() {
  const { id, date } = useParams();
  const [movieWithTheatres, setMovieWithTheatres] =
    useState<MovieWithTheatres | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);

  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const response = await api.get(
          `/movie/${id}/showtimes?selectedDate=${date}`
        );
        console.log(response.data);
        setMovieWithTheatres(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchTheatres();
  }, [id, date]);

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

  const handleShowtimeSelect = (showtimeId: string) => {
    setSelectedShowtime(showtimeId); // Save selected showtime to state
  };

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
                  <span>{movieWithTheatres?.duration} mins</span>
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
          <h2 className="text-2xl font-light">Date</h2>
          <input
            type="date"
            value={date}
            disabled
            className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              {movieWithTheatres?.theatres.map((theater) => (
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
                          onClick={() => handleShowtimeSelect(showtime.id)}
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

      {/* Next: Seat Selection Button */}
      <motion.div
        className="fixed bottom-8 right-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Link to={`/seatselection/${selectedShowtime}`}>
          <button
            className={`bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-colors flex items-center ${
              !selectedShowtime ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!selectedShowtime} // Disable button if no showtime is selected
          >
            Next: Seat Selection
            <ChevronRight className="ml-2" size={20} />
          </button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
