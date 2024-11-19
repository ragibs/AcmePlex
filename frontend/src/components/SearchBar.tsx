import React, { useState } from "react";
import { Search, Calendar } from "lucide-react";

export default function SearchBar() {
  const [searchType, setSearchType] = useState<"movie" | "theater">("movie");

  return (
    <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
      <div className="flex flex-col md:flex-row gap-2">
        {/* Search Type Toggle */}
        <div className="flex p-1 bg-black/20 rounded-xl w-full md:w-48">
          <button
            onClick={() => setSearchType("movie")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              searchType === "movie"
                ? "bg-primary-500 text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setSearchType("theater")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              searchType === "theater"
                ? "bg-primary-500 text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            Theaters
          </button>
        </div>

        {/* Search Input */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
            size={20}
          />
          <input
            type="text"
            placeholder={
              searchType === "movie"
                ? "Search for movies..."
                : "Search for theaters..."
            }
            className="w-full h-12 bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:border-primary-500/50"
          />
        </div>

        {/* Date Input */}
        <div className="relative w-full md:w-48">
          <Calendar
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
            size={20}
          />
          <input
            type="date"
            className="w-full h-12 bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 text-white focus:outline-none focus:border-primary-500/50 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
          />
        </div>

        {/* Search Button */}
        <button className="h-12 px-8 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors">
          Search
        </button>
      </div>
    </div>
  );
}
