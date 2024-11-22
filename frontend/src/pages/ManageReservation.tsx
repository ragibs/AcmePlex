import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, X } from "lucide-react";
import { Link } from "react-router-dom";
const reservations = [
  {
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
  },
  {
    id: 2,
    reservationNumber: "RES002",
    movieTitle: "The Grand Budapest Hotel",
    poster: "/placeholder.svg?height=150&width=100",
    theater: "Starlight Cinema",
    date: "2023-05-25",
    time: "6:00 PM",
    seats: ["B5", "B6"],
    ticketCount: 2,
    totalAmount: 30.0,
  },
  {
    id: 3,
    reservationNumber: "RES003",
    movieTitle: "Black Panther",
    poster: "/placeholder.svg?height=150&width=100",
    theater: "Mega Movies",
    date: "2023-05-30",
    time: "8:00 PM",
    seats: ["C7", "C8", "C9", "C10"],
    ticketCount: 4,
    totalAmount: 60.0,
  },
];

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

  const handleCancel = (id: number) => {
    console.log(`Cancelling reservation ${id}`);
    // Add logic to cancel reservation here
  };

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
        <motion.h1
          className="text-4xl font-light mb-8 text-center"
          variants={itemVariants}
        >
          Your Reservations
        </motion.h1>

        <motion.div className="space-y-6" variants={itemVariants}>
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={reservation.poster}
                    alt={`${reservation.movieTitle} poster`}
                    width="100"
                    height="150"
                    className="rounded-lg shadow-md"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                      <h2 className="text-2xl font-medium mb-2 md:mb-0">
                        {reservation.movieTitle}
                      </h2>
                      <p className="text-sm text-gray-400">
                        Reservation: {reservation.reservationNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCancel(reservation.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center mt-2 md:mt-0"
                    >
                      Cancel
                      <X className="ml-2" size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <MapPin className="text-primary-500 mr-2" size={20} />
                      <span>{reservation.theater}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="text-primary-500 mr-2" size={20} />
                      <span>{reservation.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="text-primary-500 mr-2" size={20} />
                      <span>{reservation.time}</span>
                    </div>
                    <div>
                      <span className="font-medium">Seats:</span>{" "}
                      {reservation.seats.join(", ")}
                    </div>
                    <div>
                      <span className="font-medium">Tickets:</span>{" "}
                      {reservation.ticketCount}
                    </div>
                    <div>
                      <span className="font-medium">Total Amount:</span> $
                      {reservation.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
