"use client";

import React, { useState } from "react";
import { MapPin, Phone, Globe, Calendar, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

// Mock data
const theater = {
  name: "Cineplex Metropolis",
  address: "123 Main St, Cityville, State 12345",
  phone: "(555) 123-4567",
  website: "www.cineplexmetropolis.com",
};

const movieResults = [
  {
    id: 1,
    title: "Inception",
    poster:
      "https://i.ebayimg.com/00/s/MTYwMFgxMDk3/z/LlUAAOSwm8VUwoRL/$_57.JPG?set_id=880000500F",
    genre: "Sci-Fi, Action, Adventure",
    duration: "2h 28min",
    rating: 8.8,
    showtimes: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"],
  },
  {
    id: 2,
    title: "The Grand Budapest Hotel",
    poster:
      "https://myhotposters.com/cdn/shop/products/mHP0309_1024x1024.jpeg?v=1571444287",
    genre: "Comedy, Drama",
    duration: "1h 39min",
    rating: 8.1,
    showtimes: ["11:15 AM", "2:45 PM", "6:15 PM", "9:45 PM"],
  },
  {
    id: 3,
    title: "Black Panther",
    poster: "https://m.media-amazon.com/images/I/A1PaCX4oXjL.jpg",
    genre: "Action, Adventure",
    duration: "2h 14min",
    rating: 7.3,
    showtimes: ["10:30 AM", "2:00 PM", "5:30 PM", "9:00 PM"],
  },
];

export default function SearchByTheatre() {
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
                {theater.name}
              </h1>
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                <div className="flex items-center">
                  <MapPin className="text-primary-500 mr-1" size={20} />
                  <span>{theater.address}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="text-primary-500 mr-1" size={20} />
                  <span>{theater.phone}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="text-primary-500 mr-1" size={20} />
                  <a
                    href={`https://${theater.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-400 transition-colors"
                  >
                    {theater.website}
                  </a>
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
          <h2 className="text-2xl font-light">Select Date</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
          {movieResults.map((movie) => (
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
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Calendar className="text-primary-500 mr-1" size={16} />
                    <span className="text-sm">{movie.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-primary-500 mr-1 text-sm">★</span>
                    <span className="text-sm">{movie.rating}/10</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {movie.showtimes.map((time, index) => (
                    <button
                      key={index}
                      className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
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
