"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Mail, Home, List } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for the booking confirmation
const bookingData = {
  reservationNumber: "RES12345",
  movie: {
    title: "Inception",
    poster: "/placeholder.svg?height=300&width=200",
  },
  showtime: "7:30 PM",
  date: "2023-05-20",
  theater: "Cineplex Downtown",
  seats: ["A1", "A2", "A3"],
  email: "user@example.com",
};

export default function BookingConfirmation() {
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
            {bookingData.email}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={bookingData.movie.poster}
                alt={`${bookingData.movie.title} poster`}
                style={{ width: "200px", height: "300px" }}
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-medium mb-4">
                {bookingData.movie.title}
              </h2>
              <p className="text-lg font-medium mb-4 text-primary-500">
                Reservation: {bookingData.reservationNumber}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <MapPin className="text-primary-500 mr-2" size={20} />
                  <span>{bookingData.theater}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="text-primary-500 mr-2" size={20} />
                  <span>{bookingData.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="text-primary-500 mr-2" size={20} />
                  <span>{bookingData.showtime}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="text-primary-500 mr-2" size={20} />
                  <span>{bookingData.email}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium">Seats:</span>{" "}
                  {bookingData.seats.join(", ")}
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
            to="/manage-reservations"
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
