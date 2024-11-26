import SearchBar from "./SearchBar";
import { Movie, Theatre } from "../types";

interface HeroProps {
  movies: Movie[];
  theatres: Theatre[];
}

export default function Hero({ movies, theatres }: HeroProps) {
  return (
    <div className="relative min-h-[90vh]">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden opacity-50">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://videos.pexels.com/video-files/4761738/4761738-uhd_2732_1440_25fps.mp4"
        >
          <source
            src="https://videos.pexels.com/video-files/4761738/4761738-uhd_2732_1440_25fps.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

      {/* Content */}
      <div className="relative h-full min-h-[90vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-12">
        <div className="text-center max-w-2xl space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight">
            Experience Magic
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-500 font-normal">
              On The Big Screen
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto font-light">
            Immerse yourself in the latest blockbusters with state-of-the-art
            sound and picture quality.
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar movies={movies} theatres={theatres} />
      </div>
    </div>
  );
}
