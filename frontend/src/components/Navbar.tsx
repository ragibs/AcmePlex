import { Film, Ticket } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <Film size={32} className="text-primary-500" />
            <span className="text-2xl font-bold">AcmePlex</span>
          </div>

          <button className="bg-primary-500 text-white px-6 py-2 rounded-full hover:bg-primary-600 transition flex items-center gap-2">
            <Ticket size={20} />
            Manage Reservations
          </button>
        </div>
      </div>
    </nav>
  );
}
