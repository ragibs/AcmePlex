"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Minus,
  Plus,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
} from "lucide-react";

const ROWS = "ABCDEFGHIJ".split("");
const SEATS_PER_ROW = 10;
const TICKET_PRICE = 10;

// Mock data for movie information
const movieInfo = {
  title: "Inception",
  poster:
    "https://i.ebayimg.com/00/s/MTYwMFgxMDk3/z/LlUAAOSwm8VUwoRL/$_57.JPG?set_id=880000500F",
  rating: 8.8,
  duration: "2h 28min",
  genre: "Sci-Fi, Action, Adventure",
  theater: "Cineplex Downtown",
  date: "2023-05-20",
  time: "7:30 PM",
};

export default function SeatSelection() {
  const [ticketCount, setTicketCount] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setSelectedSeats([]);
    setTotalPrice(ticketCount * TICKET_PRICE);
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

  const handleSeatClick = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else if (selectedSeats.length < ticketCount) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Movie Information Section */}
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="bg-gray-800 rounded-lg p-4 flex items-center">
            <img
              src={movieInfo.poster}
              alt={movieInfo.title}
              width={100}
              height={150}
              className="rounded-lg mr-4"
            />
            <div>
              <h1 className="text-3xl font-light mb-2">{movieInfo.title}</h1>
              <p className="text-sm text-gray-400 mb-2">{movieInfo.genre}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <Clock className="text-primary-500 mr-2" size={16} />
                  <span>{movieInfo.duration}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="text-primary-500 mr-2" size={16} />
                  <span>
                    {movieInfo.date} at {movieInfo.time}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="text-primary-500 mr-2" size={16} />
                  <span>{movieInfo.theater}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Ticket Count Section */}
          <motion.div className="md:w-1/3" variants={itemVariants}>
            <h2 className="text-2xl font-light mb-4">Select Tickets</h2>
            <div className="bg-gray-800 rounded-lg p-4">
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
              <div className="flex items-center justify-between">
                <span className="text-lg">Total Price</span>
                <div className="flex items-center text-2xl font-light">
                  <DollarSign className="text-primary-500 mr-1" size={20} />
                  {totalPrice.toFixed(2)}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Seat Selection Section */}
          <motion.div className="md:w-2/3" variants={itemVariants}>
            <h2 className="text-2xl font-light mb-4">Select Seats</h2>
            <div className="bg-gray-800 rounded-lg p-4">
              <div
                className={`space-y-2 ${
                  ticketCount === 0 ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {ROWS.map((row) => (
                  <div key={row} className="flex justify-center gap-1">
                    <div className="w-6 text-center">{row}</div>
                    {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                      const seat = `${row}${i + 1}`;
                      return (
                        <button
                          key={seat}
                          onClick={() => handleSeatClick(seat)}
                          className={`w-8 h-8 rounded-lg ${
                            selectedSeats.includes(seat)
                              ? "bg-primary-500"
                              : "bg-gray-600 hover:bg-gray-500"
                          } transition-colors`}
                          disabled={
                            ticketCount === 0 ||
                            (selectedSeats.length === ticketCount &&
                              !selectedSeats.includes(seat))
                          }
                        />
                      );
                    })}
                  </div>
                ))}
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
            </div>
            <div className="mt-4 text-center">
              Selected Seats: {selectedSeats.join(", ") || "None"}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Next: Confirm Selection Button */}
      <motion.div
        className="fixed bottom-8 right-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          className={`bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-colors flex items-center ${
            selectedSeats.length !== ticketCount
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={selectedSeats.length !== ticketCount}
        >
          Confirm Selection
          <ChevronRight className="ml-2" size={20} />
        </button>
      </motion.div>
    </motion.div>
  );
}
