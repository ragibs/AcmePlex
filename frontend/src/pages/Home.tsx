import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MovieCard from "../components/MovieCard";
import Footer from "../components/Footer";
import { Movie, Theatre } from "../types";
import api from "../api/apiConfig";
import { useMovieContext } from "../context/MovieContext";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

export const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const { clearState } = useMovieContext();

  useEffect(() => {
    clearState();
    Cookies.remove("user");
    const fetchMovies = async () => {
      try {
        const response = await api.get("/movies");
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    const fetchTheatres = async () => {
      try {
        const response = await api.get("/theatres");
        setTheatres(response.data);
      } catch (error) {
        console.error("Error fetching theatres:", error);
      }
    };

    fetchMovies();
    fetchTheatres();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero movies={movies} theatres={theatres} />

      {/* Now Showing */}
      <section id="now-showing" className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-light bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
              Now Showing
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      {/* Theaters */}
      <section
        id="theaters"
        className="py-12 bg-gradient-to-b from-black to-gray-900"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-light bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
              Our Theaters
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {theatres.map((theatre) => (
              <div
                key={theatre.id}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-primary-500/50 transition-all duration-500"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&q=80"
                    alt={theatre.name}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-1">{theatre.name}</h3>
                  <p className="text-xs text-gray-400 mb-3">
                    {theatre.address}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-xs">4.9/5.0</span>
                    </div>
                    <Link to={`/searchbytheatre/${theatre.id}/2024-12-26`}>
                      <button className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs rounded-lg transition-colors">
                        View Showtimes
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
