import React from "react";
import { Clock, Star, Calendar } from "lucide-react";

interface MovieCardProps {
  title: string;
  image: string;
  duration: string;
  rating: number;
  genre: string;
  showTimes: string[];
}

export default function MovieCard({
  title,
  image,
  duration,
  rating,
  genre,
  showTimes,
}: MovieCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-primary-500/50 transition-all duration-500">
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute bottom-0 p-4 w-full">
          <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full">
                  {genre}
                </span>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-500" />
                  <span className="text-xs text-yellow-500">{rating}/10</span>
                </div>
              </div>
              <h3 className="text-lg font-medium">{title}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Clock size={12} />
                <span>{duration}</span>
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={12} className="text-primary-400" />
                  <span className="text-xs font-medium">Today's Shows</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {showTimes.map((time, index) => (
                    <button
                      key={index}
                      className="px-2 py-1 text-xs bg-white/5 hover:bg-primary-500 rounded transition-colors duration-300"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg mt-2 text-sm transition-colors duration-300">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium truncate">{title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">{genre}</span>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-500" />
            <span className="text-xs">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
