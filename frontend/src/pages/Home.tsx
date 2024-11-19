import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MovieCard from "../components/MovieCard";
import Footer from "../components/Footer";

export const Home = () => {
  const movies = [
    {
      title: "Dune: Part Two",
      image:
        "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80",
      duration: "2h 46m",
      rating: 8.8,
      genre: "Sci-Fi",
      showTimes: ["11:30 AM", "3:00 PM", "6:30 PM", "10:00 PM"],
    },
    {
      title: "Poor Things",
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80",
      duration: "2h 21m",
      rating: 8.4,
      genre: "Drama",
      showTimes: ["12:00 PM", "3:30 PM", "7:00 PM", "9:45 PM"],
    },
    {
      title: "Kung Fu Panda 4",
      image:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80",
      duration: "1h 34m",
      rating: 7.5,
      genre: "Animation",
      showTimes: ["10:00 AM", "2:15 PM", "4:30 PM", "6:45 PM"],
    },
  ];

  const theaters = [
    {
      name: "IMAX Downtown",
      image:
        "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80",
      location: "123 Main St, Downtown",
      features: ["IMAX", "Dolby Atmos", "Recliner Seats"],
      rating: 4.8,
    },
    {
      name: "Luxury Cinema West",
      image:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80",
      location: "456 West Ave",
      features: ["4K Laser", "Premium Lounge", "In-seat Dining"],
      rating: 4.9,
    },
    {
      name: "Classic Theater East",
      image:
        "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&q=80",
      location: "789 East Blvd",
      features: ["Historic Venue", "Dolby Sound", "Art Films"],
      rating: 4.7,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />

      {/* Now Showing */}
      <section id="now-showing" className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-light bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
              Now Showing
            </h2>
            <button className="text-primary-400 hover:text-primary-300 transition text-sm">
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {movies.map((movie, index) => (
              <MovieCard key={index} {...movie} />
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
            <button className="text-primary-400 hover:text-primary-300 transition text-sm">
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {theaters.map((theater, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-primary-500/50 transition-all duration-500"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={theater.image}
                    alt={theater.name}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-1">{theater.name}</h3>
                  <p className="text-xs text-gray-400 mb-3">
                    {theater.location}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {theater.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-primary-500/10 text-primary-400 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-xs">{theater.rating}/5.0</span>
                    </div>
                    <button className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs rounded-lg transition-colors">
                      View Details
                    </button>
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
