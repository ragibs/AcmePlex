"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Minus,
  Plus,
  Calendar,
  Info,
  MapPin,
  DollarSign,
  ChevronLeft,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiConfig";
import PacmanLoader from "react-spinners/PacmanLoader";
import { useMovieContext } from "../context/MovieContext";
import usePreventPageRefresh from "../hooks/usePreventPageRefresh";
import { date } from "zod";

const TICKET_PRICE = 10;

interface Seat {
  id: number;
  seatNumber: string;
  booked: boolean;
}

interface SeatsResponse {
  booked: Seat[];
  available: Seat[];
}

export default function SeatSelection() {
  const [ticketCount, setTicketCount] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedSeatsId, setSelectedSeatsId] = useState<string[]>([]);

  const [totalPrice, setTotalPrice] = useState(0);
  const [seats, setSeats] = useState<SeatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, updateState } = useMovieContext();
  usePreventPageRefresh(
    "Are you sure you want to leave? Your progress may not be saved."
  );

  useEffect(() => {
    const fetchSeats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = api.get(`/showtime/${id}/seats`);

        setSeats((await response).data);
      } catch (err) {
        setError("Failed to fetch seats.");
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeats();
  }, [id]);

  useEffect(() => {
    if (!state.moviename) {
      setError(
        "It seems you’re attempting to access the page without selecting a showtime. Please select a showtime before proceeding."
      );
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
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

  const handleSeatClick = (seat: Seat) => {
    const { seatNumber, id } = seat;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
      setSelectedSeatsId(
        selectedSeatsId.filter((seatId) => seatId !== id.toString())
      );
    } else if (selectedSeats.length < ticketCount) {
      setSelectedSeats([...selectedSeats, seatNumber]);
      setSelectedSeatsId([...selectedSeatsId, id.toString()]);
    }
  };

  const renderSeats = () => {
    if (!seats) return null;

    const allSeats = [...seats.available, ...seats.booked].sort(
      (a, b) => a.id - b.id
    );

    const rows = Array.from(
      new Set(allSeats.map((seat) => seat.seatNumber[0]))
    );

    return rows.map((row) => (
      <div key={row} className="flex justify-center gap-1">
        <div className="w-6 text-center">{row}</div>
        {allSeats
          .filter((seat) => seat.seatNumber.startsWith(row))
          .map((seat) => (
            <button
              key={seat.id}
              onClick={() => !seat.booked && handleSeatClick(seat)}
              className={`w-8 h-8 rounded-lg ${
                seat.booked
                  ? "bg-gray-400 cursor-not-allowed"
                  : selectedSeats.includes(seat.seatNumber)
                  ? "bg-primary-500"
                  : "bg-gray-600 hover:bg-gray-500"
              } transition-colors`}
              disabled={
                seat.booked ||
                (selectedSeats.length === ticketCount &&
                  !selectedSeats.includes(seat.seatNumber))
              }
            />
          ))}
      </div>
    ));
  };

  const handleNext = () => {
    const calculatedTotalPrice = ticketCount * TICKET_PRICE;
    updateState("totalprice", calculatedTotalPrice);
    updateState("seats", selectedSeats);
    updateState("seatIds", selectedSeatsId);
    navigate("/confirmtickets");
  };

  const handlePrevious = () => {
    navigate(`/searchbymovie/3/${state.date}`);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Movie Information Section */}
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="bg-gray-800 rounded-lg p-4 flex items-center">
            <img
              src={state.poster}
              alt={state.moviename}
              width="100"
              height="150"
              className="rounded-lg mr-4"
            />
            <div>
              <h1 className="text-3xl font-light mb-2">{state.moviename}</h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <Info className="text-primary-500 mr-2" size={16} />
                  <span>{state.genre}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="text-primary-500 mr-2" size={16} />
                  <span>
                    {state.date} at {state.showtime}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="text-primary-500 mr-2" size={16} />
                  <span>{state.theatre}</span>
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
                {renderSeats()}
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
              <p>Selected Seats: {selectedSeats.join(", ") || "None"}</p>
              <p>
                * Please select the number of tickets before choosing your
                seats.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Change Showtime Button */}
      <motion.div
        className="fixed bottom-8 left-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-colors flex items-center md:w-auto md:h-auto w-15 h-12 justify-center"
          onClick={handlePrevious}
        >
          <ChevronLeft className="md:mr-2" size={20} />
          <span className="hidden md:inline">Change Showtime</span>
        </button>
      </motion.div>

      {/* Next: Confirm Selection Button */}
      <motion.div
        className="fixed bottom-8 right-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          className={`bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-colors flex items-center md:w-auto md:h-auto w-15 h-12 justify-center ${
            ticketCount === 0 || selectedSeats.length !== ticketCount
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={ticketCount === 0 || selectedSeats.length !== ticketCount}
          onClick={handleNext}
        >
          <span className="hidden md:inline">Confirm Selection</span>
          <ChevronRight className="md:ml-2" size={20} />
        </button>
      </motion.div>
    </motion.div>
  );
}
