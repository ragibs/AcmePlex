"use client";

import { useState } from "react";
import { Star, Clock, Calendar, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

// Mock data
const movie = {
  title: "Inception",
  poster:
    "https://i.ebayimg.com/00/s/MTYwMFgxMDk3/z/LlUAAOSwm8VUwoRL/$_57.JPG?set_id=880000500F",
  rating: 8.8,
  duration: "2h 28min",
  genre: "Sci-Fi, Action, Adventure",
  releaseDate: "2010-07-16",
};

const theaterResults = [
  {
    id: 1,
    name: "Cineplex Downtown",
    address: "123 Main St, Cityville",
    showtimes: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"],
  },
  {
    id: 2,
    name: "Starlight Cinema",
    address: "456 Park Ave, Townsburg",
    showtimes: ["11:15 AM", "2:45 PM", "6:15 PM", "9:45 PM"],
  },
  {
    id: 3,
    name: "Mega Movies",
    address: "789 Broadway, Metropolis",
    showtimes: ["10:30 AM", "2:00 PM", "5:30 PM", "9:00 PM"],
  },
];

export default function SearchByMovie() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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
              src={movie.poster}
              alt={movie.title}
              className="rounded-xl shadow-lg w-[300px] h-[450px] object-cover"
            />
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-light mb-4">
                {movie.title}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="text-primary-500 mr-1" size={20} />
                  <span>{movie.rating}/10</span>
                </div>
                <div className="flex items-center">
                  <Clock className="text-primary-500 mr-1" size={20} />
                  <span>{movie.duration}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="text-primary-500 mr-1" size={20} />
                  <span>{movie.releaseDate}</span>
                </div>
              </div>
              <p className="text-lg text-gray-300 mb-4">{movie.genre}</p>
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
          <h2 className="text-2xl font-light">Select Date</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </motion.div>

      {/* Theater Results Section */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-light mb-8">Showtimes & Tickets</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-4 px-6 text-left">Theater</th>
                <th className="py-4 px-6 text-left">Showtimes</th>
              </tr>
            </thead>
            <tbody>
              {theaterResults.map((theater) => (
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
                      {theater.showtimes.map((time, index) => (
                        <button
                          key={index}
                          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          {time}
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
        <button className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-colors flex items-center">
          Next: Seat Selection
          <ChevronRight className="ml-2" size={20} />
        </button>
      </motion.div>
    </motion.div>
  );
}
