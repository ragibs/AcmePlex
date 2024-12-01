import React, { useState, useEffect } from "react";
import { Search, Calendar, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Movie, Theatre } from "../types";

interface SearchProps {
  movies: Movie[];
  theatres: Theatre[];
}

export default function SearchBar({ movies, theatres }: SearchProps) {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<"movie" | "theater">("movie");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Movie | Theatre | null>(
    null
  );

  const filteredResults =
    searchType === "movie"
      ? movies.filter((movie) =>
          movie.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : theatres.filter((theater) =>
          theater.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const handleSelect = (item: Movie | Theatre) => {
    setSelectedItem(item);
    setSearchQuery(item.name);
    setShowResults(false);
  };

  const handleSearch = () => {
    if (!selectedItem || !selectedDate) return;

    const path =
      searchType === "movie"
        ? `/searchbymovie/${selectedItem.id}/${selectedDate}`
        : `/searchbytheatre/${selectedItem.id}/${selectedDate}`;

    navigate(path);
    resetSearch();
  };

  const resetSearch = () => {
    setSearchQuery("");
    setSelectedDate("");
    setSelectedItem(null);
    setShowResults(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.getElementById("search-container");
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      id="search-container"
      className="w-full max-w-4xl bg-white/5 backdrop-blur-xl p-3 rounded-2xl border border-white/10"
    >
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Type Toggle */}
        <div className="flex p-1 bg-black/20 rounded-xl w-full md:w-48">
          <button
            onClick={() => {
              setSearchType("movie");
              resetSearch();
            }}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
              searchType === "movie"
                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                : "text-white/70 hover:text-white"
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => {
              setSearchType("theater");
              resetSearch();
            }}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
              searchType === "theater"
                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                : "text-white/70 hover:text-white"
            }`}
          >
            Theaters
          </button>
        </div>

        {/* Search Input */}
        <div className="flex-1 relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary-400 transition-colors duration-300"
            size={20}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
              setSelectedItem(null);
            }}
            placeholder={`Search for ${
              searchType === "movie" ? "movies" : "theaters"
            }...`}
            className="w-full h-12 bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary-500/50 focus:bg-black/30 transition-all duration-300"
          />

          {/* Search Results Dropdown */}
          {showResults && searchQuery && !selectedItem && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 border border-white/10 rounded-xl overflow-hidden max-h-60 overflow-y-auto z-50">
              {filteredResults.length > 0 ? (
                filteredResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="w-full px-4 py-3 text-left hover:bg-primary-500/20 transition-colors duration-300 flex items-center gap-3 border-b border-white/5 last:border-0"
                  >
                    {searchType === "movie" && (
                      <img
                        src={(item as Movie).poster}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-sm text-gray-400">
                        {searchType === "movie"
                          ? (item as Movie).genre
                          : (item as Theatre).address}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-400 text-center">
                  No {searchType === "movie" ? "movies" : "theaters"} found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Date Input */}
        <div className="relative w-full md:w-48 group">
          <Calendar
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary-400 transition-colors duration-300"
            size={20}
          />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min="2024-12-01"
            disabled={!selectedItem}
            className={`w-full h-12 bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 text-white focus:outline-none focus:border-primary-500/50 focus:bg-black/30 transition-all duration-300 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert ${
              !selectedItem ? "cursor-not-allowed opacity-50" : ""
            }`}
          />
        </div>

        {/* Search/Clear Button */}
        {selectedItem ? (
          <button
            onClick={handleSearch}
            disabled={!selectedDate}
            className={`h-12 px-8 bg-primary-500 text-white font-medium rounded-xl transition-all duration-300 flex items-center gap-2 ${
              !selectedDate
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25"
            }`}
          >
            <Search size={18} />
            Search
          </button>
        ) : (
          <button
            onClick={resetSearch}
            disabled={!searchQuery}
            className={`h-12 px-8 bg-primary-500 text-white font-medium rounded-xl transition-all duration-300 flex items-center gap-2 ${
              !searchQuery
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25"
            }`}
          >
            <X size={18} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
