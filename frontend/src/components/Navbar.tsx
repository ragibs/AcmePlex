import { Film, Ticket, Gift } from "lucide-react";
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Film size={32} className="text-primary-500" strokeWidth={1.5} />
            <span className="text-2xl font-light tracking-wide">AcmePlex</span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-4">
            <Link to="/checkbalance">
              <button className="bg-primary-500/10 text-primary-300 px-5 py-2.5 rounded-xl hover:bg-primary-500 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                <Gift
                  size={20}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <span className="hidden sm:inline">Check Balance</span>
              </button>
            </Link>

            <Link to="/getreservation">
              <button className="bg-primary-500/10 text-primary-300 px-5 py-2.5 rounded-xl hover:bg-primary-500 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                <Ticket
                  size={20}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <span className="hidden sm:inline">Manage Reservations</span>
              </button>{" "}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
