import { Clock, Star, Calendar } from "lucide-react";
import { Movie } from "../types";
import { Link } from "react-router-dom";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-primary-500/50 transition-all duration-500">
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.name}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute bottom-0 p-4 w-full">
          <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full">
                  {movie.genre}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-yellow-500">
                    {movie.description}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-medium">{movie.name}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Clock size={12} />
                <span>{movie.duration} mins</span>
              </div>
              <Link to={`/searchbymovie/${movie.id}/2024-12-26`}>
                <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg mt-2 text-sm transition-colors duration-300">
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium truncate">{movie.name}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">{movie.genre}</span>
        </div>
      </div>
    </div>
  );
}
